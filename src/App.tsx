import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import "./App.css";
import { UserContext } from "./context/UserContext";
import NavigationBar from "./components/navigationBar/navigationBar";
import { userRoutes } from "./routes/routes.service";
import { LoadingPage } from "./pages/LoadingPage/LoadingPage";
import { OrderProvider } from "./context/OrderContext";
import { onMessage } from "firebase/messaging";
import {
  messageFilter,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "./services/pubsub";
import { messaging } from "./services/fb.config";
import CustomAlert from "./components/Alert/Alert";

const App = () => {
  // const [currentUser, setCurrentUser] = useState(Parse.User.current() || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<{ isDisplay: boolean; id?: string }>({
    isDisplay: false,
  });
  const { activeUser } = useContext(UserContext);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const routes = activeUser?.attributes?.role
    ? userRoutes[activeUser.attributes.role as keyof typeof userRoutes]
    : userRoutes["guest"];

  // Initialize Firebase Cloud Messaging and get a reference to the service
  useEffect(() => {

    onMessage(messaging(), (payload) => {
      console.log("Message received. ", payload);
      // Process the message here
      const messageUserId = payload.data?.userId;
      const messageTableNumber = payload.data?.tableNumber;
      const orderId = payload.data?.orderId;
      if (
        messageFilter(
          activeUser?.attributes?.role,
          activeUser?.id,
          messageUserId,
          messageTableNumber
        ) &&
        orderId
      ) {
        setAlert({ isDisplay: true, id: orderId });
        timeoutRef.current = setTimeout(() => {
          setAlert({ isDisplay: false });
        }, 2000);
        // fetchUpdatedOrderData(orderId);
      }
    });

    return () => {
      clearTimeout(timeoutRef.current);
      // unsubscribeFromTopic("orders");
    };
  }, []);

  //do onMessage -
  //manager/ worker - get all messages
  //client - do a sub when send to kitchen, and unsub after payment. when get message filter it by userId
  //guest - do a sub when send to kitchen, and unsub after payment. when get message filter it by table number

  if (isLoading) {
    // createUserWithRole("rabb", "admin2@gmail.com", "Aa123456!", {
    //   role: "manager",
    // });
    return <LoadingPage />;
  }

  return (
    <div className="app-container">
      <OrderProvider>
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
      </OrderProvider>
      {alert.isDisplay ? (
        <CustomAlert
          severity="success"
          title="עדכון הזמנה"
          text={`הזמנה מס' ${alert.id} עודכנה!`}
        />
      ) : null}
    </div>
  );
};

export default App;
