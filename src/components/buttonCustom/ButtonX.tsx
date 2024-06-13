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
  disabled?: boolean;
  children?: React.ReactNode;
}

const ButtonX: FC<props> = ({
  text,
  Icon,
  type,
  variant = "contained",
  onClick = () => {},
  style = {},
  disabled = false,
  children = <></>,
}) => {
  if (!Icon?.isButton) {
    return (
      <IconButton
        aria-label="icon-button"
        style={{ ...style }}
        onClick={(e) => onClick(e.currentTarget.value)}
        color={type}
        disabled={disabled}
      >
        <>
          {Icon?.IconName ? <Icon.IconName /> : <></>}
          {children}
        </>
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
        disabled={disabled}
      >
        <div>
          {text}
          {children}
        </div>
      </Button>
    </div>
  );
};

export default ButtonX;
