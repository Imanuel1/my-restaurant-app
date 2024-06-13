import React, { FC, useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import "./PopupModal.css";
import ButtonX from "../buttonCustom/ButtonX";

interface props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  price: number;
  image: string;
}

const PopupModal: FC<props> = ({
  open,
  setOpen,
  title,
  description,
  price,
  image,
}) => {
  const [units, setUnits] = useState(1);

  const handleClose = () => setOpen(false);

  const handleAddOrder = () => {
    
  };

  const style = {
    position: "relative",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    bgcolor: "background.paper",
    boxShadow: 24,
    // p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="c-popup-modal"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        "& .MuiBackdrop-root": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Box sx={style}>
        <div
          className="header-container"
          style={{
            backgroundImage: `url(${image})`,
          }}
        >
          <ButtonX
            Icon={{ IconName: CloseIcon, isButton: false }}
            variant="contained"
            style={{ position: "absolute", top: 0, left: 0 }}
            onClick={handleClose}
          />
        </div>
        <div className="body-container" dir="rtl">
          <h2 id="modal-title">{title}</h2>
          <p id="modal-description">{description}</p>
          <Divider style={{ margin: "10px 0px" }} />

          <TextField
            minRows={2}
            maxRows={5}
            id="outlined-basic"
            label="הערות למלצר"
            variant="standard"
            fullWidth
            multiline
            style={{ direction: "rtl" }}
          />
        </div>
        <div className="footer-container">
          <div className="inc-dec-buttons">
            <ButtonX
              Icon={{ IconName: AddIcon, isButton: true }}
              variant="text"
              disabled={units >= 10}
              onClick={() => setUnits((prev) => prev + 1)}
            />
            <span className="units-holder">{units}</span>
            <ButtonX
              Icon={{ IconName: RemoveIcon, isButton: true }}
              variant="text"
              disabled={units === 1}
              onClick={() => setUnits((prev) => prev - 1)}
            />
          </div>
          <ButtonX
            Icon={{ IconName: AddShoppingCartIcon, isButton: true }}
            text=""
            variant="contained"
            onClick={handleAddOrder}
          >
            <h3>להוסיף לסל</h3>
            <span>{`${price * units}₪`}</span>
            {/* text-decoration: line-through */}
          </ButtonX>
        </div>
      </Box>
    </Modal>
  );
};

export default PopupModal;
