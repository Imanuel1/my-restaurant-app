import React from "react";
import "./About.css";

const About: React.FC = () => {
  return (
    <div className="c-about-container">
      <h1>אודות המסעדה</h1>
      <span>הטעמים והניחוחות של המטבח האיטלקי המסורתי והמודרני</span>
      <h3>אודות המסעדה</h3>
      <span>קניון מול פתח תקווה – מתחם Yes Planet</span>

      <h3>יצירת קשר</h3>
      <span>
        אם יש לך אלרגיה או בקשות מיוחדות, כדאי ליצור קשר עם המסעדה לפני ביצוע
        ההזמנה
      </span>
      <span>מס' טלפון - 97248283000+</span>
    </div>
  );
};

export default About;
