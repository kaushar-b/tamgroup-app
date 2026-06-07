import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Fallback items if API is unreachable
const FALLBACK_ITEMS = [
  { id: '1',  name: 'Grilled Chicken Burger', category: 'Mains',    price: 85,  icon: 'fast-food',   description: 'Juicy grilled chicken with fresh lettuce and house sauce', details: 'Served on a toasted brioche bun with house-made aioli, crisp lettuce, tomato, and pickles.', images: [] },
  { id: '2',  name: 'Beef Burger',            category: 'Mains',    price: 90,  icon: 'fast-food',   description: 'Classic beef patty with cheese and pickles', details: '180g hand-pressed beef patty, double cheese, caramelised onions, gherkins and our signature smoky sauce.', images: [] },
  { id: '3',  name: 'Chicken Wings',          category: 'Starters', price: 65,  icon: 'restaurant',  description: '6 crispy wings with your choice of sauce', details: 'Choose from BBQ, Peri-Peri, Honey Garlic or Buffalo. Served with blue cheese dip.', images: [] },
  { id: '4',  name: 'Loaded Fries',           category: 'Sides',    price: 45,  icon: 'restaurant',  description: 'Crispy fries topped with cheese and jalapeños', details: 'Golden crispy fries loaded with melted cheddar, pickled jalapeños, sour cream and spring onions.', images: [] },
  { id: '5',  name: 'Caesar Salad',           category: 'Starters', price: 55,  icon: 'leaf',        description: 'Fresh romaine, croutons, parmesan and caesar dressing', details: 'Classic Caesar with house-made dressing, shaved parmesan, garlic croutons and a soft-boiled egg.', images: [] },
  { id: '6',  name: 'Grilled Steak',          category: 'Mains',    price: 160, icon: 'restaurant',  description: '200g sirloin steak cooked to your liking', details: 'Premium 200g sirloin, cooked to your preference. Served with garlic butter, seasonal vegetables.', images: [] },
  { id: '7',  name: 'Coca Cola',              category: 'Drinks',   price: 20,  icon: 'wine',        description: '330ml can', details: 'Ice cold 330ml Coca-Cola can.', images: [] },
  { id: '8',  name: 'Chocolate Cake',         category: 'Desserts', price: 40,  icon: 'cafe',        description: 'Rich chocolate cake with cream', details: 'Warm Belgian chocolate lava cake with vanilla ice cream and fresh berry coulis.', images: [] },
  { id: '9',  name: 'Onion Rings',            category: 'Sides',    price: 35,  icon: 'restaurant',  description: 'Golden crispy onion rings', details: 'Thick-cut onion rings in a light beer batter. Served with smoky chipotle dipping sauce.', images: [] },
  { id: '10', name: 'Fruit Juice',            category: 'Drinks',   price: 25,  icon: 'wine',        description: 'Fresh orange or apple juice', details: 'Freshly squeezed seasonal juice.', images: [] },
];

// ← IMPORTANT: Replace this with your actual backend URL from Codespaces Ports tab
export const BACKEND_URL = 'https://musical-barnacle-4j4xrx67vv6r35qqj-3000.app.github.dev';

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  was_price?: number | null;
  on_special?: boolean;
  icon: string;
  description: string;
  details: string;
  images: string[];
};

export type CartItem = { id: string; name: string; price: number; icon: string; quantity: number; };

type CartContextType = {
  items: CartItem[];
  menuItems: MenuItem[];
  menuLoading: boolean;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
  refreshMenu: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      const r = await fetch(`${BACKEND_URL}/api/menu`);
      if (!r.ok) throw new Error('API error');
      const data = await r.json();
      const mapped = data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        category: item.category,
        price: item.price,
        was_price: item.was_price,
        on_special: item.on_special,
        icon: getCategoryIcon(item.category),
        description: item.description || '',
        details: item.details || '',
        images: (() => { try { return typeof item.images === 'string' ? JSON.parse(item.images) : item.images || []; } catch { return []; } })(),
      }));
      setMenuItems(mapped);
    } catch {
      setMenuItems(FALLBACK_ITEMS as MenuItem[]);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const getCategoryIcon = (cat: string) => {
    const map: Record<string, string> = { Mains: 'fast-food', Starters: 'restaurant', Sides: 'restaurant', Drinks: 'wine', Desserts: 'cafe' };
    return map[cat] || 'restaurant';
  };

  const addToCart = (id: string) => {
    const menuItem = menuItems.find(m => m.id === id);
    if (!menuItem) return;
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id, name: menuItem.name, price: menuItem.price, icon: menuItem.icon, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing && existing.quantity > 1) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.id !== id);
    });
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, menuItems, menuLoading, addToCart, removeFromCart, clearCart, total, count, refreshMenu: fetchMenu }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// Keep for backward compat
export const MENU_ITEMS = FALLBACK_ITEMS as MenuItem[];
