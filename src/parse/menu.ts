import Parse from "parse";

export const createNew = async (
  type: string,
  name: string,
  description: string,
  price: string,
  image: string
) => {
  try {
    const menu: Parse.Object = new Parse.Object("Menu");
    menu.set("type", type);
    menu.set("name", name);
    menu.set("description", description);
    menu.set("price", price);
    menu.set("image", image);
  } catch (error) {}
};
