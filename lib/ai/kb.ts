import fs from 'fs';
import path from 'path';

export type KBDomain = 'product_knowledge' | 'website_knowledge' | 'fbs_logic';

export interface KBChunk {
  id: string;
  docId: string;
  title: string;
  domain?: KBDomain;
  section: string;
  topics: string[];
  content: string;
  searchText: string;
}

let cachedChunks: KBChunk[] | null = null;

export function loadKBChunks(): KBChunk[] {
  if (cachedChunks) return cachedChunks;

  const rootDir = process.cwd();
  const kbDir = path.join(rootDir, 'data', 'kb');
  if (!fs.existsSync(kbDir)) {
    return [];
  }

  function getMarkdownFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getMarkdownFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const files = getMarkdownFiles(kbDir);
  const chunks: KBChunk[] = [];

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    let docId = path.basename(filePath, '.md');
    let title = docId;
    let domain: KBDomain | undefined;
    let topics: string[] = [];

    let body = content;
    if (frontMatterMatch) {
      const fm = frontMatterMatch[1];
      body = content.slice(frontMatterMatch[0].length).trim();

      const idMatch = fm.match(/id:\s*([^\r\n]+)/);
      if (idMatch) docId = idMatch[1].trim();

      const titleMatch = fm.match(/title:\s*([^\r\n]+)/);
      if (titleMatch) title = titleMatch[1].trim().replace(/^["']|["']$/g, '');

      const domainMatch = fm.match(/domain:\s*([^\r\n]+)/);
      if (domainMatch) {
        domain = domainMatch[1].trim() as KBDomain;
      }

      const topicsMatch = fm.match(/topics:\s*\[(.*?)\]/);
      if (topicsMatch) {
        topics = topicsMatch[1]
          .split(',')
          .map((t) => t.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
    }

    // Default domain if not explicitly defined
    if (!domain) {
      if (filePath.includes('food-knowledge')) {
        domain = 'product_knowledge';
      } else if (docId.includes('fbs') || docId.includes('paisa') || docId.includes('rda')) {
        domain = 'fbs_logic';
      } else {
        domain = 'website_knowledge';
      }
    }

    // Split body by top-level or secondary headers (## or ###)
    const sections = body.split(/(?=^#{1,3}\s+)/m);
    let chunkIndex = 0;

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      const headerMatch = trimmed.match(/^#{1,3}\s+([^\r\n]+)/);
      const sectionTitle = headerMatch ? headerMatch[1].trim() : title;

      const chunkId = `kb-${docId}-${chunkIndex++}`;
      chunks.push({
        id: chunkId,
        docId,
        title,
        domain,
        section: sectionTitle,
        topics,
        content: trimmed,
        searchText: `${title} ${sectionTitle} ${topics.join(' ')} ${trimmed}`.toLowerCase(),
      });
    }
  }

  cachedChunks = chunks;
  return chunks;
}

export function getKBChunksByDomain(domain: KBDomain): KBChunk[] {
  return loadKBChunks().filter((c) => c.domain === domain);
}

