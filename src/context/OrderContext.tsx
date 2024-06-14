import React, { createContext, useState, FC } from "react";
import Parse from "parse";

interface Order {
  menuItems: {
    menuId: string;
    units: number;
    cost: number;
    comments: string;
    title: string;
    description: string;
    image: string;
  }[];
  userId?: string;
}

const OrderContext = createContext({
  clearOrder: () => {},
  setOrder: (data: Order) => {},
  currentOrder: {} as Order | null,
});

const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(
    localStorage.getItem("localOrder")
      ? JSON.parse(localStorage.getItem("localOrder") as string)
      : null
  );

  // Update currentUser based on your authentication logic (e.g., login, logout)
  const clearOrder = () => {
    setCurrentOrder(null);
    localStorage.removeItem("localOrder");
  };
  const setOrder = (data: Order) => {
    setCurrentOrder(data);
    localStorage.setItem("localOrder", JSON.stringify(data));
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
