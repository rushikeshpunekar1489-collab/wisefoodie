import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCatalogDocuments } from '../lib/ai/catalog';
import { loadKBChunks } from '../lib/ai/kb';

interface IndexRecord {
  id: string;
  type: 'product' | 'kb';
  slug: string;
  title: string;
  category?: string;
  content: string;
  embedding?: number[];
  hash: string;
}

interface IndexFile {
  version: 1;
  contentHash: string;
  updatedAt: string;
  totalProducts: number;
  totalKBChunks: number;
  hasEmbeddings: boolean;
  records: IndexRecord[];
}

function computeFileHash(filePath: string): string {
  if (!fs.existsSync(filePath)) return '';
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function computeCatalogHash(): string {
  const root = process.cwd();
  const productsHash = computeFileHash(path.join(root, 'data', 'products.json'));

  const kbDir = path.join(root, 'data', 'kb');
  let kbHashes: string[] = [];
  if (fs.existsSync(kbDir)) {
    const listFiles = (dir: string): string[] => {
      let res: string[] = [];
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) res = res.concat(listFiles(p));
        else if (e.name.endsWith('.md')) res.push(computeFileHash(p));
      }
      return res;
    };
    kbHashes = listFiles(kbDir);
  }

  return crypto
    .createHash('sha256')
    .update(productsHash + kbHashes.sort().join(''))
    .digest('hex');
}

export async function buildIndex(forceRebuild = false): Promise<IndexFile> {
  const root = process.cwd();
  const outDir = path.join(root, 'data', 'ai');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const indexPath = path.join(outDir, 'index.json');

  const currentContentHash = computeCatalogHash();

  let existingIndex: IndexFile | null = null;
  if (!forceRebuild && fs.existsSync(indexPath)) {
    try {
      existingIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      if (existingIndex && existingIndex.contentHash === currentContentHash) {
        console.log(`⚡ Index is already up-to-date (hash: ${currentContentHash.slice(0, 10)}).`);
        console.log(`Indexed: ${existingIndex.totalProducts} products, ${existingIndex.totalKBChunks} KB chunks.`);
        return existingIndex;
      }
    } catch {
      existingIndex = null;
    }
  }

  console.log('🔄 Building WiseFoodies AI Catalog and Knowledge Base Index...');

  const products = getCatalogDocuments();
  const kbChunks = loadKBChunks();

  const apiKey = process.env.GEMINI_API_KEY;
  const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';
  let genAI: GoogleGenerativeAI | null = null;
  let canEmbed = false;

  if (apiKey) {
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      const testModel = genAI.getGenerativeModel({ model: embeddingModel });
      await testModel.embedContent('WiseFoodies');
      canEmbed = true;
      console.log(`✅ Semantic embeddings active via Gemini (${embeddingModel})`);
    } catch {
      canEmbed = false;
      console.log('ℹ️ Gemini embeddings unavailable (key missing, invalid, or offline). Building keyword-only index.');
    }
  } else {
    console.log('ℹ️ No GEMINI_API_KEY found. Building fast keyword/fuzzy index.');
  }

  const existingMap = new Map<string, IndexRecord>();
  if (existingIndex?.records) {
    for (const r of existingIndex.records) {
      existingMap.set(r.id, r);
    }
  }

  const records: IndexRecord[] = [];
  let skippedCount = 0;
  let embeddedCount = 0;

  // Process Products
  for (const p of products) {
    const itemHash = crypto.createHash('md5').update(p.embeddingText).digest('hex');
    const existing = existingMap.get(`prod-${p.slug}`);

    if (existing && existing.hash === itemHash && (!canEmbed || existing.embedding)) {
      records.push(existing);
      skippedCount++;
      continue;
    }

    let embedding: number[] | undefined;
    if (canEmbed && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: embeddingModel });
        const res = await model.embedContent(p.embeddingText.slice(0, 2000));
        embedding = res.embedding.values;
        embeddedCount++;
      } catch (err) {
        // Fall back to keyword without failing build
        embedding = undefined;
      }
    }

    records.push({
      id: `prod-${p.slug}`,
      type: 'product',
      slug: p.slug,
      title: `${p.brand} ${p.name}`,
      category: p.category,
      content: p.embeddingText,
      embedding,
      hash: itemHash,
    });
  }

  // Process KB Chunks
  for (const c of kbChunks) {
    const itemHash = crypto.createHash('md5').update(c.content).digest('hex');
    const existing = existingMap.get(c.id);

    if (existing && existing.hash === itemHash && (!canEmbed || existing.embedding)) {
      records.push(existing);
      skippedCount++;
      continue;
    }

    let embedding: number[] | undefined;
    if (canEmbed && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: embeddingModel });
        const res = await model.embedContent(c.content.slice(0, 2000));
        embedding = res.embedding.values;
        embeddedCount++;
      } catch {
        embedding = undefined;
      }
    }

    records.push({
      id: c.id,
      type: 'kb',
      slug: c.docId,
      title: `${c.title} - ${c.section}`,
      category: c.topics[0] || 'General',
      content: c.content,
      embedding,
      hash: itemHash,
    });
  }

  const indexData: IndexFile = {
    version: 1,
    contentHash: currentContentHash,
    updatedAt: new Date().toISOString(),
    totalProducts: products.length,
    totalKBChunks: kbChunks.length,
    hasEmbeddings: canEmbed && embeddedCount > 0,
    records,
  };

  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf-8');
  console.log(`✅ Index built successfully: ${products.length} products, ${kbChunks.length} KB chunks.`);
  console.log(`   (Newly embedded: ${embeddedCount}, reused/cached: ${skippedCount}, saved to ${indexPath})`);

  return indexData;
}

if (process.argv[1]?.endsWith('ai-index.ts')) {
  buildIndex().catch((err) => {
    console.error('Failed to build AI index:', err);
    process.exit(1);
  });
}
