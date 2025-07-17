import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Компонент кнопки выхода
const LogoutButton = () => {
  const { t } = useTranslation(); // Хук для переводов
  const { logout } = useContext(AuthContext); // Получаем функцию logout из AuthContext
  const navigate = useNavigate(); // Хук для перенаправления

  // Обработчик нажатия на кнопку
  const handleLogout = () => {
    logout(); // Удаляем токен из localStorage и сбрасываем состояние
    navigate("/login"); // Редиректим на страницу логина
  };

  const style = {
    padding: "10px 20px",
    backgroundColor: "#dc3545", // Красный цвет для кнопки выхода
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  };
  return (
    <button className="logout-btn" onClick={handleLogout} style={style}>
      {t("logout.button")}
    </button>
  );
};

export default LogoutButton;
