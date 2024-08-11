import React, { useContext, useEffect, useState, Fragment, FC } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Avatar, ListItemAvatar } from "@mui/material";
import "./ManageOrder.css";
import {
  createOrder,
  getOrders,
  getOrdersType,
  StatuMenuType,
  updateOrderStatus,
} from "../../parse/order";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StepperStatus from "../stepper/StepperStatus";
import { SocketHookType } from "../types/socket.type";

type props = {
  orderData: getOrdersType[];
  emitOrderUpdate: (
    orderId: string,
    userId: string | undefined,
    tableNumber: number | undefined
  ) => void;
};

const ManageOrder: FC<props> = ({ orderData, emitOrderUpdate }) => {
  const [isOpenItems, setIsOpenItems] = useState(
    new Array(orderData.length || 0).fill(false)
  );

  const statusTranslate = {
    [StatuMenuType.PENDING]: "בהמתנה",
    [StatuMenuType.PREPERING]: "בהכנה",
    [StatuMenuType.COMPLETED]: "מוכן",
  };

  const handleRowClick = (index: number) => {
    setIsOpenItems((prev) => {
      const newValue = [...prev];
      newValue[index] = !newValue[index];
      return newValue;
    });
  };

  const handleUpdateStatus = async (
    id: string,
    menuId: string,
    status: string,
    userId?: string | undefined,
    tableNumber?: number | undefined
  ) => {
    console.log("MAIN PAGE - update oder data!!!");

    const res = await updateOrderStatus({
      id,
      menuId,
      status,
    });

    if (res) {
      //publish order created!
      emitOrderUpdate(id, userId, tableNumber);
    }
  };

  return (
    <div className="c-orders-container">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {orderData?.length > 0 ? (
          orderData?.map((value: getOrdersType, index: number) => {
            const labelId = `checkbox-list-label-${value.order.id}`;
            console.log("this is userId relation -", value.order?.userId);
            const orderActiveStatuses = value.order.statusOrder.reduce(
              (acc, status) => {
                acc[status.status] = true;
                return acc;
              },
              {} as { [key in StatuMenuType]: boolean }
            );
            return (
              <Fragment key={index}>
                <div className="item-container">
                  <ListItemButton onClick={() => handleRowClick(index)}>
                    {isOpenItems[index] ? <ExpandLess /> : <ExpandMore />}
                    <ListItemText
                      id={labelId}
                      primary={`הזמנה מס' שולחן ${
                        value.order.tableNumber
                      } - מזמין  ${
                        (value.order?.userId as any)?.attributes?.username ||
                        "אורח"
                      }`}
                    />
                    <ListItemText
                      primary={`עלות הזמנה ${value.order.cost} ₪`}
                      secondary={
                        <div
                          style={{
                            display: "flex",
                            margin: "10px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              width: "100%",
                              textAlign: "center",
                              fontSize: "1.17em",
                              margin: "1em 0px",
                              fontWeight: "bold",
                            }}
                          >
                            - סטאטוס מנות -
                          </span>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "10px",
                              alignItems: "center",
                            }}
                          >
                            {orderActiveStatuses.Completed && (
                              <>
                                <CheckCircleIcon color="success" />
                                <span>מוכן</span>
                              </>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "10px",
                              alignItems: "center",
                            }}
                          >
                            {orderActiveStatuses.Preparing && (
                              <>
                                <PublishedWithChangesIcon color="info" />
                                <span>בתהליך</span>
                              </>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              margin: "10px",
                              alignItems: "center",
                            }}
                          >
                            {orderActiveStatuses.Pending && (
                              <>
                                <PendingActionsIcon color="secondary" />
                                <span>בהמתנה</span>
                              </>
                            )}
                          </div>
                        </div>
                      }
                    />
                  </ListItemButton>
                  <Collapse
                    key={`${value.order.id}-${index}`}
                    in={isOpenItems[index]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                      {value.order?.statusOrder?.map((orderItem, index) => {
                        const menuObject: {
                          [key in string]: getOrdersType["menuItems"][number];
                        } = value?.menuItems?.reduce(
                          (acc, item) => ({
                            ...acc,
                            [item.id]: item,
                          }),
                          {}
                        );

                        return (
                          <div
                            className="manager-order-item"
                            key={`${index}-${orderItem.menuId}`}
                          >
                            <ListItemAvatar
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                              onClick={(e) => console.log("avatar clicked!", e)}
                              //TODO: send the icon url / data when clicked!
                            >
                              <Avatar
                                alt="Remy Sharp"
                                src={menuObject[orderItem.menuId].image}
                                sx={{ cursor: "pointer" }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              id={labelId}
                              primary={menuObject[orderItem.menuId].name}
                              secondary={
                                <React.Fragment>
                                  <div>
                                    <Typography
                                      sx={{ display: "inline" }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      תיאור -
                                    </Typography>
                                    <span>
                                      {menuObject[orderItem.menuId].description}
                                    </span>
                                  </div>
                                  <div>
                                    <Typography
                                      sx={{ display: "inline" }}
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      כמות -
                                    </Typography>
                                    <span>{orderItem.units}</span>
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
                                    <span>
                                      {`${orderItem.cost * orderItem.units} ₪`}
                                    </span>
                                  </div>
                                  {menuObject[orderItem.menuId].comments ? (
                                    <div>
                                      <Typography
                                        sx={{ display: "block" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                      >
                                        הערות -
                                      </Typography>
                                      <span>
                                        {menuObject[orderItem.menuId].comments}
                                      </span>
                                    </div>
                                  ) : null}
                                  {orderItem.status ? (
                                    <div className="stepper-holder">
                                      <StepperStatus
                                        orderId={value.order.id}
                                        userId={value.order.userId}
                                        tableNumber={value.order.tableNumber}
                                        menuId={orderItem.menuId}
                                        status={orderItem.status}
                                        handleUpdateStatus={handleUpdateStatus}
                                      />
                                    </div>
                                  ) : null}
                                </React.Fragment>
                              }
                            />
                            {value.order?.statusOrder &&
                            value.order?.statusOrder.length - 1 !== index ? (
                              <Divider variant="inset" component="li" />
                            ) : null}
                          </div>
                        );
                      })}
                    </List>
                  </Collapse>
                </div>
                {orderData && orderData.length - 1 !== index ? (
                  <Divider variant="inset" component="li" />
                ) : null}
              </Fragment>
            );
          })
        ) : (
          <span className="no-order-data">{"לא נבחרו מנות להזמנה!"}</span>
        )}
      </List>
    </div>
  );
};

export default ManageOrder;

//statuses of order: send to kitchen -> in progress -> finished
// <Stack direction="row" spacing={1}>