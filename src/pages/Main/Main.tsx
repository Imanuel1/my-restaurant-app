import React, { FC, useState, useEffect } from "react";
import "./Main.css";
import Card from "../../components/card/Card";
import { MenuType, getMenusByType } from "../../parse/menu";
import ButtonX from "../../components/buttonCustom/ButtonX";
import UndoIcon from "@mui/icons-material/Undo";

const Main = ({
  dishType,
}: {
  dishType: { image: string; label: string; value: MenuType }[];
}) => {
  const [selectType, setSelectType] = useState<{
    image: string;
    label: string;
    value: MenuType;
  }>();
  const [menusByType, setMenusByType] = useState<Parse.Object[] | null>(null);

  useEffect(() => {
    if (selectType) {
      //request for menus of the type of topic
      getMenusByType(selectType.value)
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
          <span className="type-title">
            {selectType.label}
            <ButtonX
              Icon={{ IconName: UndoIcon }}
              style={{ margin: "0px 16px" }}
              onClick={() => setSelectType(undefined)}
            />
          </span>
          <div className="list-container">
            {menusByType &&
              menusByType.map(
                (
                  { attributes: { name, description, price, image }, id },
                  index
                ) => (
                  <Card
                    key={index}
                    id={id}
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
            onClick={() => setSelectType(type)}
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
