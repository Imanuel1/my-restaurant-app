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
          disableVirtualization
          sx={{
            "& .MuiDataGrid-row  .MuiDataGrid-cell": {
              textAlign: "center",
            },
            "& .MuiDataGrid-virtualScrollerContent > .MuiDataGrid-virtualScrollerRenderZone":
              {
                position: "absolute !important",
                // minWidth: "fit-content !important",
              },
          }}
        />
      </div>
    </div>
  );
};

export default DataGridTable;
