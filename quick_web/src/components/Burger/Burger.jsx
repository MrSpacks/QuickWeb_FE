import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
import "./Burger.css"; // Assuming you have a CSS file for styling
import LogoutButton from "../LogoutButton";
const Burger = () => {
  const { t } = useTranslation();

  const showMenu = () => {
    const nav = document.querySelector("#nav");
    nav.classList.toggle("active");

    const burger = document.querySelector(".bar");
    burger.classList.toggle("active");
  };
  return (
    <div className="burger">
      <button className="burger-icon mobile" onClick={showMenu}>
        <span className="bar1 bar"></span>
        <span className="bar2 bar"></span>
        <span className="bar3 bar"></span>
      </button>
      <nav id="nav" className="landing-nav-mobile ">
        <Link className="nav-link" to="/about">
          {t("landing.about")}
        </Link>
        <Link className="nav-link" to="/contact">
          {t("landing.contact")}
        </Link>
        <Link to="/register" className="nav-link ">
          {t("landing.register")}
        </Link>
        <Link to="/login" className="nav-link">
          {t("landing.login")}
        </Link>
        <LanguageSwitcher className="mobile" />
        <LogoutButton className="mobile" />
      </nav>
    </div>
  );
};

export default Burger;
