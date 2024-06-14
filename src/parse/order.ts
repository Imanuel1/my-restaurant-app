// import { MenuType } from "./menu";
import Parse from "parse";

export enum StatuMenuType {
  PENDING = "Pending",
  PREPERING = "Preparing",
  COMPLETED = "Completed",
}

export const createOrder = async (
  menuItems: {
    menuId: string;
    units: number;
    cost: number;
    comments: string;
    //remove it when send request
    title: string;
    description: string;
    image: string;
  }[],
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

    const statusOrder = menuItems.map(({ menuId, units, cost, comments }) => ({
      menuId,
      units,
      cost,
      comments,
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
          status: StatuMenuType;
        }
      >(
        order.attributes.statusOrder.map(
          (itemStatus: {
            menuId: string;
            units: number;
            cost: number;
            comments: string;
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

export interface getOrdersType {
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

export const getOrders = async (
  userId: string,
  userType: "client" | "worker" | "manager"
): Promise<getOrdersType[] | null> => {
  try {
    const orderQuery: Parse.Query = new Parse.Query("Order");
    if (userType === "client") {
      orderQuery.equalTo("userId", userId);
    }
    orderQuery.include("menuIds");
    const orderResults = await orderQuery.find();
    console.log(" results :", orderResults);

    const orderWithMenus = await Promise.all(
      orderResults.map(async (order) => await getOrderWithMenus(order))
    );

    console.log("this is order ralation res :", orderWithMenus);

    // Limit to 50 results only for example so we don't fetch too much data
    // innerQueryOrder.limit(50);
    // let joinQueryMenu = new Parse.Query("Menu");
    // // Match the TableA query by the "link" property
    // joinQueryMenu.matchesQuery("link", innerQueryOrder);
    // // Include the "link" property so we have the content of TableA as well
    // joinQueryMenu.include("link");
    // let joinQueryResults = await joinQueryMenu.find();

    // // INNER JOIN, get only the records in TableA that have matching records in TableB
    // console.log("INNER JOIN");
    // console.log("TABLE A ID | FIELD A | FIELD B");
    // console.log(`results - ${joinQueryResults}}`);
    // for (let joinResult of joinQueryResults) {
    //   console.log(
    //     `${joinResult.get("menuId").id} | ${joinResult
    //       .get("menuId")
    //       .get("FieldA")} | ${joinResult.get("FieldB")}`
    //   );
    // }

    // const orderList: Parse.Object[] = await orderQuery.find();

    return orderWithMenus;
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
