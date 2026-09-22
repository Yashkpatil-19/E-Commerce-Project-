import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://tx5egykr.us-east.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'ik_b45d0e63451d5d72715d7abeb3134d48';

export const insforge = createClient({
  baseUrl,
  anonKey,
});
