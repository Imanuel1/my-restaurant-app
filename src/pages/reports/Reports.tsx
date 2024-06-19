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
    orders.forEach((order) => {
      if (
        paymentCount?.[order?.order?.paymentOption as keyof typeof paymentCount]
      ) {
        paymentCount[
          order.order.paymentOption as keyof typeof paymentCount
        ] += 1;
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
      { field: "id", headerName: "#", type: "string" },
      { field: "menu", headerName: "שם מנה", type: "string" },
      { field: "count", headerName: "מס' הפעמים שהוזמנה", type: "number" },
    ];
    const rowMostOrdered: GridRowsProp = sortedMenuIds.map((menuId, index) => ({
      [colMostOrdered[0].field]: index + 1,
      [colMostOrdered[1].field]: menuDictionary.get(menuId.id),
      [colMostOrdered[2].field]: menuId.count,
    }));
    const colPayment: GridColDef[] = [
      { field: "id", headerName: "#", type: "string" },
      { field: "bit", headerName: "תשלום בביט", type: "number" },
      { field: "cash", headerName: "תשלום במזומן", type: "number" },
    ];
    const rowPayment: GridRowsProp = [
      {
        [colMostOrdered[0].field]: 1,
        [colMostOrdered[1].field]: paymentCount.Bit,
        [colMostOrdered[2].field]: paymentCount.Cash,
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
