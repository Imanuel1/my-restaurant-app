import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Avatar, ListItemAvatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ButtonX from "../../components/buttonCustom/ButtonX";
import "./Order.css";

export default function Order() {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    //request for order of the current user
  }, []);

  const orderDemoData = [0, 1, 2, 3];

  const handleSendToOperation = (value: string) => {
    //request to order => change order status!
  };

  return (
    <div className="c-orders-container">
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {orderDemoData?.length > 0 ? (
          orderDemoData.map((value, index) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <div className="item-container" key={index}>
                <ListItem
                  key={value}
                  secondaryAction={
                    <IconButton edge="end" aria-label="comments">
                      <DeleteIcon />
                    </IconButton>
                  }
                  //   disablePadding
                >
                  {/* <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value)}
                    dense
                  > */}
                  {/* <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon> */}
                  <ListItemText
                    id={labelId}
                    primary={`Line item ${value + 1}`}
                    secondary={
                      //run over description and then over notes it's not empty
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Description
                        </Typography>
                        <span>
                          {
                            " — I'll be in your neighborhood doing errands this…"
                          }
                        </span>
                        <Typography
                          sx={{ display: "block" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Description
                        </Typography>
                        <span>
                          {
                            " — I'll be in your neighborhood doing errands this…"
                          }
                        </span>
                      </React.Fragment>
                    }
                  />
                  {/* </ListItemButton> */}
                  <ListItemAvatar
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                    onClick={(e) => console.log("avatar clicked!", e)}
                    //TODO: send the icon url / data when clicked!
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                      sx={{ cursor: "pointer" }}
                    />
                  </ListItemAvatar>
                </ListItem>
                {orderDemoData.length - 1 !== index ? (
                  <Divider variant="inset" component="li" />
                ) : null}
              </div>
            );
          })
        ) : (
          <span className="no-order-data">{"לא נבחרו מנות להזמנה!"}</span>
        )}
      </List>
      {
        //isOrderSent ? order status : button send order to operate!
        orderDemoData?.length > 0 ? (
          <ButtonX
            text="שליחה לביצוע"
            Icon={{ IconName: SendIcon, isButton: true }}
            onClick={(value: string) => handleSendToOperation(value)}
          />
        ) : null
      }
    </div>
  );
}

//statuses of order: send to kitchen -> in progress -> finished 
// <Stack direction="row" spacing={1}>
