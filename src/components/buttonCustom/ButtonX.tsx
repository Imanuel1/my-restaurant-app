import { IconButton } from "@mui/material";
import React, { CSSProperties, FC } from "react";
import Button from "@mui/material/Button";

interface props {
  text?: string;
  Icon?: { isButton?: boolean; IconName: any };
  type?: "success" | "error" | "info" | "warning";
  variant?: "text" | "contained" | "outlined";
  onClick?: (value: string) => void;
  style?: CSSProperties;
}

const ButtonX: FC<props> = ({
  text,
  Icon,
  type,
  variant = "contained",
  onClick = () => {},
  style = {},
}) => {
  if (!Icon?.isButton) {
    return (
      <IconButton
        aria-label="icon-button"
        style={{ ...style }}
        onClick={(e) => onClick(e.currentTarget.value)}
        color={type}
      >
        {Icon?.IconName ? <Icon.IconName /> : <></>}
      </IconButton>
    );
  }

  return (
    <div
      className={`c-button-container ${variant} ${type}`}
      style={{ ...style }}
    >
      <Button
        variant={variant}
        startIcon={Icon.IconName ? <Icon.IconName /> : <></>}
        onClick={(e) => onClick(e.currentTarget.value)}
        color={type}
      >
        {text}
      </Button>
    </div>
  );
};

export default ButtonX;
