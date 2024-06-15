// import { MenuType } from "./menu";
import Parse from "parse";

export enum StatuMenuType {
  PENDING = "Pending",
  PREPERING = "Preparing",
  COMPLETED = "Completed",
}

export const createOrderHistory = async (
  orderId: string,
  paymentOption: string // "Bit" | "Cash"
) => {
  try {
    const orderQuery = new Parse.Query("Order");
    orderQuery.equalTo("objectId", orderId);

    const order: Parse.Object | undefined = await orderQuery.first();
    console.log("this order will be put in history :", order);

    if (order) {
      const orderHistory = new Parse.Object("OrderHistory");
      orderHistory.set("userId", order.get("userId")); // Assuming userId exists in Order
      orderHistory.set("tableNumber", order.get("tableNumber"));
      orderHistory.set("menuIds", order.attributes.menuIds); // Assuming menuIds is a Relation
      orderHistory.set("cost", order.get("cost"));
      orderHistory.set("paymentOption", paymentOption);
      orderHistory.set("date", order.get("updatedAt")); // Assuming date exists in Order
      orderHistory.set("statusOrder", order.get("statusOrder"));

      await orderHistory.save();
      //delete the order after transfer to history
      await order.destroy();
      console.log("Order history created successfully!");
      return true;
    } else {
      console.log("this order is no longer exist");
      return false;
    }
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    console.error("Error creating order history:", error);
    return false;
  }
};

const getOrderWithMenus = async (
  order: Parse.Object<Parse.Attributes>
): Promise<any> => {
  try {
    if (order) {
      const menuItems = await order.relation("menuIds").query().find(); // Query related Menus
      // ... use order and menuItems data
      console.log("getOrderWithMenus - order :", order);
      const orderMap = new Map<
        string,
        {
          menuId: string;
          units: number;
          cost: number;
          comments: string;
          paymentOption: string;
          status: StatuMenuType;
        }
      >(
        order.attributes.statusOrder.map(
          (itemStatus: {
            menuId: string;
            units: number;
            cost: number;
            comments: string;
            paymentOption: string;
            status: StatuMenuType;
          }) => [itemStatus.menuId, itemStatus]
        )
      );
      return {
        order: { id: order.id, ...order.attributes },
        menuItems: menuItems.map((item) => ({
          id: item.id,
          comments: orderMap.get(item.id)?.comments,
          ...item.attributes,
        })),
      };
    } else {
      console.log("Order not found.");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

export interface getHistoryOrdersType {
  order: {
    id: string;
    userId: string;
    statusOrder: {
      menuId: string;
      units: number;
      cost: number;
      comments: string;
      status: StatuMenuType;
    }[];
    cost: number;
    paymentOption: string;
    tableNumber: number;
    createdAt: Date;
    updatedAt: Date;
  };
  menuItems: {
    id: string;
    name: string;
    description: string;
    type: string;
    price: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    comments: string;
  }[];
}

export const getHistoryOrders = async (
  userId: string,
  userType: "client" | "worker" | "manager"
): Promise<getHistoryOrdersType[] | null> => {
  try {
    const orderHistoryQuery: Parse.Query = new Parse.Query("OrderHistory");
    if (userType === "client") {
      orderHistoryQuery.equalTo("userId", userId);
    }
    orderHistoryQuery.include("menuIds");
    const orderResults = await orderHistoryQuery.find();
    console.log(" results :", orderResults);

    const orderWithMenus = await Promise.all(
      orderResults.map(async (order) => await getOrderWithMenus(order))
    );

    console.log("this is order ralation res :", orderWithMenus);

    return orderWithMenus;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return null;
  }
};
