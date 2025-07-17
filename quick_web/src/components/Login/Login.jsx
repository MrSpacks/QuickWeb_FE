import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import "./Login.css";

// Функциональный компонент для страницы логина
const Login = () => {
  const { t } = useTranslation(); // Хук для переводов
  const { login, token } = useContext(AuthContext); // Получаем функцию login и токен из AuthContext
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  // Если пользователь уже авторизован, редиректим на /dashboard
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  // Обновляем данные формы при вводе
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Отправляем запрос на /api/login/
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        formData
      );
      login(response.data.token); // Сохраняем токен через AuthContext
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || t("login.error"));
    }
  };

  return (
    <div className="login-container">
      <LanguageSwitcher />
      <h1>{t("login.title")}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t("login.username")}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t("login.password")}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn">
          {t("login.submit")}
        </button>
      </form>
      <p>
        {t("login.noAccount")} <Link to="/register">{t("login.register")}</Link>
      </p>
    </div>
  );
};

export default Login;
