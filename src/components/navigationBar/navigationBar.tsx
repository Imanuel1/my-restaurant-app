// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { UserContext } from "../../context/UserContext";
// import "./navigationBar.css";

// const NavigationBar: React.FC = () => {
//   //   const { currentUser } = useContext(UserContext);

//   return (
//     <nav>
//       <ul>
//         <li>
//           <Link to="/">About</Link>
//         </li>
//         <li>
//           <Link to="/my-order">My Order</Link>
//         </li>
//         <li>
//           <Link to="/menu">Menu</Link>
//         </li>
//         <li>
//           <Link to="/order-history">Order History</Link>
//         </li>
//         <li>
//           <Link to="/payment">Payment</Link>
//         </li>
//         {/* {currentUser?.role === "client" && (
//           <>
//             <li>
//               <Link to="/my-order">My Order</Link>
//             </li>
//             <li>
//               <Link to="/order-history">Order History</Link>
//             </li>
//           </>
//         )}
//         {currentUser?.role === "worker" && (
//           <>
//             <li>
//               <Link to="/my-order">My Order</Link>
//             </li>
//             <li>
//               <Link to="/order-history">Order History</Link>
//             </li>
//             <li>
//               <Link to="/menu">Menu</Link>
//             </li>
//           </>
//         )}
//         {currentUser?.role === "manager" && (
//           <>
//             <li>
//               <Link to="/my-order">My Order</Link>
//             </li>
//             <li>
//               <Link to="/order-history">Order History</Link>
//             </li>
//             <li>
//               <Link to="/menu">Menu</Link>
//             </li>
//             <li>
//               <Link to="/all-orders">All Orders</Link>
//             </li>
//             <li>
//               <Link to="/reports">Reports</Link>
//             </li>
//           </>
//         )}
//         {!currentUser && (
//           <>
//             <li>
//               <Link to="/login">Login</Link>
//             </li>
//             <li>
//               <Link to="/signup">Signup</Link>
//             </li>
//           </>
//         )} */}
//       </ul>
//     </nav>
//   );
// };

// export default NavigationBar;

import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import { useMediaQuery } from "react-responsive";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./navigationBar.css";

// import "./NavbarMobile.css";
const NavbarHook = ({}) => {
  const { activeUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: "1150px" });
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const renderNavLinks = () => {
    // TODO:
    // currentUser?.role === "manager" && (
    const listClassName = isMobile ? "nav__list" : "nav__list__web";
    const linkClassName = "nav__link";
    const buttonClassName = "nav__cta";
    return (
      <ul className={listClassName}>
        <li>
          <NavLink to="/" className={linkClassName} onClick={closeMobileMenu}>
            ראשי
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            אודות
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-order"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            הזמנות
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/favorite"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            Favorite
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/payment"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            תשלום
          </NavLink>
        </li>
        {activeUser ? (
          <li className="logout-li">
            <NavLink
              to="/logout"
              className={`${linkClassName} ${buttonClassName}`}
              onClick={() => {
                logout();
                navigate("/"); // Replace "/" with your actual home page route
                closeMobileMenu();
              }}
            >
              התנתקות
            </NavLink>
          </li>
        ) : (
          <>
            <li className="login-li">
              <NavLink
                to="/login"
                className={`${linkClassName} ${buttonClassName}`}
                onClick={closeMobileMenu}
              >
                התחברות
              </NavLink>
            </li>
            <li className="signup-li">
              <NavLink
                to="/signup"
                className={`${linkClassName} ${buttonClassName}`}
                onClick={closeMobileMenu}
              >
                הרשמה
              </NavLink>
            </li>
          </>
        )}
      </ul>
    );
  };
  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          NewMew
        </NavLink>
        {isMobile && (
          <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
            <IoMenu color="var(--cb-color-text)" />
          </div>
        )}
        {isMobile ? (
          <div
            className={`nav__menu  ${isMenuOpen ? "show-menu" : ""}`}
            id="nav-menu"
          >
            {renderNavLinks()}
            <div className="nav__close" id="nav-close" onClick={toggleMenu}>
              <IoClose color="var(--cb-color-text)" />
            </div>
          </div>
        ) : (
          renderNavLinks()
        )}
      </nav>
    </header>
  );
};
export default NavbarHook;