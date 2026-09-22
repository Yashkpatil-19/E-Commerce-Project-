import { createClient } from '@insforge/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://tx5egykr.us-east.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_b45d0e63451d5d72715d7abeb3134d48';

const insforge = createClient({
  baseUrl,
  anonKey,
});

async function seed() {
  console.log('Seeding products and scratch codes into InsForge database...');

  // 1. Load Products
  const productsRaw = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'products.json'), 'utf-8')
  );

  const mappedProducts = productsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory || null,
    form: p.form || 'Powder',
    price: p.price,
    original_price: p.originalPrice || p.price,
    rating: p.rating || 4.8,
    reviews_count: p.reviewsCount || 0,
    image: p.image,
    match_score: p.matchScore || 95,
    match_reason: p.matchReason || null,
    description: p.description || '',
    servings: p.servings || 30,
    protein_g: p.protein_g || 0,
    target_diet: p.target_diet || 'Vegetarian',
    flavors: p.flavors || [],
    sizes: p.sizes || [],
    nutrition_facts: p.nutritionFacts || {},
    reviews: p.reviews || [],
    brand_verification_badge: p.brandVerificationBadge || null,
    is_featured: true,
  }));

  console.log(`Inserting ${mappedProducts.length} products...`);
  const { data: prodData, error: prodErr } = await insforge.database
    .from('products')
    .upsert(mappedProducts, { onConflict: 'id' });

  if (prodErr) {
    console.error('Error inserting products:', prodErr);
  } else {
    console.log(`✓ Successfully seeded ${mappedProducts.length} products!`);
  }

  // 2. Load Scratch Codes
  const scratchCodesRaw = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'scratchCodes.json'), 'utf-8')
  );

  const mappedCodes = scratchCodesRaw.map((c) => ({
    code: c.code,
    brand: c.brand,
    product: c.product,
    batch: c.batch,
    verified: false,
  }));

  console.log(`Inserting ${mappedCodes.length} scratch codes...`);
  const { data: codeData, error: codeErr } = await insforge.database
    .from('scratch_codes')
    .upsert(mappedCodes, { onConflict: 'code' });

  if (codeErr) {
    console.error('Error inserting scratch codes:', codeErr);
  } else {
    console.log(`✓ Successfully seeded ${mappedCodes.length} scratch codes!`);
  }

  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
