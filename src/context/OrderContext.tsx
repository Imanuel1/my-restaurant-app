import React, { createContext, useState, FC } from "react";
import Parse from "parse";

interface Order {
  menuItems: { menuId: string; units: number; cost: number }[];
  userId?: string;
}

const OrderContext = createContext({
  clearOrder: () => {},
  setOrder: (data: Order) => {},
  currentOrder: {} as Order | null,
});

const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Update currentUser based on your authentication logic (e.g., login, logout)
  const clearOrder = () => {
    setCurrentOrder(null);
  };
  const setOrder = (data: {
    menuItems: { menuId: string; units: number; cost: number }[];
    userId?: string;
  }) => {
    setCurrentOrder(data);
  };

  let context = {
    setOrder: setOrder,
    clearOrder: clearOrder,
    currentOrder: currentOrder,
  };

  return (
    <OrderContext.Provider value={context}>{children}</OrderContext.Provider>
  );
};

export { OrderContext, OrderProvider };
