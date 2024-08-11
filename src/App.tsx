import React, { useContext, useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import "./App.css";
import { UserContext, UserProvider } from "./context/UserContext";
import NavigationBar from "./components/navigationBar/navigationBar";
import { User } from "./interface/loggedUser";
import { userRoutes } from "./routes/routes.service";
import { LoadingPage } from "./pages/LoadingPage/LoadingPage";
import Parse from "parse";
import { createUserWithRole } from "./parse/signup";
import { OrderContext } from "./context/OrderContext";
import useSocket from "./hooks/useSocket";
import { messageFilter } from "./utils/utils";
import CustomAlert from "./components/Alert/Alert";
import { SocketMessage } from "./components/types/socket.type";

const App = () => {
  // const [currentUser, setCurrentUser] = useState(Parse.User.current() || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { activeUser } = useContext(UserContext);
  const { currentOrder } = useContext(OrderContext);
  const [alert, setAlert] = useState<{ isDisplay: boolean; id?: string }>({
    isDisplay: false,
  });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const socket = useSocket();

  useEffect(() => {
    const loadingTimer = setTimeout(() => setIsLoading(false), 3000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const routes = activeUser?.attributes?.role
    ? userRoutes[activeUser.attributes.role as keyof typeof userRoutes]
    : userRoutes["guest"];

  useEffect(() => {
    socket.connect();
    socket.on(SocketMessage.ORDER_UPDATED, (payload) => {
      console.log("Message received in MAIN PAGE. ", payload);
      // Process the message here
      const messageUserId = payload?.userId;
      const messageTableNumber = payload?.tableNumber;
      const orderId = payload?.orderId;
      const status = payload?.status;
      if (
        messageFilter(
          activeUser?.attributes?.role,
          activeUser?.id,
          messageUserId,
          messageTableNumber,
          status
        ) &&
        orderId
      ) {
        // console.log("inside if - MAIN PAGE. ", payload);

        setAlert({ isDisplay: true, id: orderId });
        timeoutRef.current = setTimeout(() => {
          setAlert({ isDisplay: false });
        }, 7000);
        // fetchUpdatedOrderData(orderId);
      }
    });

    return () => {
      clearTimeout(timeoutRef.current);
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   console.log(
  //     `Socket connection status: ${
  //       socket.isConnected ? "Connected" : "Disconnected"
  //     }`
  //   );
  // }, [socket.isConnected]);

  //when get message -
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
      <HashRouter>
        <NavigationBar />
        <Routes>
          <Route
            path="/"
            element={<Navigate to={routes.defaultRoute} replace />}
          />
          {routes.pages.map((Page, index) => (
            <Route
              key={index}
              path={Page.path}
              element={<Page.element socket={socket} />}
            />
          ))}
        </Routes>
      </HashRouter>
      <CustomAlert
        isVisible={alert.isDisplay}
        severity="success"
        title="עדכון הזמנה"
        text={`הזמנה מס' ${alert.id} עודכנה!`}
      />
    </div>
  );
};

export default App;
