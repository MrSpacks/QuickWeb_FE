import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./LandingPage.css";
import LanguageSwitcher from "../../components/LanguageSwitcher"; // Импортируем компонент переключения языка

const LandingPage = () => {
  const { token } = useContext(AuthContext); // Получаем токен из контекста авторизации
  const { t } = useTranslation(); // Инициализируем перевод с помощью useTranslation

  // Редирект на /dashboard, если пользователь авторизован
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="landing-container">
      <header className="landing_header">
        <div className="logo">
          <img src="/img/logo.jpg" alt="EasyWord Logo" />
        </div>
        <nav className="landing-nav desktop">
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
        </nav>
        <LanguageSwitcher className="desktop" />
      </header>

      <h1>{t("landing.title")}</h1>
      <p>{t("landing.description")}</p>
      <div className="landing-buttons"></div>
    </div>
  );
};

export default LandingPage;
