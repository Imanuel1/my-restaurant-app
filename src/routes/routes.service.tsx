import {
  ConfettiEmoji,
  PaymentApproveButton,
} from "../components/animations/ConfettiEmoji/ConfettiEmoji";
import About from "../pages/About/About";
import Main from "../pages/Main/Main";

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
    image:
      "https://www.ynet.co.il/PicServer5/2017/06/01/7818169/781790801000100980654no.jpg",
  },
  {
    name: "עקריות",
    image:
      "https://restaurant-tel-aviv.co.il/wp-content/uploads/2022/10/%D7%9E%D7%A1%D7%A2%D7%93%D7%94-%D7%90%D7%99%D7%98%D7%9C%D7%A7%D7%99%D7%AA-%D7%94%D7%93%D7%A8-%D7%99%D7%95%D7%A1%D7%A3-%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91.jpg",
  },
  {
    name: "קינוחים",
    image:
      "https://images.ctfassets.net/trvmqu12jq2l/1uCS4fEjQcJWfXskgW6JwU/bbef9ba14a747e871592cb6e26cc3ff8/blog-hero-1920x678-v88.06.02.jpg?q=70&w=1208&h=1080&f=faces&fit=fill",
  },
  {
    name: "משקאות",
    image:
      "https://images.ctfassets.net/zpx0hfp3jryq/2dbxzjCo1JlK2it7p45aXO/6a3576a9216526a7c4670b6bc19b04fa/how-to-drink-wine-4.jpg?fm=jpg&fl=progressive",
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
        element: <Main dishType={foodType} />,
      },
    ],
  },
};
