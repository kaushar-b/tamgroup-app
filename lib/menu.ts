import { db, storage } from './firebase';
import { ref as dbRef, onValue, set, remove, push, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';

export type Section = 'starters' | 'paella' | 'specials' | 'desserts';
export const SECTIONS: Section[] = ['starters', 'paella', 'specials', 'desserts'];
export const SECTION_LABELS: Record<Section, string> = {
  starters: 'Starters',
  paella: 'Paella',
  specials: 'Weekly Specials',
  desserts: 'Desserts',
};

export const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];          // download URLs; images[0] is primary
  sortOrder: number;
  createdAt: number;
  group?: 'main' | 'salads'; // starters only
  day?: string;              // specials only
  sundayAvailable?: boolean; // specials only — controls the Sunday all-specials view
};

// Live subscription to one section, sorted. Returns an unsubscribe function.
export function subscribeSection(section: Section, cb: (items: MenuItem[]) => void) {
  return onValue(dbRef(db, `menu/${section}`), snap => {
    const items: MenuItem[] = [];
    snap.forEach(child => {
      const v = child.val() || {};
      items.push({
        id: child.key!,
        name: v.name ?? '',
        description: v.description ?? '',
        price: typeof v.price === 'number' ? v.price : Number(v.price) || 0,
        images: Array.isArray(v.images) ? v.images : [],
        sortOrder: typeof v.sortOrder === 'number' ? v.sortOrder : 0,
        createdAt: v.createdAt ?? 0,
        group: v.group,
        day: v.day,
        sundayAvailable: v.sundayAvailable,
      });
    });
    items.sort((a, b) => (a.sortOrder - b.sortOrder) || (a.createdAt - b.createdAt));
    cb(items);
  });
}

export function newMenuId(section: Section): string {
  return push(dbRef(db, `menu/${section}`)).key!;
}

// Upload one local image (file:// from image-picker) to Storage; returns its download URL.
export async function uploadMenuImage(section: Section, itemId: string, localUri: string): Promise<string> {
  const resp = await fetch(localUri);
  const blob = await resp.blob();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const fileRef = storageRef(storage, `menu/${section}/${itemId}/${filename}`);
  await uploadBytes(fileRef, blob);
  return await getDownloadURL(fileRef);
}

export async function saveMenuItem(section: Section, item: {
  id: string; name: string; description: string; price: number;
  images: string[]; sortOrder?: number; createdAt?: number;
  group?: 'main' | 'salads'; day?: string; sundayAvailable?: boolean;
}) {
  const payload: any = {
    name: item.name.trim(),
    description: item.description.trim(),
    price: item.price,
    images: item.images,
    sortOrder: item.sortOrder ?? Date.now(),
    createdAt: item.createdAt ?? Date.now(),
  };
  if (section === 'starters') payload.group = item.group ?? 'main';
  if (section === 'specials') {
    payload.day = item.day ?? 'Monday';
    payload.sundayAvailable = item.sundayAvailable !== false; // default true
  }
  await set(dbRef(db, `menu/${section}/${item.id}`), payload);
}

export async function deleteMenuItem(section: Section, itemId: string) {
  await remove(dbRef(db, `menu/${section}/${itemId}`));
  try {
    const folder = storageRef(storage, `menu/${section}/${itemId}`);
    const listing = await listAll(folder);
    await Promise.all(listing.items.map(f => deleteObject(f).catch(() => {})));
  } catch {}
}

// First-run seed: for each empty section, create the original items as text (no images yet).
const SEED: Record<Section, any[]> = {
  starters: [
    { name: 'Assorted Stuffed Vegetables', description: 'Mixed stuffed tomatoes, zucchini, eggplant, and onion with premium minced meat filling, garnished with herbs.', price: 220, group: 'main' },
    { name: 'Tomato & Basil Bruschetta', description: 'Toasted bread topped with roasted cherry tomatoes, garlic, ricotta/cream cheese, and fresh basil.', price: 120, group: 'main' },
    { name: 'Seafood Stew', description: 'Mixed fish, mussels, clams in a tomato-based broth with lemon and herbs.', price: 230, group: 'main' },
    { name: 'Batata and Onion Omelette', description: 'Tortilla de patatas - golden omelette made with potatoes, onions, eggs, and olive oil.', price: 50, group: 'main' },
    { name: 'Tomato Garlic Bruschetta Skewers', description: 'Italian bruschetta spiedini - bite-sized skewers of toasted bread cubes, fresh tomato, garlic, olive oil, and basil.', price: 45, group: 'main' },
    { name: 'Marinated Bell Peppers', description: 'Olive oil with garlic, thyme, and balsamic - Peperoni Arrostiti.', price: 49, group: 'salads' },
    { name: 'Roquefort Walnut Salad', description: 'Roquefort et noix - Endive, Roquefort / Blue Cheese, and Walnut Salad.', price: 69, group: 'salads' },
  ],
  paella: [
    { name: 'Seafood Paella', description: 'Spanish rice dish with shrimp/prawns, mussels, lemon slices, and saffron.', price: 225 },
    { name: 'Spanish Chorizo Paella', description: 'Paella de chorizo - Spanish rice cooked with chicken, tender beef, saffron, peppers, onions, and olive oil.', price: 175 },
    { name: 'Spanish Vegetarian Paella', description: 'Paella vegetariana - colorful rice cooked with saffron, peppers, onions, tomatoes, green beans, and olive oil.', price: 95 },
  ],
  specials: [
    { name: 'Beef Bourguignon - Rich Beef Stew', description: 'Cooked beef chunks in red wine sauce with carrots, onions, bacon/pancetta, and parsley.', price: 150, day: 'Monday', sundayAvailable: true },
    { name: 'Coq au Vin - Braised Chicken', description: 'Chicken pieces in a glossy red wine with pearl onions, carrots, and herbs.', price: 150, day: 'Tuesday', sundayAvailable: true },
    { name: 'Lamb Cutlets', description: 'Tender lamb cutlets marinated in fresh herbs, garlic, and olive oil, grilled to perfection with seasonal sides.', price: 150, day: 'Wednesday', sundayAvailable: true },
    { name: 'Garlic Butter Shrimp', description: 'Sauteed prawns in garlic, parsley, and olive oil / butter sauce.', price: 150, day: 'Thursday', sundayAvailable: true },
    { name: 'Fish of the Day', description: 'Pescado del dia - prepared simply with olive oil, herbs, and seasonal sides.', price: 150, day: 'Friday', sundayAvailable: true },
    { name: 'Zarzuela de Poisson', description: 'Rich Catalan seafood stew with shrimp, mussels, clams, fish, onions, tomatoes, garlic, and olive oil.', price: 175, day: 'Saturday', sundayAvailable: true },
  ],
  desserts: [],
};

export async function seedAllIfEmpty(): Promise<void> {
  for (const section of SECTIONS) {
    const seed = SEED[section];
    if (!seed || seed.length === 0) continue;
    const snap = await get(dbRef(db, `menu/${section}`));
    if (snap.exists()) continue;
    const updates: Record<string, any> = {};
    const base = Date.now();
    seed.forEach((it, idx) => {
      const id = push(dbRef(db, `menu/${section}`)).key!;
      updates[id] = { ...it, images: [], sortOrder: idx, createdAt: base + idx };
    });
    await update(dbRef(db, `menu/${section}`), updates);
  }
}