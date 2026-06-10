import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const FALLBACK_ITEMS = [
  {
    id: '1',
    name: 'Tomato & Basil Bruschetta',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Crostini - Toasted bread topped with... ',
    details: 'Crostini - Toasted bread topped with roasted cherry tomatoes, garlic, ricotta/cream cheese, and fresh basil.',
    images: [] as string[],
  },
  {
    id: '2',
    name: 'Coq au Vin - Braised Chicken',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Chicken pieces in a glossy red...',
    details: 'Chicken pieces in a glossy red wine with pearl onions, carrots, and herbs.',
    images: [] as string[],
  },
  {
    id: '3',
    name: 'Stuffed Vegetables - Gemista Style',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Mediterranean mixed stuffed tomatoes, zucchini, eggplant...',
    details: 'Mediterranean mixed stuffed tomatoes, zucchini, eggplant, and onion with a savory rice/meat filling, garnished with herbs.',
    images: [] as string[],
  },
  {
    id: '4',
    name: 'Beef Bourguignon - Rich Beef Stew',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Cooked beef chunks in red wine sauce with',
    details: 'Cooked beef chunks in red wine sauce with carrots, onions, bacon/pancetta, and parsley.',
    images: [] as string[],
  },
  {
    id: '5',
    name: 'Lamb Chops with Roasted Vegetables',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Lamb cutlets served with potatoes, carrots,...',
    details: 'Lamb cutlets served with potatoes, carrots, and mushrooms.',
    images: [] as string[],
  },
  {
    id: '6',
    name: 'Seafood Paella - Spanish Rice Dish ',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Spanish rice dish with shrimp/prawns, mussels,...',
    details: 'Spanish rice dish with shrimp/prawns, mussels, lemon slices, and saffron.',
    images: [] as string[],
  },
  {
    id: '7',
    name: 'Garlic Butter Shrimp',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Crevettes à l ail et persil - prawns in garlic, parsley,...',
    details: 'Crevettes à l ail et persil - prawns in garlic, parsley, and olive oil/butter sauce.',
    images: [] as string[],
  },
  {
    id: '8',
    name: 'Bouillabaisse - Seafood Stew',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Mixed fish, mussels, clams in a...',
    details: 'Mixed fish, mussels, clams in a tomato-based broth with lemon and herbs.',
    images: [] as string[],
  },
  {
    id: '9',
    name: 'Poached Egg Breakfast Sandwhich',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Toasted bread with grilled mushrooms, tomato,...',
    details: 'Toasted bread with grilled mushrooms, tomato, poached eggs, herbs, and a side green salad.',
    images: [] as string[],
  },
  {
    id: '10',
    name: 'Roasted Red Bell Peppers',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Marinated/roasted red peppers in olive oil with garlic,...',
    details: 'Marinated/roasted red peppers in olive oil with garlic, thyme, and balsamic - antipasto peppers.',
    images: [] as string[],
  },
  {
    id: '11',
    name: 'Chicory Blue Cheese Salad',
    price: 400,
    was_price: null as number | null,
    on_special: false,
    icon: 'restaurant',
    description: 'Salade d endives aux pommes...',
    details: 'Salade d endives aux pommes - Endive, Apple, Roquefort/Blue Cheese, and Walnut Salad',
    images: [] as string[],
  },
];

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FALLBACK_ITEMS as MenuItem[]);
  const [menuLoading, setMenuLoading] = useState(false);

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
    <CartContext.Provider value={{ items, menuItems, menuLoading, addToCart, removeFromCart, clearCart, total, count, refreshMenu: () => {} }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export const MENU_ITEMS = FALLBACK_ITEMS as MenuItem[];
