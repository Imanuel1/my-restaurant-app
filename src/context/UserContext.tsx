import React, { createContext, useState, FC } from "react";

interface User {
  username?: string;
  role?: string; // 'client', 'worker', or 'manager'
}

const UserContext = createContext<User | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Update currentUser based on your authentication logic (e.g., login, logout)

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
