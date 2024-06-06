import React, { FC } from "react";
import "./Main.css";

const Main = ({
  dishType,
}: {
  dishType: { image: string; name: string }[];
}) => {
  return (
    <div className="c-main-page">
      {dishType.map((type, index) => (
        <div
          key={index}
          className="c-card-container"
          style={{
            backgroundImage: `url(${type.image})`,
          }}
        >
          <div className="card-dark-background">
            <span>{type.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Main;
