import React, { FC, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { MenuType } from "../../parse/menu";
import EditableModal from "../editableModal/EditableModal";
import "./EditableCard.css";

interface props {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  type: MenuType;
  setCheckedCard: () => void;
  openModalType: string | null;
  setOpenModal: () => void;
}

const EditableCard: FC<props> = ({
  id,
  title = "אריזוטו",
  description = "כהגה הקה קהק",
  price = 12,
  image = "",
  type,
  setCheckedCard,
  openModalType,
  setOpenModal,
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setCheckedCard();
  };

  return (
    <>
      <div className="c-card-container" onClick={() => setIsOpenModal(true)}>
        <div className="details-container">
          <span className="card-title">{title}</span>
          <span className="card-description">{description}</span>
          <span className="card-price">{`${price} ₪`}</span>
        </div>
        <div
          className="background-container"
          style={image ? { backgroundImage: `url(${image})` } : {}}
        >
          <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>
      {openModalType ? (
        <EditableModal
          openModalType={openModalType}
          setOpen={setOpenModal}
          id={id}
          title={title}
          description={description}
          price={price}
          image={image}
          menuType={type}
        />
      ) : null}
    </>
  );
};

export default EditableCard;
