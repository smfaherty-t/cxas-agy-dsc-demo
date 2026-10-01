import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  variantColor: string;
  price: number;
  originalPrice: number;
  purchaseType: 'subscribe' | 'onetime';
  frequency?: string;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  cartCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 18.0;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.variantColor === newItem.variantColor &&
          i.purchaseType === newItem.purchaseType &&
          i.frequency === newItem.frequency
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }

      const generatedId = `${newItem.productId}-${newItem.variantColor}-${newItem.purchaseType}-${Date.now()}`;
      return [...prev, { ...newItem, id: generatedId }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateQuantity,
        removeItem,
        cartCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountToFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const defaultCartContext: CartContextType = {
  items: [],
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  cartCount: 0,
  subtotal: 0,
  freeShippingThreshold: 18.0,
  amountToFreeShipping: 18.0
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    return defaultCartContext;
  }
  return context;
};
