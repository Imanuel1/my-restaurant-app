import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Parse from "parse";
import { UserProvider } from "./context/UserContext";

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
