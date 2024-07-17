import * as React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import "./Alert.css";

type props = {
  severity: "success" | "info" | "warning" | "error";
  variant?: "standard" | "filled" | "outlined";
  title?: string;
  text?: string;
};

const CustomAlert: React.FC<props> = ({
  severity,
  variant = "standard",
  title,
  text,
}) => {
  return (
    <Alert className="alert-holder" severity={severity} variant={variant}>
      {title ? <AlertTitle>Success</AlertTitle> : null}
      {text}
    </Alert>
  );
};

export default CustomAlert;
