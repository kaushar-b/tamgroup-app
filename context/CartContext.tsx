import { createContext, useContext, useState, ReactNode } from 'react';

export const MENU_ITEMS = [
  { id: '1',  name: 'Grilled Chicken Burger', category: 'Mains',    price: 85,  icon: 'fast-food',   description: 'Juicy grilled chicken with fresh lettuce and house sauce', details: 'Served on a toasted brioche bun with house-made aioli, crisp lettuce, tomato, and pickles. Comes with a side of coleslaw.' },
  { id: '2',  name: 'Beef Burger',            category: 'Mains',    price: 90,  icon: 'fast-food',   description: 'Classic beef patty with cheese and pickles', details: '180g hand-pressed beef patty, double cheese, caramelised onions, gherkins and our signature smoky sauce on a sesame bun.' },
  { id: '3',  name: 'Chicken Wings',          category: 'Starters', price: 65,  icon: 'restaurant',  description: '6 crispy wings with your choice of sauce', details: 'Choose from BBQ, Peri-Peri, Honey Garlic or Buffalo. Served with a blue cheese dip and celery sticks.' },
  { id: '4',  name: 'Loaded Fries',           category: 'Sides',    price: 45,  icon: 'restaurant',  description: 'Crispy fries topped with cheese and jalapeños', details: 'Golden crispy fries loaded with melted cheddar, pickled jalapeños, sour cream and spring onions.' },
  { id: '5',  name: 'Caesar Salad',           category: 'Starters', price: 55,  icon: 'leaf',        description: 'Fresh romaine, croutons, parmesan and caesar dressing', details: 'Classic Caesar with house-made dressing, shaved parmesan, garlic croutons and a soft-boiled egg. Add grilled chicken for P20.' },
  { id: '6',  name: 'Grilled Steak',          category: 'Mains',    price: 160, icon: 'restaurant',  description: '200g sirloin steak cooked to your liking', details: 'Premium 200g sirloin, cooked to your preference. Served with garlic butter, seasonal vegetables and your choice of chips or mash.' },
  { id: '7',  name: 'Coca Cola',              category: 'Drinks',   price: 20,  icon: 'wine',        description: '330ml can', details: 'Ice cold 330ml Coca-Cola can.' },
  { id: '8',  name: 'Chocolate Cake',         category: 'Desserts', price: 40,  icon: 'cafe',        description: 'Rich chocolate cake with cream', details: 'Warm Belgian chocolate lava cake, served with a scoop of vanilla ice cream and fresh berry coulis.' },
  { id: '9',  name: 'Onion Rings',            category: 'Sides',    price: 35,  icon: 'restaurant',  description: 'Golden crispy onion rings', details: 'Thick-cut onion rings in a light beer batter, fried golden. Served with smoky chipotle dipping sauce.' },
  { id: '10', name: 'Fruit Juice',            category: 'Drinks',   price: 25,  icon: 'wine',        description: 'Fresh orange or apple juice', details: 'Freshly squeezed seasonal juice. Ask our staff for today\'s available flavours.' },
];

export type CartItem = { id: string; name: string; price: number; icon: string; quantity: number; };

type CartContextType = {
  items: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (id: string) => {
    const menuItem = MENU_ITEMS.find(m => m.id === id);
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
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
