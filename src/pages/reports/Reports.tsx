import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import React, { FC } from "react";
import "./Reports.css";
import { getOrders } from "../../parse/order";
import { UserContext } from "../../context/UserContext";
import { GridCellParams, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { IconContainerProps } from "@mui/material/Rating";
import {
  getHistoryOrders,
  getHistoryOrdersType,
} from "../../parse/orderHistory";
import DataGridTable from "../../components/Table/Table";
import { IconContainer, customIcons } from "../../components/rating/Rating";
import { CircularProgress } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

const Reports = () => {
  const [orders, setOrders] = useState<getHistoryOrdersType[]>([]);
  const [ordersPerDay, setOrdersPerDay] = useState<getHistoryOrdersType[]>([]);
  const [time, setTime] = useState<Dayjs | null>(
    dayjs(new Date().toLocaleString())
  );
  const { activeUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const tablesStructure = useMemo(() => {
    const menuDictionary = new Map<string, string>();
    const menuIds: string[] = []; //all the ids that in history
    const paymentCount: { Cash: number; Bit: number } = { Cash: 0, Bit: 0 }; //all the ids that in history
    const months: {
      name: string;
      he: string;
      count: { Cash: number; Bit: number };
    }[] = [
      { name: "January", he: "ינואר", count: { Cash: 0, Bit: 0 } },
      { name: "February", he: "פברואר", count: { Cash: 0, Bit: 0 } },
      { name: "March", he: "מרץ", count: { Cash: 0, Bit: 0 } },
      { name: "April", he: "אפריל", count: { Cash: 0, Bit: 0 } },
      { name: "May", he: "מאי", count: { Cash: 0, Bit: 0 } },
      { name: "June", he: "יוני", count: { Cash: 0, Bit: 0 } },
      { name: "July", he: "יולי", count: { Cash: 0, Bit: 0 } },
      { name: "August", he: "אוגוסט", count: { Cash: 0, Bit: 0 } },
      { name: "September", he: "ספטמבר", count: { Cash: 0, Bit: 0 } },
      { name: "October", he: "אוקטובר", count: { Cash: 0, Bit: 0 } },
      { name: "November", he: "נובמבר", count: { Cash: 0, Bit: 0 } },
      { name: "December", he: "דצמבר", count: { Cash: 0, Bit: 0 } },
    ];

    const monthToIndex = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const rateCount: {
      avgRate: number;
      count: number;
      rate_5: number;
      rate_4: number;
      rate_3: number;
      rate_2: number;
      rate_1: number;
      rate_0: number;
    } = {
      avgRate: 0,
      count: 0,
      rate_5: 0,
      rate_4: 0,
      rate_3: 0,
      rate_2: 0,
      rate_1: 0,
      rate_0: 0,
    };

    orders.forEach((order, index) => {
      if (order?.order?.paymentOption) {
        paymentCount[
          order.order.paymentOption as keyof typeof paymentCount
        ] += 1;
        const orderrMonth = new Date(order.order.updatedAt).toLocaleString(
          "en-US",
          { month: "long" }
        ) as keyof typeof monthToIndex;
        months[monthToIndex[orderrMonth]].count[
          order.order.paymentOption as keyof typeof paymentCount
        ] += order.order.cost;
        switch (order.order?.rating) {
          case undefined:
            rateCount.rate_0 += 1;
            break;
          case 5:
          case 4:
          case 3:
          case 2:
          case 1:
            rateCount[`rate_${order.order.rating}`] += 1;
            rateCount.count += 1;
            rateCount.avgRate += order.order.rating;
            break;
        }
      }
      order?.order.statusOrder?.forEach(({ menuId, menuName }) => {
        menuIds.push(menuId);
        menuDictionary.set(menuId, menuName);
      });
      if (orders.length - 1 === index) {
        rateCount.avgRate = rateCount.avgRate / rateCount.count;
      }
    });
    // Count occurrences of each menu ID
    const menuIdCounts = menuIds.reduce(
      (acc: { [key in string]: number }, curr: string) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      },
      {}
    );
    // Sort menu IDs by count (descending) and select top 5
    const sortedMenuIds = Object.entries(menuIdCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 5) // Take top 5
      .map((menu) => ({ id: menu[0], count: menu[1] })); // Extract just IDs

    const colMostOrdered: GridColDef[] = [
      { field: "id", headerName: "#", type: "string", headerAlign: "center" },
      {
        field: "menu",
        headerName: "שם מנה",
        type: "string",
        width: 200,
        headerAlign: "center",
      },
      {
        field: "count",
        headerName: "מס' הפעמים שהוזמנה",
        type: "string",
        width: 200,
        headerAlign: "center",
      },
    ];
    const rowMostOrdered: GridRowsProp = sortedMenuIds.map((menuId, index) => ({
      [colMostOrdered[0].field]: index + 1,
      [colMostOrdered[1].field]: menuDictionary.get(menuId.id),
      [colMostOrdered[2].field]: menuId.count,
      align: "center",
    }));
    const colPayment: GridColDef[] = [
      { field: "id", headerName: "#", type: "string", headerAlign: "center" },
      {
        field: "bit",
        headerName: "תשלום בביט",
        type: "string",
        headerAlign: "center",
      },
      {
        field: "cash",
        headerName: "תשלום במזומן",
        type: "string",
        headerAlign: "center",
      },
    ];
    const rowPayment: GridRowsProp = [
      {
        [colPayment[0].field]: 1,
        [colPayment[1].field]: paymentCount.Bit,
        [colPayment[2].field]: paymentCount.Cash,
        align: "center",
      },
    ];

    let colMoney: GridColDef[] = [
      { field: "id", headerName: "#", type: "string", headerAlign: "center" },
      {
        field: "paymentType",
        headerName: "סוג הכנסה",
        type: "string",
        headerAlign: "center",
      },
    ];
    months.forEach((month, index) => {
      colMoney.push({
        field: month.name,
        headerName: month.he,
        type: "string",
        headerAlign: "center",
      });
    });
    const rowMoney: GridRowsProp = [
      {
        [colMoney[0].field]: 1,
        [colMoney[1].field]: "ביט",
        [colMoney[2].field]: months[0].count.Bit,
        [colMoney[3].field]: months[1].count.Bit,
        [colMoney[4].field]: months[2].count.Bit,
        [colMoney[5].field]: months[3].count.Bit,
        [colMoney[6].field]: months[4].count.Bit,
        [colMoney[7].field]: months[5].count.Bit,
        [colMoney[8].field]: months[6].count.Bit,
        [colMoney[9].field]: months[7].count.Bit,
        [colMoney[10].field]: months[8].count.Bit,
        [colMoney[11].field]: months[9].count.Bit,
        [colMoney[12].field]: months[10].count.Bit,
        [colMoney[13].field]: months[11].count.Bit,
        align: "center",
      },
      {
        [colMoney[0].field]: 2,
        [colMoney[1].field]: "מזומן",
        [colMoney[2].field]: months[0].count.Cash,
        [colMoney[3].field]: months[1].count.Cash,
        [colMoney[4].field]: months[2].count.Cash,
        [colMoney[5].field]: months[3].count.Cash,
        [colMoney[6].field]: months[4].count.Cash,
        [colMoney[7].field]: months[5].count.Cash,
        [colMoney[8].field]: months[6].count.Cash,
        [colMoney[9].field]: months[7].count.Cash,
        [colMoney[10].field]: months[8].count.Cash,
        [colMoney[11].field]: months[9].count.Cash,
        [colMoney[12].field]: months[10].count.Cash,
        [colMoney[13].field]: months[11].count.Cash,
        align: "center",
      },
      {
        [colMoney[0].field]: 3,
        [colMoney[1].field]: "הכנסה כוללת",
        [colMoney[2].field]: months[0].count.Bit + months[0].count.Cash,
        [colMoney[3].field]: months[1].count.Bit + months[1].count.Cash,
        [colMoney[4].field]: months[2].count.Bit + months[2].count.Cash,
        [colMoney[5].field]: months[3].count.Bit + months[3].count.Cash,
        [colMoney[6].field]: months[4].count.Bit + months[4].count.Cash,
        [colMoney[7].field]: months[5].count.Bit + months[5].count.Cash,
        [colMoney[8].field]: months[6].count.Bit + months[6].count.Cash,
        [colMoney[9].field]: months[7].count.Bit + months[7].count.Cash,
        [colMoney[10].field]: months[8].count.Bit + months[8].count.Cash,
        [colMoney[11].field]: months[9].count.Bit + months[9].count.Cash,
        [colMoney[12].field]: months[10].count.Bit + months[10].count.Cash,
        [colMoney[13].field]: months[11].count.Bit + months[11].count.Cash,
        align: "center",
      },
    ];

    const colRating: GridColDef[] = [
      { field: "id", headerName: "#", type: "string", headerAlign: "center" },
      {
        field: "avgRate",
        renderHeader: () => {
          console.log("rate avg :", Math.round(rateCount.avgRate));

          return (
            <>
              <span>{`ציון ממוצע -`}</span>
              {/* {IconContainer({
              value: Math.round(rateCount.avgRate),
            } as IconContainerProps)} */}
              {Math.round(rateCount.avgRate) ? (
                <span>{customIcons[Math.round(rateCount.avgRate)].icon}</span>
              ) : null}
            </>
          );
        },
        type: "string",
        headerAlign: "center",
      },
      {
        field: "count",
        headerName: "כמות דירוגים",
        type: "string",
        headerAlign: "center",
      },
      {
        field: "rate_5",
        renderHeader: () => (
          <>
            <span>{`דירוג 5 -`}</span>
            {/* {IconContainer({ value: 5 } as IconContainerProps)} */}
            <span>{customIcons[5].icon}</span>
          </>
        ),
        type: "string",
        headerAlign: "center",
      },
      {
        field: "rate_4",
        renderHeader: () => (
          <>
            <span>{`דירוג 4 -`}</span>
            {/* {IconContainer({ value: 4 } as IconContainerProps)} */}
            <span>{customIcons[4].icon}</span>
          </>
        ),
        type: "string",
        headerAlign: "center",
      },
      {
        field: "rate_3",
        renderHeader: () => (
          <>
            <span>{`דירוג 3 -`}</span>
            {/* {IconContainer({ value: 3 } as IconContainerProps)} */}
            <span>{customIcons[3].icon}</span>
          </>
        ),
        type: "string",
        headerAlign: "center",
      },
      {
        field: "rate_2",
        renderHeader: () => (
          <>
            <span>{`דירוג 2 -`}</span>
            {/* {IconContainer({ value: 2 } as IconContainerProps)} */}
            <span>{customIcons[2].icon}</span>
          </>
        ),
        type: "string",
        headerAlign: "center",
      },
      {
        field: "rate_1",
        renderHeader: () => (
          <>
            <span>{`דירוג 1 -`}</span>
            <span>{customIcons[1].icon}</span>
          </>
        ),
        type: "string",
        headerAlign: "center",
      },
      {
        field: "rate_0",
        headerName: "לא דירגו",
        type: "string",
        headerAlign: "center",
      },
    ];
    const rowRating: GridRowsProp = [
      {
        [colRating[0].field]: 1,
        [colRating[1].field]: Math.round(rateCount.avgRate * 10) / 10,
        [colRating[2].field]: rateCount.count,
        [colRating[3].field]: rateCount.rate_5,
        [colRating[4].field]: rateCount.rate_4,
        [colRating[5].field]: rateCount.rate_3,
        [colRating[6].field]: rateCount.rate_2,
        [colRating[7].field]: rateCount.rate_1,
        [colRating[8].field]: rateCount.rate_0,
        align: "center",
      },
    ];
    // const colMostOrdered: GridColDef[] = [{field: "#", type: "string"}, {field: "menu", headerName: "שם מנה", type: "string"}];

    return [
      {
        title: "דירוג המסעדה",
        columns: colRating,
        rows: rowRating,
      },
      {
        title: "חמש המנות שהוזמנו הכי הרבה במסעדה",
        columns: colMostOrdered,
        rows: rowMostOrdered,
      },
      {
        title: "מה תצורת התשלום הנפוצה ביותר במסעדה",
        columns: colPayment,
        rows: rowPayment,
      },
      {
        title: "ההכנסות החודשיות במסעדה",
        columns: colMoney,
        rows: rowMoney,
      },
    ];
  }, [orders]);

  useEffect(() => {
    const userType = activeUser?.attributes?.role || "";
    setIsLoading(true);
    getHistoryOrders(activeUser?.id || "", userType)
      .then((res: getHistoryOrdersType[] | null) => {
        if (res) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => console.error("error get all orders", err))
      .finally(() => setIsLoading(false));

    getHistoryOrders(activeUser?.id || "", userType, time as any)
      .then((res: getHistoryOrdersType[] | null) => {
        if (res) {
          setOrdersPerDay(res);
        } else {
          setOrdersPerDay([]);
        }
      })
      .catch((err) => console.error("error get all orders", err))
      .finally(() => setIsLoading(false));
  }, []);

  const tableData = () => {
    const colRating: GridColDef[] = [
      { field: "id", headerName: "#", type: "string", headerAlign: "center" },
    ];
    const rowRating: GridRowsProp = [];

    return {
      title: "הכנסה לפי תאריך",
      columns: colRating,
      rows: rowRating,
    };
  };

  return (
    <>
      <div className="c-reports-container">
        {tablesStructure?.length
          ? tablesStructure.map((tableStructure, index) => (
              <DataGridTable key={index} tableData={tableStructure} />
            ))
          : null}
        <DataGridTable tableData={tableData()} />
      </div>
      {isLoading ? (
        <CircularProgress
          style={{ position: "absolute", top: "42%", left: "42%", zIndex: 5 }}
        />
      ) : null}
    </>
  );
};

export default Reports;
