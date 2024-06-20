import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import React, { FC } from "react";
import "./Reports.css";
import { getOrders } from "../../parse/order";
import { UserContext } from "../../context/UserContext";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import {
  getHistoryOrders,
  getHistoryOrdersType,
} from "../../parse/orderHistory";
import DataGridTable from "../../components/Table/Table";

const Reports = () => {
  const [orders, setOrders] = useState<getHistoryOrdersType[]>([]);
  const { activeUser } = useContext(UserContext);
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
    orders.forEach((order) => {
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
      }
      order?.order.statusOrder?.forEach(({ menuId, menuName }) => {
        menuIds.push(menuId);
        menuDictionary.set(menuId, menuName);
      });
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
    let rowMoney: GridRowsProp = [
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

    // const colMostOrdered: GridColDef[] = [{field: "#", type: "string"}, {field: "menu", headerName: "שם מנה", type: "string"}];

    return [
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

    getHistoryOrders(activeUser?.id || "", userType)
      .then((res: getHistoryOrdersType[] | null) => {
        if (res) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => console.error("error get all orders", err));
  }, []);

  return (
    <div className="c-reports-container">
      {tablesStructure?.length
        ? tablesStructure.map((tableStructure, index) => (
            <DataGridTable key={index} tableData={tableStructure} />
          ))
        : null}
    </div>
  );
};

export default Reports;
