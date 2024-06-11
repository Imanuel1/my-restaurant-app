import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./context/UserContext";
import NavigationBar from "./components/navigationBar/navigationBar";
import { User } from "./interface/loggedUser";
import { userRoutes } from "./routes/routes.service";
import { LoadingPage } from "./pages/LoadingPage/LoadingPage";
import Parse from "parse";
import { createUserWithRole } from "./parse/signup";

const App = () => {
  const [currentUser, setCurrentUser] = useState(Parse.User.current() || null);

  // const [currentUser, setCurrentUser] = React.useState<User | null>(null); // Assuming a User interface
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const routes = (currentUser as any)?.role
    ? userRoutes[(currentUser as any)?.role as keyof typeof userRoutes]
    : userRoutes["guest"];

  if (isLoading) {
    createUserWithRole("iman", "admin@gmail.com", "Aa123456!", {
      role: "manager",
    });
    return <LoadingPage />;
  }

  return (
    <div className="app-container">
      <UserProvider>
        <HashRouter>
          <NavigationBar />
          <Routes>
            <Route
              path="/"
              element={<Navigate to={routes.defaultRoute} replace />}
            />
            {routes.pages.map((page, index) => (
              <Route key={index} path={page.path} element={page.element} />
            ))}
          </Routes>
        </HashRouter>
      </UserProvider>
    </div>
  );
};

export default App;
