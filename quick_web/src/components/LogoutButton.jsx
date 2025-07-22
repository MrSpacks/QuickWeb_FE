import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "./Button/Button";

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

  return (
    <Button
      text={t("logout.button")}
      onClick={handleLogout}
      background="#dc3545"
    />
  );
};

export default LogoutButton;
