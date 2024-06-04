import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./context/UserContext";
// import NavigationBar from "./components/navigationBar/navigationBar";
import { User } from "./interface/loggedUser";
import { userRoutes } from "./routes/routes.service";
import { LoadingPage } from "./pages/LoadingPage/LoadingPage";

const App = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null); // Assuming a User interface
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 3000);

    return () => clearTimeout(loadingTimer);
  }, []);
  // ... (other code in App.tsx)
  const routes = currentUser
    ? userRoutes[currentUser?.type]
    : userRoutes["guest"];

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <UserProvider>
      <HashRouter>
        {/* <NavigationBar /> */}
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
  );
};

export default App;
