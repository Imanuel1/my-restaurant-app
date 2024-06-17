import React, { FC, useState, useEffect } from "react";
import Card from "../../components/card/Card";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Tooltip from "@mui/material/Tooltip";
import { MenuType, deleteMenu, getMenusByType } from "../../parse/menu";
import "./ManageMenus.css";
import EditableCard from "../../components/editableCard/EditableCard";
import ButtonX from "../../components/buttonCustom/ButtonX";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ManageMenus = ({
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
  const [openModalType, setOpenModalType] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllMenusByType = () => {
    if (selectType) {
      //request for menus of the type of topic
      getMenusByType(selectType.value)
        .then((res) => {
          console.log("getMenusByType res :", res);
          setMenusByType(res);
        })
        .catch((err) => console.error("error while getMenusByType: ", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getAllMenusByType();
  }, [selectType]);

  useEffect(() => {
    if (!openModalType) {
      setIsLoading(true);
      getAllMenusByType();
    }
  }, [openModalType]);

  const handleDelete = async () => {
    setIsLoading(true);
    const ids = selectedCards.map((card) => card.id);
    await deleteMenu({ ids, type: selectType?.value });

    getAllMenusByType();
  };

  return (
    <>
      <div className="c-main-page">
        {selectType ? (
          <div>
            <span className="type-title">{selectType.label}</span>
            <span className="crud-buttons">
              <Tooltip title="מחק">
                <ButtonX
                  disabled={!selectedCards?.length}
                  Icon={{ IconName: DeleteForeverIcon }}
                  onClick={() => handleDelete()}
                  //TODO: add swal that show the menus that will be deleted!!!
                />
              </Tooltip>
              <Tooltip title="ערוך">
                <ButtonX
                  disabled={selectedCards?.length > 1 || !selectedCards?.length}
                  Icon={{ IconName: EditIcon }}
                  onClick={() => setOpenModalType("edit")}
                />
              </Tooltip>
              <Tooltip title="הוסף">
                <ButtonX
                  disabled={!!selectedCards?.length}
                  Icon={{ IconName: AddCircleIcon }}
                  onClick={() => setOpenModalType("add")}
                />
              </Tooltip>
            </span>
            <div className="list-container">
              {menusByType &&
                menusByType.map(
                  (
                    { attributes: { name, description, price, image }, id },
                    index
                  ) => (
                    <EditableCard
                      key={index}
                      id={id}
                      title={name}
                      description={description}
                      price={price}
                      image={image}
                      type={selectType.value}
                      setCheckedCard={() =>
                        setSelectedCards((prev) => {
                          const newData = [...prev];
                          const index = newData.findIndex(
                            (item) => item.id === id
                          );
                          //if exist in the selected cards
                          if (index !== -1) {
                            newData.splice(index, 1);
                          } else {
                            newData.push({
                              id,
                              title: name,
                            });
                          }
                          return newData;
                        })
                      }
                      openModalType={openModalType}
                      setOpenModal={() => setOpenModalType(null)}
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

export default ManageMenus;
