import React, { createContext, useState, FC } from "react";

interface User {
  username?: string;
  role?: string; // 'client', 'worker', or 'manager'
}

const UserContext = createContext({
  logout: () => {},
  signup: ({
    email,
    name,
    lastName,
    password,
  }: {
    email: string;
    name: string;
    lastName: string;
    password: string;
  }) => {},
  login: (email: string, password: string) => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);

  // Update currentUser based on your authentication logic (e.g., login, logout)
  const editUser = ({
    name,
    role,
    lastName,
    password,
  }: {
    name?: string;
    role?: "client" | "worker" | "manager";
    lastName?: string;
    password?: string;
  }) => {
    //create user with parse
    //get feedback
  };
  const createUser = ({
    email,
    name,
    role,
    lastName,
    password,
  }: {
    email: string;
    name: string;
    role: "client" | "worker" | "manager";
    lastName: string;
    password: string;
  }) => {
    //create user with parse
    //get feedback
  };
  const signup = ({
    email,
    name,
    lastName,
    password,
  }: {
    email: string;
    name: string;
    lastName: string;
    password: string;
  }) => {
    //signup with parse
    //use login
    //get from parse the username and role
  };
  const login = (email: string, password: string) => {
    //login with parse
    //get from parse the username and role -> and set in local storage
  };

  const logout = () => {
    // setActiveUser(null);
    // Parse.User.logOut();
    //remove from local storage
    //redirect -> window
  };

  //reset password

  let context = {
    logout: logout,
    signup: signup,
    login: login,
    activeUser: activeUser,
  };

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserProvider };
