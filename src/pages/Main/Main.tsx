import React, { FC, useState } from "react";
import "./Main.css";
import Card from "../../components/card/Card";

const Main = ({
  dishType,
}: {
  dishType: { image: string; name: string }[];
}) => {
  const [selectType, setSelectType] = useState<keyof typeof list>();

  const list = {
    ראשונות: [
      { title: "string", description: "string", price: 33 },
      { title: "string11", description: "string111", price: 331 },
    ],
  };

  return (
    <div className="c-main-page">
      {selectType ? (
        <div>
          <span className="type-title">{selectType}</span>
          <div className="list-container">
            {list[selectType].map(({ title, description, price }, index) => (
              <Card
                key={index}
                title={title}
                description={description}
                price={price}
              />
            ))}
          </div>
        </div>
      ) : (
        dishType.map((type, index) => (
          <div
            key={index}
            className="c-card-container"
            style={{
              backgroundImage: `url(${type.image})`,
            }}
            onClick={() => setSelectType(type.name as keyof typeof list)}
          >
            <div className="card-dark-background">
              <span>{type.name}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Main;
