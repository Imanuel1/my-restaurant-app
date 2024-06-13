import { useEffect, useState } from "react";
import "./MenuList.css";
import { MenuType, getAllMenus, createNewMenu } from "../../parse/menu";

interface MenuItemType {
  id: string;
  type: MenuType;
  name: string;
  description: string;
  price: number;
  image: string;
}

const MenuList = () => {
  const [menuList, setMenuList] = useState<MenuItemType[]>();
//   useEffect(() => {
//     //get all menu list
//     createNewMenu(
//       MenuType.FIRST,
//       "פוקצ'ת הבית",
//       "אפויה בתנור עצים עם שמן זית, סלסת עגבניות ושום קונפי",
//       25,
//       "https://imageproxy.wolt.com/menu/menu-images/643fed76a45b22ffa25fa16d/94430982-ecd4-11ed-b9b7-72bd786eb264_______________________________.jpg"
//     )
//       .then((res) => console.log("createNewMenu - first", res))
//       .catch((err) => console.error("createNewMenu error :", err));
//     createNewMenu(
//       MenuType.MAIN,
//       "פיצה קפרזה",
//       "רוטב עגבניות, מוצרלה, קונפי שום, עגבניות שרי צלויות, ארוגולה, מוצרלה טרייה עם קרם פרש, בלסמי מצומצם ושקדים קלויים",
//       82,
//       "https://imageproxy.wolt.com/menu/menu-images/shared/32ab3310-ecd5-11ed-a283-ee86c49c2644___________.jpg"
//     )
//       .then((res) => console.log("createNewMenu - first", res))
//       .catch((err) => console.error("createNewMenu error :", err));
//     createNewMenu(
//       MenuType.DRINKS,
//       "קיאנטי לאונרדו, טוסקנה",
//       "עשיר בניחוחות וטעמי דובדבן ופירות אדומים, טוסקנה המודרנית",
//       178,
//       "https://imageproxy.wolt.com/menu/menu-images/643fed76a45b22ffa25fa16d/dff4b660-f48f-11ed-ade0-9afc7e44a542______________.jpeg"
//     )
//       .then((res) => console.log("createNewMenu - first", res))
//       .catch((err) => console.error("createNewMenu error :", err));
//     createNewMenu(
//       MenuType.DESSERTS,
//       "נמסיס",
//       "עוגת פאדג' שוקולד נימוחה, טוויל שומשום וגנאש שוקולד",
//       42,
//       "https://imageproxy.wolt.com/menu/menu-images/shared/ceadaffc-afb4-11ee-ac88-265e1937c113_______ta.jpeg"
//     )
//       .then((res) => console.log("createNewMenu - first", res))
//       .catch((err) => console.error("createNewMenu error :", err));

//     getAllMenus()
//       .then((res) => console.log(res))
//       .catch((err) => console.error("getAllMenus error :", err));
//   }, []);

  return <div className="c-menu-list"></div>;
};

export default MenuList;
