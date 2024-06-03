import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const NavigationBar: React.FC = () => {
  //   const { currentUser } = useContext(UserContext);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">About</Link>
        </li>
        <li>
          <Link to="/my-order">My Order</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/order-history">Order History</Link>
        </li>
        <li>
          <Link to="/payment">Payment</Link>
        </li>
        {/* {currentUser?.role === "client" && (
          <>
            <li>
              <Link to="/my-order">My Order</Link>
            </li>
            <li>
              <Link to="/order-history">Order History</Link>
            </li>
          </>
        )}
        {currentUser?.role === "worker" && (
          <>
            <li>
              <Link to="/my-order">My Order</Link>
            </li>
            <li>
              <Link to="/order-history">Order History</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
          </>
        )}
        {currentUser?.role === "manager" && (
          <>
            <li>
              <Link to="/my-order">My Order</Link>
            </li>
            <li>
              <Link to="/order-history">Order History</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/all-orders">All Orders</Link>
            </li>
            <li>
              <Link to="/reports">Reports</Link>
            </li>
          </>
        )}
        {!currentUser && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )} */}
      </ul>
    </nav>
  );
};

export default NavigationBar;
