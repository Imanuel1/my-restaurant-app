import React, { useContext, useEffect, useState, Fragment } from "react";
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
import ButtonX from "../buttonCustom/ButtonX";
import "./ManageOrder.css";
import {
  createOrder,
  getOrders,
  getOrdersType,
  StatuMenuType,
} from "../../parse/order";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import StepperStatus from "../stepper/StepperStatus";

export default function ManageOrder({
  orderData,
}: {
  orderData: getOrdersType[];
}) {
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

  return (
    <div className="c-orders-container">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {orderData?.length > 0 ? (
          orderData?.map((value: getOrdersType, index: number) => {
            const labelId = `checkbox-list-label-${value.order.id}`;

            return (
              <>
                <div className="item-container" key={index}>
                  <ListItemButton onClick={() => handleRowClick(index)}>
                    {isOpenItems[index] ? <ExpandLess /> : <ExpandMore />}
                    <ListItemText
                      id={labelId}
                      primary={`הזמנה מס' שולחן ${
                        value.order.tableNumber
                      } - מזמין  ${
                        (value.order.userId as any).attributes.username
                      }`}
                    />
                    <ListItemText primary="" />
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
                          <div className="manager-order-item">
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
                                    <div>
                                      {/* <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                      >
                                        עדכון סטאטוס -
                                      </Typography>
                                      <span>
                                        {statusTranslate[orderItem.status]}
                                      </span> */}
                                      {/* //TODO: stepper component that will change menu status */}
                                      <StepperStatus
                                        orderId={value.order.id}
                                        menuId={orderItem.menuId}
                                        status={orderItem.status}
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
              </>
            );
          })
        ) : (
          <span className="no-order-data">{"לא נבחרו מנות להזמנה!"}</span>
        )}
      </List>
    </div>
  );
}

//statuses of order: send to kitchen -> in progress -> finished
// <Stack direction="row" spacing={1}>
