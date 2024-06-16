import React, { FC, useState, useContext } from "react";
import {
  Modal,
  Box,
  Button,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import "./EditableModal.css";
import ButtonX from "../buttonCustom/ButtonX";
import { MenuType, createNewMenu, updateMenu } from "../../parse/menu";

interface props {
  openModalType: string | null;
  setOpen: () => void;
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  menuType: MenuType;
}

const translatePopUp = {
  add: { label: "הוסף", title: "הוספת מנה", button: "הוסף מנה" },
  edit: {
    label: "ערוך",
    title: "ערוך מנה",
    button: "שמור שינויים",
  },
};

const EditableModal: FC<props> = ({
  openModalType,
  setOpen,
  id,
  title,
  description,
  price,
  image,
  menuType,
}) => {
  const [imageUrl, setImageUrl] = useState(
    openModalType === "edit" ? image : ""
  );
  const [menuName, setMenuName] = useState(
    openModalType === "edit" ? title : ""
  );
  const [menuDescription, setMenuDescription] = useState(
    openModalType === "edit" ? description : ""
  );
  const [menuPrice, setMenuPrice] = useState<number>(
    openModalType === "edit" ? price : 0
  );
  const [type, setType] = React.useState(menuType);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClose = () => setOpen();

  const handleAddOrEditOrder = async () => {
    if (openModalType === "add") {
      setIsLoading(true);
      await createNewMenu(type, menuName, menuDescription, menuPrice, imageUrl);
    } else if (openModalType === "edit") {
      setIsLoading(true);
      await updateMenu({
        id,
        type,
        name: menuName,
        description: menuDescription,
        price: menuPrice,
        image: imageUrl,
      });
    }
    setIsLoading(false);
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
    <>
      <Modal
        open={!!openModalType}
        onClose={handleClose}
        className="c-popup-editable-modal"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          "& .MuiBackdrop-root": { backgroundColor: "rgba(0, 0, 0, 0.2)" },
        }}
      >
        <Box sx={style}>
          <div className="header-container">
            <ButtonX
              Icon={{ IconName: CloseIcon, isButton: false }}
              variant="contained"
              style={{ position: "absolute", top: 0, left: 0 }}
              onClick={handleClose}
            />
            <h2 id="modal-title">
              {
                translatePopUp[openModalType as keyof typeof translatePopUp]
                  .title
              }
            </h2>
          </div>
          <Divider style={{ margin: "10px 0px" }} />
          <div className="body-container" dir="rtl">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">סוג מנה</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={type}
                label="Age"
                onChange={(event: SelectChangeEvent) =>
                  setType(event.target.value as MenuType)
                }
              >
                <MenuItem value={MenuType.FIRST}>ראשונות</MenuItem>
                <MenuItem value={MenuType.MAIN}>עיקריות</MenuItem>
                <MenuItem value={MenuType.DESSERTS}>קינוחים</MenuItem>
                <MenuItem value={MenuType.DRINKS}>משקאות</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                console.log("on change e:", e.target.value);
              }}
              id="outlined-basic"
              placeholder="קישור לתמונה"
              variant="standard"
              fullWidth
              style={{ direction: "rtl" }}
            />
            <TextField
              value={menuName}
              onChange={(e) => {
                setMenuName(e.target.value);
                console.log("on change e:", e.target.value);
              }}
              id="outlined-basic"
              placeholder="שם מנה"
              variant="standard"
              fullWidth
              style={{ direction: "rtl" }}
            />
            <TextField
              value={menuDescription}
              onChange={(e) => {
                setMenuDescription(e.target.value);
                console.log("on change e:", e.target.value);
              }}
              minRows={2}
              maxRows={5}
              id="outlined-basic"
              placeholder="תיאור מנה"
              variant="standard"
              multiline
              fullWidth
              style={{ direction: "rtl" }}
            />
            <TextField
              value={menuPrice}
              onChange={(e) => {
                setMenuPrice(Number(e.target.value));
                console.log("on change e:", e.target.value);
              }}
              size="small"
              type="number"
              id="outlined-basic"
              label="מחיר מנה"
              variant="outlined"
              style={{ direction: "rtl" }}
            />
          </div>
          <div className="footer-container">
            <ButtonX
              Icon={{ IconName: "", isButton: true }}
              text=""
              variant="contained"
              onClick={handleAddOrEditOrder}
              disabled={
                !menuDescription ||
                !menuName ||
                !menuPrice ||
                !type ||
                !imageUrl
              }
            >
              <h3>
                {openModalType
                  ? translatePopUp[openModalType as keyof typeof translatePopUp]
                      .button
                  : ""}
              </h3>
            </ButtonX>
          </div>
        </Box>
      </Modal>
      {isLoading ? (
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
    </>
  );
};

export default EditableModal;
