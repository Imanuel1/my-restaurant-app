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
import { Avatar, ListItemAvatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ButtonX from "../../components/buttonCustom/ButtonX";
import "./Order.css";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";
import { createOrder, getOrders, getOrdersType } from "../../parse/order";
import ManageOrder from "../../components/ManageOrder/ManageOrder";

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
  const [tableNumber, setTableNumbera] = useState<number>();

  useEffect(() => {
    //request for order of the current user
    const userType = activeUser?.attributes?.role || "";
    getOrders(activeUser?.id || "", userType)
      .then((res) => {
        setOrderData(res);
        console.log("res res order:", res);
      })
      .catch((err) => console.error("error while getOrders :", err));
  }, []);

  //clear local storage +
  //get order init statuses - timer every 10 minutes

  const handleSendToOperation = () => {
    //request to order => change order status!
    console.log("data sent to create order - ", orderData);
    //TODO: table number
    if (currentOrder) {
      createOrder(currentOrder?.menuItems, activeUser?.id, 5)
        .then((res) => console.log("res createOrder :", res))
        .catch((err) => console.log("error whike create order", err));
    }
  };

  const visibleOrderList = orderData?.length
    ? orderData
    : currentOrder
    ? [currentOrder]
    : null;

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
                              sx={{ cursor: "pointer" }}
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
                            </React.Fragment>
                          }
                        />
                        {/* <ListItemButton> */}
                        <IconButton
                          sx={{ width: "max-content", padding: "7px" }}
                          edge="start"
                          aria-label="comments"
                        >
                          <DeleteIcon />
                        </IconButton>
                        {/* </ListItemButton> */}
                      </ListItem>
                      {orderData && orderData.length - 1 !== index ? (
                        <Divider variant="inset" component="li" />
                      ) : null}
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
              <ButtonX
                text="שליחה לביצוע"
                Icon={{ IconName: SendIcon, isButton: true }}
                onClick={(value: string) => handleSendToOperation()}
              />
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
