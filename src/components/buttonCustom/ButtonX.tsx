import { IconButton } from "@mui/material";
import React, { CSSProperties, FC } from "react";
import Button from "@mui/material/Button";

interface props {
  text?: string;
  Icon?: { isButton?: boolean; IconName: any };
  type?: "success" | "error" | "info" | "warning";
  variant?: "text" | "contained" | "outlined";
  style?: CSSProperties;
}

const ButtonX: FC<props> = ({
  text,
  Icon,
  type,
  variant = "contained",
  style = {},
}) => {
  if (!Icon?.isButton) {
    return (
      <IconButton aria-label="icon-button" style={{ ...style }}>
        {Icon?.IconName ? <Icon.IconName /> : <></>}
      </IconButton>
    );
  }

  return (
    <div
      className={`c-button-container ${variant} ${type}`}
      style={{ ...style }}
    >
      <img src="" alt="delete" />
      <Button
        variant={variant}
        startIcon={Icon.IconName ? <Icon.IconName /> : <></>}
      >
        {text}
      </Button>
    </div>
  );
};

export default ButtonX;
