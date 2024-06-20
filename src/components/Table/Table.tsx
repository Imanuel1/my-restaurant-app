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
      <div style={{ height: "max-content", width: "100%", direction: "rtl" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter
          sx={{
            "& .MuiDataGrid-row  .MuiDataGrid-cell": {
              alignItems: "center",
              textAlign: "center",
            },
            "& .MuiDataGrid-row": {
              minWidth: "max-content",
            },
            // "& .MuiDataGrid-columnHeaders > div": {
            //   display: "flex",
            //   flexDirection: "revert",
            // },
            // "& .MuiDataGrid-columnHeaders ": {
            //   display: "flex",
            //   flexDirection: "revert",
            // },
          }}
        />
      </div>
    </div>
  );
};

export default DataGridTable;
