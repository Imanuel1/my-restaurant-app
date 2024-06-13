// import { MenuType } from "./menu";
import Parse from "parse";

export enum StatuMenuType {
  PENDING = "Pending",
  PREPERING = "Preparing",
  COMPLETED = "Completed",
}

export const createOrder = async (
  menuItems: { menuId: string; units: number; cost: number }[],
  userId?: string,
  tableNumber?: number
) => {
  try {
    const order = new Parse.Object("Order");
    if (userId) {
      const userQuery = new Parse.Query("_User");
      userQuery.equalTo("objectId", userId);
      const user = await userQuery.first();
      order.set("userId", user?.toPointer());
    }

    const statusOrder = menuItems.map((item) => ({
      ...item,
      status: StatuMenuType.PENDING,
    }));
    const menuIds = menuItems.map((item) => item.menuId);
    const cost = menuItems.reduce((acc, item) => acc + item.cost, 0);
    order.set("statusOrder", statusOrder);
    order.set("cost", cost);
    order.set("tableNumber", tableNumber);
    const relation = order.relation("menuIds");
    await Promise.all(
      menuIds.map(async (menuId) => {
        const menu = await new Parse.Query("Menu")
          .equalTo("objectId", menuId)
          .find();
        relation.add(menu);
      })
    );

    await order.save();
    // Success
    // alert("Success! menu created!");

    return true;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return false;
  }
};
export const getOrders = async (
  userId: string,
  userType: "client" | "worker" | "manager"
) => {
  try {
    const orderQuery: Parse.Query = new Parse.Query("Order");
    if (userType === "client") {
      orderQuery.equalTo("userId", userId);
    }
    const orderList: Parse.Object[] = await orderQuery.find();

    return orderList;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return null;
  }
};

export const updateOrder = async ({
  id,
  menuItems,
  cost,
  tableNumber,
}: {
  id: string;
  menuItems?: { menuId: string; units: number }[];
  cost?: number;
  tableNumber?: number;
}) => {
  try {
    const orderQuey: Parse.Query = new Parse.Query("Order");
    orderQuey.equalTo("objectId", id);
    const order: Parse.Object | undefined = await orderQuey.first();

    if (order) {
      cost && order.set("cost", order.attributes.cost + cost);
      tableNumber && order.set("tableNumber", tableNumber);
      if (menuItems) {
        const statusOrder = menuItems.map((item) => ({
          ...item,
          status: StatuMenuType.PENDING,
        }));
        order.set(
          "statusOrder",
          order.attributes.statusOrder.push(statusOrder)
        );
        const menuIds = menuItems.map((item) => item.menuId);
        menuIds.push(order.attributes.menuIds);
        const relation = order.relation("menuIds");
        await Promise.all(
          menuIds.map(async (menuId) => {
            const menu = await new Parse.Query("Menu")
              .equalTo("objectId", menuId)
              .find();
            relation.add(menu);
          })
        );
      }
      await order.save();
    } else {
      alert("Error! order not exist!");
    }

    return order;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return null;
  }
};
