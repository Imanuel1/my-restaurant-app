import React, { useContext, useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import "./Payment.css";
import { PaymentApproveButton } from "../../components/animations/ConfettiEmoji/ConfettiEmoji";
import bit from "../../assets/images/bit.png";
import cash from "../../assets/images/payment-cash.png";
import { createOrderHistory } from "../../parse/orderHistory";
import { UserContext } from "../../context/UserContext";
import { getOrders, getOrdersType } from "../../parse/order";

const Payment: React.FC = () => {
  const [value, setValue] = useState<string>("Bit");
  const [orderData, setOrderData] = useState<getOrdersType[] | null>(null);
  const { activeUser } = useContext(UserContext);

  const handlePaymentClick = async () => {
    if (orderData?.[0]) {
      const isHistoryCreated = await createOrderHistory(
        orderData?.[0]?.order?.id,
        value
      );
      console.log("is history created ?? :", isHistoryCreated);

      getCurrentOrder();
    }
  };

  const getCurrentOrder = () => {
    //request for order of the current user
    const userType = activeUser?.attributes?.role || "";
    getOrders(activeUser?.id || "", userType)
      .then((res) => {
        setOrderData(res);
        console.log("res res order:", res);
      })
      .catch((err) => console.error("error while getOrders :", err));
  };

  useEffect(() => {
    getCurrentOrder();
  }, []);

  //TODO: if have no order show -> no order!!
  if (!orderData?.[0]?.order) {
    return <span className="no-order-data">{"לא קיימים הזמנות עבורך!"}</span>;
  }

  return (
    <div className="c-payment-container">
      <h2>{`תשלום עבור הזמנה מס ${orderData?.[0]?.order?.id}`}</h2>
      <div className="payment-option">
        <h2>בחירת תצורת התשלום:</h2>
        <div className="images-holder">
          <img
            src={bit}
            className={value === "Bit" ? "selected" : ""}
            alt="Bit"
            onClick={() => setValue("Bit")}
          />
          <img
            src={cash}
            className={value === "Cash" ? "selected" : ""}
            alt="Cash"
            onClick={() => setValue("Cash")}
          />
        </div>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-form-control-label-placement"
            name="position"
            defaultValue="top"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <FormControlLabel
              value="Bit"
              control={<Radio />}
              label="Bit"
              labelPlacement="top"
            />
            <FormControlLabel
              value="Cash"
              control={<Radio />}
              label="Cash"
              labelPlacement="top"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <PaymentApproveButton
        text="אישור תשלום"
        style={{}}
        onClick={handlePaymentClick}
      />

      {/* TODO: after clicked and got payed - the payment when success the order stored in history!
      next try - not selcetd order  */}
    </div>
  );
};

export default Payment;
