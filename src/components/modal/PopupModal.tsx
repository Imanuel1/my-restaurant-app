import React, { FC, useState, useContext } from "react";
import { Modal, Box, Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import "./PopupModal.css";
import ButtonX from "../buttonCustom/ButtonX";
import { OrderContext } from "../../context/OrderContext";
import { UserContext } from "../../context/UserContext";

interface props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

const PopupModal: FC<props> = ({
  open,
  setOpen,
  id,
  title,
  description,
  price,
  image,
}) => {
  const [units, setUnits] = useState(1);
  const [comments, setComments] = useState("");
  const { setOrder, currentOrder } = useContext(OrderContext);
  const { activeUser } = useContext(UserContext);

  const handleClose = () => setOpen(false);

  const handleAddOrder = () => {
    const orderData: {
      menuItems: {
        menuId: string;
        units: number;
        cost: number;
        comments: string;
        title: string;
        description: string;
        image: string;
      }[];
      userId?: string;
    } = {
      userId: activeUser ? activeUser.id : undefined,
      menuItems: [{ menuId: id, cost: price * units, units, comments, title, description, image }],
    };
    if (currentOrder) {
      orderData.userId = activeUser?.id;
      orderData.menuItems = [...orderData.menuItems, ...currentOrder.menuItems];

      //TODO: if already has the same id in the same array - use reduce
      setOrder(orderData);
    } else {
      setOrder(orderData);
    }

    handleClose();
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
            value={comments}
            onChange={(e) => {
              setComments(e.target.value);
              console.log("on change e:", e.target.value);
            }}
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
            {/* if client has birthday!!! */}
          </ButtonX>
        </div>
      </Box>
    </Modal>
  );
};

export default PopupModal;
