import {
  ConfettiEmoji,
  PaymentApproveButton,
} from "../components/animations/ConfettiEmoji/ConfettiEmoji";
import { useContext } from "react";
import About from "../pages/About/About";
import Main from "../pages/Main/Main";
import firstFood from "../assets/mainTopics/firstFood.jpg";
import mainFood from "../assets/mainTopics/mainFood.jpg";
import desserts from "../assets/mainTopics/dessert.jpg";
import drinks from "../assets/mainTopics/drinks.jpg";
import Order from "../pages/Order/Order";
import Payment from "../pages/Payment/Payment";
import LoginForm from "../pages/Login/Login";
import SignupForm from "../pages/Signup/Signup";

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

const foodType = [
  {
    name: "ראשונות",
    image: firstFood,
  },
  {
    name: "עקריות",
    image: mainFood,
  },
  {
    name: "קינוחים",
    image: desserts,
  },
  {
    name: "משקאות",
    image: drinks,
  },
];

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
        path: "/menu",
        label: "אפליקציית שדרות היסע",
        element: <Main dishType={foodType} />,
      },
      {
        path: "/my-order",
        label: "אפליקציית שדרות היסע",
        element: <Order />,
      },
      {
        path: "/payment",
        label: "אפליקציית שדרות היסע",
        element: <Payment />,
      },
      // {
      //   path: "/logout",
      //   label: "אפליקציית שדרות היסע",
      //   element: () => {
      //     logout();
      //     return <></>;
      //   },
      // },
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
        path: "/menu",
        label: "אפליקציית שדרות היסע",
        element: <Main dishType={foodType} />,
      },
      {
        path: "/my-order",
        label: "אפליקציית שדרות היסע",
        element: <Order />,
      },
      {
        path: "/payment",
        label: "אפליקציית שדרות היסע",
        element: <Payment />,
      },
      // {
      //   path: "/logout",
      //   label: "אפליקציית שדרות היסע",
      //   element: () => {
      //     logout();
      //     return <></>;
      //   },
      // },
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
        path: "/menu",
        label: "אפליקציית שדרות היסע",
        element: <Main dishType={foodType} />,
      },
      {
        path: "/my-order",
        label: "אפליקציית שדרות היסע",
        element: <Order />,
      },
      {
        path: "/payment",
        label: "אפליקציית שדרות היסע",
        element: <Payment />,
      },
      // {
      //   path: "/logout",
      //   label: "אפליקציית שדרות היסע",
      //   element: () => {
      //     logout();
      //     return <></>;
      //   },
      // },
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
        element: <Main dishType={foodType} />,
      },
      {
        path: "/my-order",
        label: "אפליקציית שדרות היסע",
        element: <Order />,
      },
      {
        path: "/payment",
        label: "אפליקציית שדרות היסע",
        element: <Payment />,
      },
      {
        path: "/login",
        label: "אפליקציית שדרות היסע",
        element: <LoginForm />,
      },
      {
        path: "/signup",
        label: "אפליקציית שדרות היסע",
        element: <SignupForm />,
      },
    ],
  },
};