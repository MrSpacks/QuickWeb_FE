import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import LanguageSwitcher from "../LanguageSwitcher";
import LogoutButton from "../LogoutButton";
import Burger from "../Burger/Burger";
import "./Header.css";

const Header = () => {
  const { t } = useTranslation();
  const { token, logout } = useContext(AuthContext);
  const location = useLocation(); // Для определения текущей страницы

  return (
    <header className="landing_header">
      <div className="logo">
        <img src="/img/logo.jpg" alt="EasyWord Logo" />
      </div>
      <Burger className="mobile" />
      <nav className="landing-nav desktop">
        <Link
          className={`nav-link ${
            location.pathname === "/about" ? "active" : ""
          }`}
          to="/about"
        >
          {t("landing.about")}
        </Link>
        <Link
          className={`nav-link ${
            location.pathname === "/contact" ? "active" : ""
          }`}
          to="/contact"
        >
          {t("landing.contact")}
        </Link>
        {!token && (
          <>
            <Link
              className={`nav-link ${
                location.pathname === "/register" ? "active" : ""
              }`}
              to="/register"
            >
              {t("landing.register")}
            </Link>
            <Link
              className={`nav-link ${
                location.pathname === "/login" ? "active" : ""
              }`}
              to="/login"
            >
              {t("landing.login")}
            </Link>
          </>
        )}
      </nav>
      <LanguageSwitcher className="desktop" />
      {token && <LogoutButton className="desktop" onLogout={logout} />}
    </header>
  );
};

export default Header;
