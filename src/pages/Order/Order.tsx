import React, { useContext, useEffect, useState } from "react";
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

export default function Order() {
  const { activeUser } = useContext(UserContext);
  const { clearOrder, currentOrder, setOrder } = useContext(OrderContext);
  // const [preOrderData, setPreOrderData] = useState<PreOrder[] | null>(
  //   currentOrder ? [currentOrder] : null
  // );
  const [orderData, setOrderData] = useState<getOrdersType[] | null>(null);
  const [tableNumber, setTableNumber] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getOrdersRequset = () => {
    const userType = activeUser?.attributes?.role || "";
    getOrders(activeUser?.id || "", userType)
      .then((res) => {
        setOrderData(res);
        console.log("res res order:", res);
      })
      .catch((err) => console.error("error while getOrders :", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    //request for order of the current user
    getOrdersRequset();
  }, []);

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
      createOrder(currentOrder?.menuItems, activeUser?.id, tableNumber)
        .then((res) => {
          console.log("res createOrder :", res);
          getOrdersRequset();
        })
        .catch((err) => console.log("error whike create order", err))
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
                  const menuUnits =
                    (value as any)?.units ||
                    (orderData &&
                      orderData[0].order?.statusOrder?.[index].units) ||
                    0;
                  const menuCost =
                    (value as any)?.cost || (value as any)?.price || 0;

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
                      {visibleOrderList && visibleOrderList.length === index ? (
                        <h3
                          style={{ width: "100%", textAlign: "center" }}
                        >{`מחיר כולל - ${sumCost || 0} ₪`}</h3>
                      ) : (
                        <Divider variant="inset" component="li" />
                      )}
                    </div>
                  );
                }
              )
            ) : (
              <span className="no-order-data">{"לא נבחרו מנות להזמנה!"}</span>
            )}
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
        <>{orderData ? <ManageOrder orderData={orderData} /> : null}</>
      )}
    </div>
  );
}

//statuses of order: send to kitchen -> in progress -> finished
// <Stack direction="row" spacing={1}>
