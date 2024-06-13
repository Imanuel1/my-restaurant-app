import React, { FC, useState, useEffect } from "react";
import "./Main.css";
import Card from "../../components/card/Card";
import { MenuType, getMenusByType } from "../../parse/menu";

const Main = ({
  dishType,
}: {
  dishType: { image: string; label: string; value: MenuType }[];
}) => {
  const [selectType, setSelectType] = useState<MenuType>();
  const [menusByType, setMenusByType] = useState<Parse.Object[] | null>(null);

  useEffect(() => {
    if (selectType) {
      //request for menus of the type of topic
      getMenusByType(selectType)
        .then((res) => {
          console.log("getMenusByType res :", res);
          setMenusByType(res);
        })
        .catch((err) => console.error("error while getMenusByType: ", err));
    }
  }, [selectType]);

  return (
    <div className="c-main-page">
      {selectType ? (
        <div>
          <span className="type-title">{selectType}</span>
          <div className="list-container">
            {menusByType &&
              menusByType.map(
                (
                  { attributes: { name, description, price, image } },
                  index
                ) => (
                  <Card
                    key={index}
                    title={name}
                    description={description}
                    price={price}
                    image={image}
                  />
                )
              )}
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
            onClick={() => setSelectType(type.value)}
          >
            <div className="card-dark-background">
              <span>{type.label}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Main;
