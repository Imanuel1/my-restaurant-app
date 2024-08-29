import React, { FC, useState } from "react";
import "./DatePicker.css";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface props {
  time: dayjs.Dayjs | null;
  setTime: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
}

const DatePickerValue: FC<props> = ({ time, setTime }) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17"));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="select date"
        value={time}
        onChange={(newValue: Dayjs | null) => setTime(newValue)}
      />
    </LocalizationProvider>
  );
};

export default DatePickerValue;
