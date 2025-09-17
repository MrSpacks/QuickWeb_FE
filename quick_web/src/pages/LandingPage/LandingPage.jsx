import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./LandingPage.css";
import Carousel from "../../components/Carousel/Carousel";
import Header from "../../components/Header/Header";

const LandingPage = () => {
  const { token } = useContext(AuthContext); // Получаем токен из контекста авторизации
  const { t } = useTranslation(); // Инициализируем перевод с помощью useTranslation

  // Редирект на /dashboard, если пользователь авторизован
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="landing-container">
          <Header />

          <h1>{t("landing.title")}</h1>
          <p>{t("landing.description")}</p>
          <div className="landing-buttons"></div>
        </div>
      </div>
      <Carousel className="carousel" />
    </>
  );
};

export default LandingPage;
