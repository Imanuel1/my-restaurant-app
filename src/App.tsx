import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./context/UserContext";
// import NavigationBar from "./components/navigationBar/navigationBar";
import { User } from "./interface/loggedUser";
import { userRoutes } from "./routes/routes.service";

const App = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null); // Assuming a User interface

  // ... (other code in App.tsx)
  const routes = currentUser
    ? userRoutes[currentUser?.type]
    : userRoutes["guest"];

  return (
    <UserProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
