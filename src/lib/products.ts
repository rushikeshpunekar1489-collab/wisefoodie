import fs from 'fs';
import path from 'path';
import { Product } from '../../types/product';

const DATA_PATH = path.join(process.cwd(), 'data', 'products.json');

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products data:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.slug === slug) || null;
}
