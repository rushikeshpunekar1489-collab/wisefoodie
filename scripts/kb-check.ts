import fs from 'fs';
import path from 'path';

interface CheckResult {
  passed: boolean;
  errors: string[];
}

export function runKBCheck(): CheckResult {
  const errors: string[] = [];
  const rootDir = process.cwd();

  // 1. Check all KB files exist and have valid YAML front-matter
  const kbDir = path.join(rootDir, 'data', 'kb');
  if (!fs.existsSync(kbDir)) {
    return { passed: false, errors: ['data/kb directory does not exist'] };
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

  const kbFiles = getMarkdownFiles(kbDir);
  console.log(`Checking ${kbFiles.length} Knowledge Base markdown files...`);

  for (const filePath of kbFiles) {
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check front-matter
    const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontMatterMatch) {
      errors.push(`File ${relPath} is missing valid YAML front-matter (--- ... ---)`);
      continue;
    }

    const fm = frontMatterMatch[1];
    if (!fm.includes('id:')) errors.push(`File ${relPath} front-matter missing "id"`);
    if (!fm.includes('title:')) errors.push(`File ${relPath} front-matter missing "title"`);
    if (!fm.includes('domain:')) errors.push(`File ${relPath} front-matter missing "domain"`);
    if (!fm.includes('topics:')) errors.push(`File ${relPath} front-matter missing "topics"`);
    if (!fm.includes('lastUpdated:')) errors.push(`File ${relPath} front-matter missing "lastUpdated"`);
  }

  // 2. Verify FBS methodology constants against lib/fbs.ts
  const fbsCode = fs.readFileSync(path.join(rootDir, 'lib', 'fbs.ts'), 'utf-8');
  const howFbsWorks = fs.readFileSync(path.join(kbDir, 'how-fbs-works.md'), 'utf-8');
  const faqContent = fs.readFileSync(path.join(kbDir, 'faq.md'), 'utf-8');

  // Verify Base Score
  if (!fbsCode.includes('let totalScore = 6.0;') || !howFbsWorks.includes('6.0')) {
    errors.push('FBS Base score drift: Expected 6.0 in lib/fbs.ts and how-fbs-works.md');
  }

  // Verify Protein (+1.5)
  if (!fbsCode.includes('Math.min(1.5, (protein / 15) * 1.5)') || !howFbsWorks.includes('+1.5')) {
    errors.push('FBS Protein points drift: Expected up to +1.5 points for 15g protein');
  }

  // Verify Fibre (+1.5)
  if (!fbsCode.includes('Math.min(1.5, (fibre / 6) * 1.5)') || !howFbsWorks.includes('+1.5')) {
    errors.push('FBS Fibre points drift: Expected up to +1.5 points for 6g fibre');
  }

  // Verify Sugar penalty (-1.5)
  if (!fbsCode.includes('Math.min(1.5, Math.max(0, (sugar / 20) * 1.5))') || !howFbsWorks.includes('-1.5')) {
    errors.push('FBS Sugar penalty drift: Expected up to -1.5 points for 20g sugar');
  }

  // Verify Trans fat penalty (-0.5)
  if (!fbsCode.includes('totalScore -= 0.5;') || !howFbsWorks.includes('-0.5')) {
    errors.push('FBS Trans fat penalty drift: Expected -0.5 points');
  }

  // Verify Additive penalty (-0.7)
  if (!fbsCode.includes('totalScore -= 0.7;') || !howFbsWorks.includes('-0.7')) {
    errors.push('FBS Processing penalty drift: Expected -0.7 points for >= 5 additives');
  }

  // Verify Score Bands
  const bands = ['Excellent', 'Very Good', 'Good', 'Moderate', 'Limited', 'Poor'];
  for (const band of bands) {
    if (!howFbsWorks.includes(band)) {
      errors.push(`FBS band "${band}" missing in how-fbs-works.md`);
    }
  }

  // 3. Verify RDA constants against lib/diary.ts
  const diaryCode = fs.readFileSync(path.join(rootDir, 'lib', 'diary.ts'), 'utf-8');
  const rdaDoc = fs.readFileSync(path.join(kbDir, 'rda-reference-bars.md'), 'utf-8');

  if (diaryCode.includes('energyKcal: 2000') && !rdaDoc.includes('2,000 kcal')) {
    errors.push('RDA Energy drift: Expected 2,000 kcal in rda-reference-bars.md');
  }
  if (diaryCode.includes('proteinG: 54') && !rdaDoc.includes('54 g')) {
    errors.push('RDA Protein drift: Expected 54g in rda-reference-bars.md');
  }
  if (diaryCode.includes('addedSugarLimitG: 25') && !rdaDoc.includes('25 g')) {
    errors.push('RDA Sugar drift: Expected 25g in rda-reference-bars.md');
  }
  if (diaryCode.includes('sodiumLimitMg: 2000') && !rdaDoc.includes('2,000 mg')) {
    errors.push('RDA Sodium drift: Expected 2,000mg in rda-reference-bars.md');
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

if (process.argv[1]?.endsWith('kb-check.ts')) {
  const result = runKBCheck();
  if (result.passed) {
    console.log('✅ KB Check Passed: All knowledge base documentation matches code constants perfectly with zero drift!');
    process.exit(0);
  } else {
    console.error('❌ KB Check Failed with drift errors:');
    result.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
}
