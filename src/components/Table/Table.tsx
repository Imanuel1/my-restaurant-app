import React, { FC } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import "./Table.css";

type props = {
  tableData: {
    title: string;
    rows: GridRowsProp;
    columns: GridColDef[];
  };
};

const DataGridTable: FC<props> = ({ tableData: { title, rows, columns } }) => {
  return (
    <div className="table-container">
      <span className="table-title">{title}</span>
      <div style={{ height: 350, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} hideFooter />
      </div>
    </div>
  );
};

export default DataGridTable;
