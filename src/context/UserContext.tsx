import React, { createContext, useState, FC } from "react";
import Parse from "parse";

import {
  parseLogin,
  parseLogout,
  parseSignUp,
  createUserWithRole,
} from "../parse/signup";

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
  activeUser: {} as Parse.User<Parse.Attributes> | null,
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeUser, setActiveUser] =
    useState<Parse.User<Parse.Attributes> | null>(Parse.User.current() || null);

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
  const signup = async ({
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
    const newUser = await parseSignUp(name, email, password);
    console.log("this is new user :", newUser);

    setActiveUser(newUser);
    // window.location.replace("/menu");
    //signup with parse
    //use login
    //get from parse the username and role
  };

  const login = async (email: string, password: string) => {
    const loggedIn = await parseLogin(email, password);
    console.log("this is loggedIn user :", loggedIn);
    setActiveUser(loggedIn);
    // window.location.replace("/menu");
  };

  const logout = async () => {
    const isLogout = await parseLogout();
    if (isLogout) {
      setActiveUser(null);
      // window.location.replace("/menu");
    }
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
