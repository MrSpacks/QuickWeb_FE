import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import LanguageSwitcher from "../LanguageSwitcher";
import LogoutButton from "../LogoutButton";
import "./Burger.css";

const Burger = () => {
  const { t } = useTranslation();
  const { token, logout } = useContext(AuthContext);
  const location = useLocation();

  const showMenu = () => {
    const nav = document.querySelector("#nav");
    nav.classList.toggle("active_bar");
    const burger = document.querySelector(".burger-icon");
    burger.classList.toggle("active_bar");
  };

  return (
    <div className="burger">
      <button className="burger-icon mobile" onClick={showMenu}>
        <span className="bar1 bar"></span>
        <span className="bar2 bar"></span>
        <span className="bar3 bar"></span>
      </button>
      <nav id="nav" className="landing-nav-mobile">
        <Link
          className={`nav-link ${
            location.pathname === "/about" ? "active" : ""
          }`}
          to="/"
        >
          {t("landing.home")}
        </Link>
        <Link
          className={`nav-link ${
            location.pathname === "/about" ? "active_bar" : ""
          }`}
          to="/about"
        >
          {t("landing.about")}
        </Link>
        <Link
          className={`nav-link ${
            location.pathname === "/contact" ? "active_bar" : ""
          }`}
          to="/contact"
        >
          {t("landing.contact")}
        </Link>
        {!token && (
          <>
            <Link
              className={`nav-link ${
                location.pathname === "/register" ? "active_bar" : ""
              }`}
              to="/register"
            >
              {t("landing.register")}
            </Link>
            <Link
              className={`nav-link ${
                location.pathname === "/login" ? "active_bar" : ""
              }`}
              to="/login"
            >
              {t("landing.login")}
            </Link>
          </>
        )}

        {token && <LogoutButton className="mobile" onLogout={logout} />}
        <LanguageSwitcher className="mobile" />
      </nav>
    </div>
  );
};

export default Burger;
