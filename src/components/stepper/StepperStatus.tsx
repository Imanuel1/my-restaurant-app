import React, { FC, useState, useContext, useEffect } from "react";
import { Modal, Box, Button, StepIconProps } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./StepperStatus.css";
import ButtonX from "../buttonCustom/ButtonX";
import { OrderContext } from "../../context/OrderContext";
import { UserContext } from "../../context/UserContext";
import { StatuMenuType, updateOrderStatus } from "../../parse/order";

interface props {
  orderId: string;
  menuId: string;
  status: string;
  handleUpdateStatus?: (id: string, menuId: string, status: string) => void;
}

const statusTranslate = {
  [StatuMenuType.PENDING]: "בהמתנה",
  [StatuMenuType.PREPERING]: "בהכנה",
  [StatuMenuType.COMPLETED]: "מוכן",
};
const statuses = {
  [StatuMenuType.PENDING]: "Pending",
  [StatuMenuType.PREPERING]: "Preparing",
  [StatuMenuType.COMPLETED]: "Completed",
};
const indexToStatus = {
  0: StatuMenuType.PENDING,
  1: StatuMenuType.PREPERING,
  2: StatuMenuType.COMPLETED,
};
const statusToIndex = {
  [StatuMenuType.PENDING]: 0,
  [StatuMenuType.PREPERING]: 1,
  [StatuMenuType.COMPLETED]: 2,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <PendingActionsIcon />,
    2: <PublishedWithChangesIcon />,
    3: <CheckCircleIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

const StepperStatus: FC<props> = ({
  orderId,
  menuId,
  status,
  handleUpdateStatus,
}) => {
  const [activeStep, setActiveStep] = useState<number>(
    statusToIndex?.[status as StatuMenuType] as number
  );
  const { activeUser } = useContext(UserContext);

  useEffect(() => {
    handleUpdateStatus?.(
      orderId,
      menuId,
      indexToStatus[activeStep as keyof typeof indexToStatus] as string
    );
  }, [activeStep]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        className="stepper-container"
      >
        {Object.values(statuses).map((label, index) => (
          <Step
            key={label}
            className={
              activeUser?.attributes?.role === "manager" ||
              activeUser?.attributes?.role === "worker"
                ? "admin"
                : "client"
            }
            onClick={() =>
              setActiveStep((prev) =>
                activeUser?.attributes?.role === "manager" ||
                activeUser?.attributes?.role === "worker"
                  ? index
                  : prev
              )
            }
          >
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              {statusTranslate[label as keyof typeof statusTranslate]}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperStatus;
