import axios from "axios";
import { messaging } from "./fb.config";
import { getToken } from "firebase/messaging";
import { UserType } from "../interface/userType";
// import { sendNotification } from "./fb.function";
const vapidKey =
  "BIYwlCyj5DOgBDexS2iS7i5TaY5CRwjESCaS1cOzrqkl8c1yFsvXMr88ZaPEpxk4NiEz5kU4u5jqWvoFH8wYVkc";
let key = "AIzaSyD9CUQnxpBL-_fwrQWMDUiTkOAn7uCMbmM";
let activeRegistration: ServiceWorkerRegistration;
export const setActiveRegistration = (
  registeration: ServiceWorkerRegistration
) => (activeRegistration = registeration);
const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return true;
    } else {
      console.log("Notification permission denied.");
      alert(
        "Please enable notifications in your browser settings and refresh the page."
      );
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

const getkey = async () => {
  const response = await axios.get(
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5s10y%40myrestaurant-cff7c.iam.gserviceaccount.com",
    { headers: { "Content-Type": "application/json" } }
  );

  console.log("getToken res", response.data);
  return response.data;
};
// Function to subscribe to a topic
export const subscribeToTopic = async (topic: string) => {
  try {
    console.log("this is messaging", messaging());

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.error("Permission not granted for notifications.");
      return;
    }
    const resKey = Object.values(await getkey())[0];
    console.log("this is messaging !!!!!!!!!!!!!!!!!!!!!!!", hasPermission);
    console.log("this is messaging !!!!!!! !res !!!!!!!!!", resKey);

    // Add the public key generated from the console here.
    const token = await getToken(messaging(), {
      vapidKey,
      serviceWorkerRegistration: activeRegistration,
    });
    console.log("this is token :", token);

    // const response = await fetch(
    //   `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // if (response.ok) {
    //   console.log("Subscribed to topic:", topic);
    // } else {
    //   console.error(
    //     "Error subscribing to topic:",
    //     response.status,
    //     response.statusText
    //   );
    // }
  } catch (error) {
    console.error("Error subscribing to topic:", error);
  }
};

export const publishOrderChange = async (orderId: string, userId: string) => {
  const payload = {
    topic: "orders",
    title: "Order Updated",
    notification: {
      title: "Order Updated",
      body: `Order ${orderId} has been updated. userId: ${userId}`,
    },
    body: {
      orderId,
      userId,
      tableNumber: localStorage.getItem("tableNumber"),
    },
    data: {
      orderId,
      userId,
      tableNumber: localStorage.getItem("tableNumber"),
    },
  };

  try {
    const token = await getToken(messaging(), {
      vapidKey,
      serviceWorkerRegistration: activeRegistration,
    });
    const response = await fetch(
      "https://fcm.googleapis.com/v1/projects/myrestaurant-cff7c/messages:send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          to: "/topics/orders",
          token,
          notification: payload.notification,
          data: payload.data,
        }),
      }
    );

    const data = await response.json();
    //send your self as be
    // sendNotification(payload as any, {} as any);
    console.log("Notification sent:", data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const unsubscribeFromTopic = async (topic: string) => {
  try {
    // Use the VAPID key to get the token
    const token = await getToken(messaging(), {
      vapidKey,
      serviceWorkerRegistration: activeRegistration,
    });

    // Use the Server Key to unsubscribe from the topic
    const response = await fetch(
      `https://iid.googleapis.com/iid/v1:batchRemove`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: `/topics/${topic}`,
          registration_tokens: [token],
        }),
      }
    );

    if (response.ok) {
      console.log("Unsubscribed from topic:", topic);
    } else {
      console.error(
        "Error unsubscribing from topic:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error getting token or unsubscribing from topic:", error);
  }
};

export const messageFilter = (
  userType: UserType | undefined,
  userId: string | undefined,
  messageUserId: string | undefined,
  messageTableNumber: string | undefined
): boolean => {
  switch (userType) {
    case UserType.Manager:
    case UserType.Worker:
      return true;
    case UserType.Client:
      return userId === messageUserId;
    default:
      return messageTableNumber == localStorage.getItem("tableNumber");
  }
};
