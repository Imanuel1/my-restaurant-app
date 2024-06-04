import {
  ConfettiEmoji,
  PaymentApproveButton,
} from "../components/animations/ConfettiEmoji/ConfettiEmoji";

export const About: React.FC = () => {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our restaurant!</p>
      <PaymentApproveButton text="אישור תשלום" style={{}} />
    </div>
  );
};

// MyOrder.tsx

export const MyOrder: React.FC = () => {
  return (
    <div>
      <h1>My Order</h1>
      <p>View your current order details here.</p>
    </div>
  );
};

export const userRoutes = {
  manager: {
    defaultRoute: "/menu",
    pages: [
      {
        path: "/about",
        label: "אפליקציית שדרות היסע",
        element: <About />,
      },
      {
        path: "/order",
        label: "אפליקציית שדרות תספוקת",
        element: <MyOrder />,
      },
    ],
  },
  worker: {
    defaultRoute: "/menu",
    pages: [
      {
        path: "/about",
        label: "אפליקציית שדרות היסע",
        element: <About />,
      },
      {
        path: "/order",
        label: "אפליקציית שדרות תספוקת",
        element: <MyOrder />,
      },
    ],
  },
  client: {
    defaultRoute: "/menu",
    pages: [
      {
        path: "/about",
        label: "אפליקציית שדרות היסע",
        element: <About />,
      },
      {
        path: "/order",
        label: "אפליקציית שדרות תספוקת",
        element: <MyOrder />,
      },
    ],
  },
  guest: {
    defaultRoute: "/menu",
    pages: [
      {
        path: "/about",
        label: "אפליקציית שדרות היסע",
        element: <About />,
      },
      {
        path: "/menu",
        label: "אפליקציית שדרות היסע",
        element: <About />,
      },
    ],
  },
};
