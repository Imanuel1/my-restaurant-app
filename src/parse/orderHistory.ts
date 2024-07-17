// import { MenuType } from "./menu";
import Parse from "parse";
import { getOrderWithMenus } from "./order";

export enum StatuMenuType {
  PENDING = "Pending",
  PREPERING = "Preparing",
  COMPLETED = "Completed",
}

export const createOrderHistory = async (
  orderId: string,
  paymentOption: string, // "Bit" | "Cash"
  rating: number | undefined
) => {
  try {
    const orderQuery = new Parse.Query("Order");
    orderQuery.equalTo("objectId", orderId);

    const order: Parse.Object | undefined = await orderQuery.first();
    console.log("this order will be put in history :", order);

    if (order) {
      const orderHistory = new Parse.Object("OrderHistory");
      const userId = String(order.get("userId")?.id || "");
      if (userId) {
        const userQuery = new Parse.Query("_User");
        userQuery.equalTo("objectId", userId);
        const user = await userQuery.first();

        orderHistory.set("userName", user?.attributes?.username);
        orderHistory.set("userRole", user?.attributes?.role);
        orderHistory.set("userId", user?.id);
      }
      const orderMenus = await getOrderWithMenus(order);

      rating && orderHistory.set("rating", rating);
      orderHistory.set("tableNumber", order.get("tableNumber"));
      orderHistory.set("menuItems", orderMenus?.menuItems);
      orderHistory.set("menuIds", order.attributes.menuIds); // Assuming menuIds is a Relation
      orderHistory.set("menuName", order.attributes.menuName); // Assuming menuIds is a Relation
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

const orderWithMenus = (order: Parse.Object<Parse.Attributes>): any => {
  try {
    if (order) {
      // ... use order and menuItems data
      console.log("getOrderWithMenus - order :", order);
      const orderMap = new Map<
        string,
        {
          menuId: string;
          menuName: string;
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
            menuName: string;
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
        menuItems: order.attributes?.menuItems,
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
    userName: string;
    userRole: string;
    statusOrder: {
      menuId: string;
      menuName: string;
      units: number;
      cost: number;
      comments: string;
      status: StatuMenuType;
    }[];
    cost: number;
    paymentOption: string;
    tableNumber: number;
    rating: number | undefined;
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
  userType: "client" | "worker" | "manager",
  updatedAt?: Date
): Promise<getHistoryOrdersType[] | null> => {
  try {
    const orderHistoryQuery: Parse.Query = new Parse.Query("OrderHistory");
    if (updatedAt) {
      const startDate = new Date(String(updatedAt));
      startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
      const endDate = new Date(startDate.getTime());
      endDate.setDate(endDate.getDate() + 1); // Move to next day (00:00:00.000 of the following day)

      orderHistoryQuery.greaterThanOrEqualTo("updatedAt", startDate);
      orderHistoryQuery.lessThan("updatedAt", endDate);
    }
    orderHistoryQuery.include("menuIds");
    orderHistoryQuery.include("userId");

    let orderResults = await orderHistoryQuery.find();
    if (userType === "client") {
      orderResults = orderResults.filter(
        (orderResult) => orderResult.attributes?.userId === userId
      );
    }
    console.log(" results :", orderResults);

    const orderWithMenu = orderResults.map((order) => orderWithMenus(order));

    console.log("this is order ralation res :", orderWithMenu);

    return orderWithMenu;
  } catch (error: any) {
    // Error can be caused by lack of Internet connection
    alert(`Error! ${error.message}`);
    return null;
  }
};
