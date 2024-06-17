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
import logo from "../../assets/icons/app-logo.jpeg";
import logo1 from "../../assets/icons/la_academic1.jpeg";
import logo7 from "../../assets/icons/la_academic7.svg";
import { MenuType } from "../../parse/menu";

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
  const translatonUserRole = {
    manager: "מנהל",
    worker: "עובד",
    client: "לקוח",
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
          <NavLink
            to="/about"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            אודות
          </NavLink>
        </li>
        <li>
          <NavLink to="/" className={linkClassName} onClick={closeMobileMenu}>
            ראשי
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-order"
            className={linkClassName}
            onClick={closeMobileMenu}
          >
            {activeUser?.attributes?.role === "manager" ||
            activeUser?.attributes?.role === "worker"
              ? "הזמנות"
              : "הזמנות שלי"}
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
        {!activeUser || activeUser?.attributes?.role === "client" ? (
          <li>
            <NavLink
              to="/payment"
              className={linkClassName}
              onClick={closeMobileMenu}
            >
              תשלום
            </NavLink>
          </li>
        ) : null}
        {activeUser?.attributes?.role === "manager" ||
        activeUser?.attributes?.role === "worker" ? (
          <li>
            <NavLink
              to="/allMenus"
              className={linkClassName}
              onClick={closeMobileMenu}
            >
              תפריטי המסעדה
            </NavLink>
          </li>
        ) : null}
        {activeUser ? (
          <li className="logout-li">
            <span style={{ marginLeft: 7 }}>{`ברוך הבא ${
              translatonUserRole[
                activeUser.attributes?.role as keyof typeof translatonUserRole
              ]
            } ${activeUser.getUsername()}`}</span>
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
          <img
            className="logo-image"
            style={{ width: isMobile ? "20px" : "40px", borderRadius: "3rem" }}
            src={logo7}
            alt="logo"
          />
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
