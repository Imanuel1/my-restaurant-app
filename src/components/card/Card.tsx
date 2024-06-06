import React, { FC } from "react";
import "./Card.css";
import ButtonX from "../buttonCustom/ButtonX";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface props {
  title: string;
  description: string;
  price: number;
}

const Card: FC<props> = ({ title= "אריזוטו", description="כהגה הקה קהק", price=12 }) => {
  return (
    <div className="c-card-container">
      <div className="background-container">
        <ButtonX Icon={{ isButton: true, IconName: AddCircleIcon }} />
      </div>
      <div className="details-container">
        <span className="card-title">{title}</span>
        <span className="card-description">{description}</span>
        <span className="card-price">{`${price} ₪`}</span>
      </div>
    </div>
  );
};

export default Card;
