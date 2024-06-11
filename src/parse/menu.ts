// import { MenuType } from "./menu";
import Parse from "parse";

export enum MenuType {
  MAIN = "main",
  FIRST = "first",
  DRINKS = "drinks",
  DESSERTS = "desserets",
}

export const createNewMenu = async (
  type: MenuType,
  name: string,
  description: string,
  price: number,
  image: string
) => {
  try {
    const menu: Parse.Object = new Parse.Object("Menu");
    menu.set("type", type);
    menu.set("name", name);
    menu.set("description", description);
    menu.set("price", price);
    menu.set("image", image);

    await menu.save();
    // Success
    alert("Success! menu created!");

    return true;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return false;
  }
};
export const getMenuesByType = async (type: MenuType) => {
  try {
    const menuQuery: Parse.Query = new Parse.Query("Menu");
    menuQuery.equalTo("type", type);
    const menuList: Parse.Object[] = await menuQuery.find();

    // Success
    alert("Success! get menu list!");

    return menuList;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return null;
  }
};

export const getAllMenues = async () => {
  try {
    const menuQuery: Parse.Query = new Parse.Query("Menu");
    const menuList: Parse.Object[] = await menuQuery.find();

    // Success
    alert("Success! get all menu list!");

    return menuList;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return null;
  }
};

export const updateMenu = async ({
  id,
  type,
  name,
  description,
  price,
  image,
}: {
  id: string;
  type?: MenuType;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}) => {
  try {
    const menu: Parse.Object = new Parse.Object("Menu");
    menu.set("objectId", id);
    type && menu.set("type", type);
    name && menu.set("name", name);
    description && menu.set("description", description);
    price && menu.set("price", price);
    image && menu.set("image", image);

    await menu.save();
    // Success
    alert("Success! get menu list!");

    return menu;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return null;
  }
};
