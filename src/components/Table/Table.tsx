import React, { FC } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import "./Table.css";
import DatePickerValue from "../datePicker/DatePicker";
import dayjs, { Dayjs } from "dayjs";

type props = {
  tableData: {
    id: string;
    title: string;
    rows: GridRowsProp;
    columns: GridColDef[];
  };
  time: dayjs.Dayjs | null;
  setTime: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
};

const DataGridTable: FC<props> = ({
  tableData: { title, rows, columns, id },
  time,
  setTime,
}) => {
  return (
    <div className="table-container">
      <span className="table-title">{title}</span>
      <div>
        {id === "resturamt-money-per-day" ? (
          <DatePickerValue time={time} setTime={setTime} />
        ) : null}
      </div>
      <div style={{ height: "max-content", width: "99%", direction: "rtl" }}>
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
