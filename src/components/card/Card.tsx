import React, { FC, useState } from "react";
import "./Card.css";
import ButtonX from "../buttonCustom/ButtonX";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PopupModal from "../modal/PopupModal";
interface props {
  title: string;
  description: string;
  price: number;
  image?: string;
}

const Card: FC<props> = ({
  title = "אריזוטו",
  description = "כהגה הקה קהק",
  price = 12,
  image = "",
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <>
      <div className="c-card-container" onClick={() => setIsOpenModal(true)}>
        <div className="details-container">
          <span className="card-title">{title}</span>
          <span className="card-description">{description}</span>
          <span className="card-price">{`${price} ₪`}</span>
        </div>
        <div className="background-container">
          <ButtonX Icon={{ isButton: false, IconName: AddCircleIcon }} />
        </div>
      </div>
      {isOpenModal ? <PopupModal /> : null}
    </>
  );
};

export default Card;
