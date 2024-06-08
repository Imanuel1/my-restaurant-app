import React from "react";
import "./Payment.css";
import { PaymentApproveButton } from "../../components/animations/ConfettiEmoji/ConfettiEmoji";

const Payment: React.FC = () => {
  return (
    <div className="c-payment-container">
      <h2>{`${"XXX"} תשלום עבור הזמנה מס`}</h2>
      <PaymentApproveButton text="אישור תשלום" style={{}} />

      {/* TODO: after clicked and got payed - the payment when success the order stored in history!
      next try - not selcetd order  */}
    </div>
  );
};

export default Payment;
