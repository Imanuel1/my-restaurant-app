import React from "react";
import "./MovilimSpiner.css";
export default function MovilimSpiner() {
  return (
    <div className="c-spiner-holder">
      <div className="img-spiner"></div>
      <div className="circle"></div>
      <h6 className="loading-text">...Loading</h6>
    </div>
  );
}