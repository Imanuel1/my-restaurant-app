import React, { FC, useContext, useEffect, useState, useRef } from "react";
import { isEqual } from "lodash";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Avatar, ListItemAvatar, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ButtonX from "../../components/buttonCustom/ButtonX";
import "./Order.css";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";
import {
  StatuMenuType,
  createOrder,
  getOrders,
  getOrdersType,
} from "../../parse/order";
import ManageOrder from "../../components/ManageOrder/ManageOrder";
import StepperStatus from "../../components/stepper/StepperStatus";
import { onMessage } from "firebase/messaging";
import {
  SocketEmitMessage,
  SocketHookType,
  SocketMessage,
} from "../../components/types/socket.type";
import { messageFilter } from "../../utils/utils";

interface PreOrder {
  menuItems: {
    menuId: string;
    units: number;
    cost: number;
    comments: string;
    //remove when sent to create order
    title: string;
    description: string;
    image: string;
  }[];
  userId?: string;
}

type props = {
  socket: SocketHookType | null;
};

const Order: FC<props> = ({ socket }) => {
  const { activeUser } = useContext(UserContext);
  const { clearOrder, currentOrder, setOrder } = useContext(OrderContext);
  // const [preOrderData, setPreOrderData] = useState<PreOrder[] | null>(
  //   currentOrder ? [currentOrder] : null
  // );
  const [orderData, setOrderData] = useState<getOrdersType[] | null>(null);
  const [tableNumber, setTableNumber] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timer>();

  const getOrdersRequset = () => {
    const userType = activeUser?.attributes?.role || "";
    getOrders(activeUser?.id || undefined, userType)
      .then((res) => {
        console.log("getOrders res:", res);
        if (!orderData || !isEqual(orderData, res)) {
          console.log(
            "enter the render order pollingg",
            !orderData || !isEqual(orderData, res)
          );

          setOrderData(res);
        }
      })
      .catch((err) => console.error("error while getOrders :", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    //request for order of the current user
    getOrdersRequset();
    timerRef.current = setInterval(() => {
      if (
        (localStorage.getItem("tableNumber") &&
          (activeUser?.attributes?.role === "client" ||
            !activeUser?.attributes?.role)) ||
        activeUser?.attributes?.role === "manger" ||
        activeUser?.attributes?.role === "worker"
      ) {
        setIsLoading(true);
        getOrdersRequset();
      }
    }, 60000);
    return () => clearInterval(timerRef.current);
  }, []);

  // useEffect(() => {
  //   socket?.on(SocketMessage.ORDER_UPDATED, (payload) => {
  //     console.log("Message received in order page. ", payload);
  //     // Process the message here
  //     const messageUserId = payload?.userId;
  //     const messageTableNumber = payload?.tableNumber;
  //     const orderId = payload?.orderId;
  //     const status = payload?.status;
  //     if (
  //       messageFilter(
  //         activeUser?.attributes?.role,
  //         activeUser?.id,
  //         messageUserId,
  //         messageTableNumber,
  //         status
  //       ) &&
  //       orderId
  //     ) {
  //       console.log("went throght the if - before getOrdersRequset()");
  //       getOrdersRequset();
  //     }
  //   });
  // }, []);

  const emitOrderUpdate = (
    orderId: string,
    userId: string | undefined,
    tableNumber: number | undefined
  ) => {
    getOrdersRequset();

    //publish order created!
    // socket?.emit(SocketEmitMessage.ORDER_UPDATE, {
    //   orderId,
    //   userId,
    //   tableNumber,
    //   status: SocketMessage.ORDER_UPDATED,
    // });
  };

  //clear local storage +
  //get order init statuses - timer every 10 minutes

  const handleSendToOperation = () => {
    setIsLoading(true);
    localStorage.setItem("tableNumber", String(tableNumber));
    //remove the local order
    clearOrder();

    //request to order => change order status!
    console.log("data sent to create order - ", orderData);
    //TODO: table number
    if (currentOrder) {
      console.log("inside if (currentOrder) =", currentOrder);

      createOrder(currentOrder?.menuItems, activeUser?.id, tableNumber)
        .then((res) => {
          console.log("res createOrder :", res);
          getOrdersRequset();
          // publish order created!

          emitOrderUpdate(
            currentOrder?.userId || "n0-id",
            activeUser?.id,
            Number(localStorage.getItem("tableNumber"))
          );
        })
        .catch((err) => console.log("error while create order", err))
        .finally(() => setIsLoading(false));
    }
  };

  const visibleOrderList = orderData?.length
    ? orderData
    : currentOrder
    ? [currentOrder]
    : null;

  const statusTranslate = {
    [StatuMenuType.PENDING]: "בהמתנה",
    [StatuMenuType.PREPERING]: "בהכנה",
    [StatuMenuType.COMPLETED]: "מוכן",
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const sumCost =
    orderData && orderData?.[0]?.order?.cost
      ? orderData[0].order.cost
      : currentOrder?.menuItems?.reduce(
          (acc, menu) => acc + menu.cost * menu.units,
          0
        );

  return (
    <div className="c-orders-container">
      {!activeUser || activeUser?.attributes?.role === "client" ? (
        <>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {visibleOrderList && visibleOrderList?.length > 0 ? (
              visibleOrderList?.[0]?.menuItems.map(
                (
                  value:
                    | PreOrder["menuItems"][number]
                    | getOrdersType["menuItems"][number],
                  index: number
                ) => {
                  const menuId = (value as any)?.menuId || (value as any)?.id;
                  const title = (value as any)?.name || (value as any)?.title;
                  const labelId = `checkbox-list-label-${menuId}`;
                  let orderStatusitem: {
                    [key in string]: getOrdersType["order"]["statusOrder"][number];
                  } = {};

                  //if is order that sent to kitchen
                  if ((visibleOrderList[0] as getOrdersType)?.order) {
                    orderStatusitem = (
                      visibleOrderList[0] as getOrdersType
                    ).order.statusOrder?.reduce(
                      (acc, item) => ({
                        ...acc,
                        [item.menuId]: item,
                      }),
                      {}
                    );
                  }

                  const menuUnits =
                    (orderData && orderStatusitem[(value as any)?.id]?.units) ||
                    (value as any)?.units ||
                    0;
                  const menuCost =
                    (value as any)?.cost || (value as any)?.price || 0;
                  return (
                    <div className="item-container" key={index}>
                      <ListItem
                        key={menuId}
                        secondaryAction={
                          <ListItemAvatar
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                            onClick={(e) => console.log("avatar clicked!", e)}
                            //TODO: send the icon url / data when clicked!
                          >
                            <Avatar
                              alt="Remy Sharp"
                              src={value.image}
                              sx={{
                                cursor: "pointer",
                                // width: "70px",
                                // height: "70px",
                              }}
                            />
                          </ListItemAvatar>
                        }
                        //   disablePadding
                      >
                        <ListItemText
                          id={labelId}
                          primary={title}
                          secondary={
                            //run over description and then over notes it's not empty
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                תיאור -
                              </Typography>
                              <span>{value.description}</span>
                              <div>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  כמות -
                                </Typography>
                                <span>{menuUnits}</span>
                              </div>
                              <div>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  מחיר -
                                </Typography>
                                <span>{`${menuUnits * menuCost} ₪`}</span>
                              </div>
                              {value.comments ? (
                                <>
                                  <Typography
                                    sx={{ display: "block" }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    הערות -
                                  </Typography>
                                  <span>{value.comments}</span>
                                </>
                              ) : null}
                              {Object.keys(orderStatusitem).length ? (
                                <div className="stepper-holder">
                                  <StepperStatus
                                    orderId={
                                      (visibleOrderList?.[0] as any)?.order
                                        ?.id as string
                                    }
                                    menuId={menuId}
                                    status={orderStatusitem?.[menuId].status}
                                  />
                                </div>
                              ) : null}
                            </React.Fragment>
                          }
                        />
                        {/* <ListItemButton> */}
                        {!Object.keys(orderStatusitem).length ? (
                          <IconButton
                            sx={{ width: "max-content", padding: "7px" }}
                            edge="start"
                            aria-label="comments"
                            onClick={() => {
                              const localOrder = {
                                userId: currentOrder?.userId,
                                menuItems: [...(currentOrder?.menuItems || [])],
                              };
                              localOrder?.menuItems &&
                                localOrder.menuItems.splice(index, 1);
                              setOrder(localOrder);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        ) : null}
                        {/* </ListItemButton> */}
                      </ListItem>
                      {visibleOrderList &&
                      visibleOrderList.length === index ? null : (
                        <Divider variant="inset" component="li" />
                      )}
                    </div>
                  );
                }
              )
            ) : (
              <span className="no-order-data">{"לא נבחרו מנות להזמנה!"}</span>
            )}
            {!localStorage.getItem("tableNumber") &&
            (activeUser?.attributes?.role === "client" ||
              !activeUser?.attributes?.role) ? (
              <span
                style={{
                  width: "100%",
                  display: "block",
                  textAlign: "center",
                  fontSize: "1.17em",
                  margin: "1em 0px",
                  fontWeight: "bold",
                }}
              >{`מחיר כולל - ${sumCost || 0} ₪`}</span>
            ) : null}
          </List>
          {
            //isOrderSent ? order status : button send order to operate!
            currentOrder &&
            currentOrder?.menuItems?.length > 0 &&
            !orderData?.length ? (
              <>
                <TextField
                  value={tableNumber}
                  onChange={(e) => {
                    setTableNumber(Number(e.target.value));
                    console.log("on change e:", e.target.value);
                  }}
                  id="outlined-basic"
                  label="מס' שולחן"
                  variant="standard"
                  type="number"
                  style={{ direction: "rtl" }}
                />
                <ButtonX
                  text="שליחה לביצוע"
                  Icon={{ IconName: SendIcon, isButton: true }}
                  onClick={(value: string) => handleSendToOperation()}
                  disabled={tableNumber === undefined}
                />
              </>
            ) : null
          }
        </>
      ) : (
        <>
          {orderData ? (
            <ManageOrder
              orderData={orderData}
              emitOrderUpdate={emitOrderUpdate}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default Order;
