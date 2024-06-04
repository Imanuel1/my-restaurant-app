import {
  ConfettiEmoji,
  PaymentApproveButton,
} from "../components/animations/ConfettiEmoji/ConfettiEmoji";
import About from "../pages/About/About";

// MyOrder.tsx
{
  /* <PaymentApproveButton text="אישור תשלום" style={{}} /> */
}

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
