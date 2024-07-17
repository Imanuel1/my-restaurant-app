import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Avatar, ListItemAvatar, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ButtonX from "../../components/buttonCustom/ButtonX";
import "./HistoryOrder.css";
import { UserContext } from "../../context/UserContext";
import { OrderContext } from "../../context/OrderContext";
import {
  StatuMenuType,
  createOrder,
  getOrders,
  getOrdersType,
  updateOrder,
} from "../../parse/order";
import ManageOrder from "../../components/ManageOrder/ManageOrder";
import StepperStatus from "../../components/stepper/StepperStatus";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  getHistoryOrders,
  getHistoryOrdersType,
} from "../../parse/orderHistory";

export default function HistoryOrder() {
  const { activeUser } = useContext(UserContext);
  const { setOrder, currentOrder } = useContext(OrderContext);

  const [orderData, setOrderData] = useState<getHistoryOrdersType[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenItems, setIsOpenItems] = useState<boolean[]>([]);

  useEffect(() => {
    if (orderData?.length) {
      setIsOpenItems(new Array(orderData.length || 0).fill(false));
    }
  }, [orderData]);

  const getHistoryRequest = () => {
    //request for order of the current user
    const userType = activeUser?.attributes?.role || "";
    getHistoryOrders(activeUser?.id || "", userType)
      .then((res) => {
        setOrderData(res);
        console.log("res res order:", res);
      })
      .catch((err) => console.error("error while getOrders :", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    getHistoryRequest();
  }, []);

  const visibleOrderList =
    (orderData &&
      orderData?.length &&
      activeUser?.attributes?.role === "manager") ||
    activeUser?.attributes?.role === "worker"
      ? orderData
      : orderData?.filter((order) => order.order?.userId === activeUser?.id);

  const statusTranslate = {
    [StatuMenuType.PENDING]: "בהמתנה",
    [StatuMenuType.PREPERING]: "בהכנה",
    [StatuMenuType.COMPLETED]: "מוכן",
  };

  const handleCreateOrderFromHistroy = async (
    orderId: string,
    menuItems: getHistoryOrdersType["menuItems"],
    statusOrder: getHistoryOrdersType["order"]["statusOrder"]
  ) => {
    setIsLoading(true);
    //if user has proccessing order
    try {
      const userType = activeUser?.attributes?.role || "";
      const userActiveOrder = await getOrders(activeUser?.id || "", userType);
      if (userActiveOrder && userActiveOrder?.length) {
        const sumCost = statusOrder.reduce(
          (acc, status) => acc + status.cost,
          0
        );
        await updateOrder({
          id: userActiveOrder[0].order.id,
          cost: sumCost,
          menuItems: statusOrder,
        });
      } else {
        //create local order
        const orderData: {
          menuItems: {
            menuId: string;
            units: number;
            cost: number;
            comments: string;
            title: string;
            description: string;
            image: string;
          }[];
          userId?: string;
        } = {
          userId: activeUser ? activeUser.id : undefined,
          menuItems: menuItems.map((menu, index) => ({
            menuId: menu.id,
            cost: statusOrder[index].cost,
            units: statusOrder[index].units,
            comments: menu.comments,
            title: menu.name,
            description: menu.description,
            image: menu.image,
          })),
        };
        if (currentOrder) {
          orderData.userId = activeUser?.id;
          orderData.menuItems = [
            ...orderData.menuItems,
            ...currentOrder.menuItems,
          ];

          setOrder(orderData);
        } else {
          setOrder(orderData);
        }
      }
    } catch (error) {
      console.log("error while search active order for user!", error);
    }

    setIsLoading(false);
    getHistoryRequest();
  };

  const handleRowClick = (index: number) => {
    setIsOpenItems((prev) => {
      const newValue = [...prev];
      newValue[index] = !newValue[index];
      return newValue;
    });
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

  return (
    <div className="c-orders-container">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {visibleOrderList && visibleOrderList?.length > 0 ? (
          visibleOrderList.map((value: getHistoryOrdersType, index: number) => {
            const labelId = `checkbox-list-label-${value.order.id}`;

            return (
              <Fragment key={index}>
                <div className="item-container">
                  <ListItemButton onClick={() => handleRowClick(index)}>
                    {isOpenItems[index] ? <ExpandLess /> : <ExpandMore />}
                    <ListItemText
                      id={labelId}
                      primary={`הזמנה מס' ${index + 1}  -  מזמין  ${
                        value.order?.userName || "אורח"
                      }  -  תאריך  ${new Date(
                        value.order.createdAt
                      ).toLocaleDateString()} - `}
                    />
                    <ListItemText
                      primary={
                        <>
                          {value.order?.statusOrder?.length &&
                          (!activeUser ||
                            activeUser?.attributes?.role === "client") ? (
                            <ButtonX
                              Icon={{
                                IconName: PublishedWithChangesIcon,
                                isButton: true,
                              }}
                              type="success"
                              text="הזמן שוב"
                              aria-label="comments"
                              onClick={() =>
                                handleCreateOrderFromHistroy(
                                  value.order.id,
                                  value.menuItems,
                                  value.order.statusOrder
                                )
                              }
                            />
                          ) : null}
                        </>
                      }
                      secondary={`עלות הזמנה ${value.order.cost} ₪`}
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
                                src={menuObject?.[orderItem?.menuId]?.image}
                                sx={{ cursor: "pointer" }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              id={labelId}
                              primary={orderItem?.menuName}
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
                                      {
                                        menuObject?.[orderItem.menuId]
                                          ?.description
                                      }
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
                                  {orderItem.comments ? (
                                    <div>
                                      <Typography
                                        sx={{ display: "block" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                      >
                                        הערות -
                                      </Typography>
                                      <span>{orderItem.comments}</span>
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
          <span className="no-order-data">{"לא קיים היסטוריית הזמנות"}</span>
        )}
      </List>
    </div>
  );
}

//statuses of order: send to kitchen -> in progress -> finished
// <Stack direction="row" spacing={1}>

//
