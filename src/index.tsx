import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Parse from "parse";
import { UserProvider } from "./context/UserContext";
import { setActiveRegistration, subscribeToTopic } from "./services/pubsub";
import { onMessage } from "firebase/messaging";
import { messaging } from "./services/fb.config";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("../firebase-messaging-sw.js")
//     .then(function (registration) {
//       console.log("Registration successful, scope is:", registration.scope);
//     })
//     .catch(function (err) {
//       console.log("Service worker registration failed, error:", err);
//     });
// }

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)
    .then((registration) => {
      setActiveRegistration(registration);
      console.log(
        "Service Worker registered with scope:",
        registration.scope,
        registration
      );
      console.log("Service Worker Registered");
      registration.getNotifications().then((filter) => {
        console.log("this is get notification from index", filter);
      });
      registration.addEventListener("updatefound", (e: any) => {
        console.log("this is registration.addEventListener(updatefound", e);
      });
      setTimeout(() => {
        // display the notificaiton
        registration.getNotifications().then((filter) => {
          console.log("this is get notification from index", filter);
        });
        registration.addEventListener("updatefound", (e: any) => {
          console.log("this is registration.addEventListener(updatefound", e);
        });
        // registration
        //   .showNotification("title", { notification_options: "ffyf" })
        //   .then((done) => {
        //     console.log("sent notificaiton to user from timeout ", done);
        //   })
        //   .catch((err) => {
        //     console.error("Error sending notificaiton to user", err);
        //   });
        // registration.update();
      }, 100);
      onMessage(messaging(), (payload) => {
        console.log("Message received. from index!!! blblbbbl $$$$", payload);
        // Process the message here
        const messageUserId = payload.data?.userId;
        const messageTableNumber = payload.data?.tableNumber;
        const orderId = payload.data?.orderId;
      });
      // Subscribe to 'orders' topic when the app loads
      subscribeToTopic("orders");
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

// the URL can be change whenever URL of web i want to install the Parse (back4app is auto complete example)
Parse.serverURL = "https://parseapi.back4app.com"; // This is your Server URL
Parse.initialize(
  "25PH0hwyuCcERHFxGic7Y1ebGRtJlE4XpbidBCt6", // This is your Application ID
  "v3aJrodDhs6YgjR0P1BVTw6QX60VdOjTP9OIMVbq" // This is your Javascript key
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
