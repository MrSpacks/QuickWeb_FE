import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Импортируем контекст авторизации
import "./LandingPage.css";
import LanguageSwitcher from "../LanguageSwitcher"; // Импортируем компонент переключения языка

const LandingPage = () => {
  const { token } = useContext(AuthContext); // Получаем токен из контекста авторизации
  const { t } = useTranslation(); // Инициализируем перевод с помощью useTranslation

  // Редирект на /dashboard, если пользователь авторизован
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="landing-container">
      <LanguageSwitcher className="language-switcher" />

      <h1>{t("landing.title")}</h1>
      <p>{t("landing.description")}</p>
      <div className="landing-buttons">
        <Link to="/register" className="btn">
          {t("landing.register")}
        </Link>
        <Link to="/login" className="btn">
          {t("landing.login")}
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
