import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next"; // Хук для доступа к переводам i18next.
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import "./Register.css"; // Стили для формы.

const Register = () => {
  // Получаем функцию t для переводов и объект i18n для управления языком.
  const { t } = useTranslation();

  // Получаем функцию login и токен из AuthContext.
  // login используется для сохранения токена после успешной регистрации.
  // token проверяет, авторизован ли пользователь.
  const { login, token } = useContext(AuthContext);

  // Состояние для хранения данных формы (username, email, password).
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  // Если пользователь уже авторизован (токен есть), перенаправляем на /dashboard.
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  // Обработчик изменения полей формы.
  // Обновляет formData, сохраняя введённые значения.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Обработчик отправки формы.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы.
    try {
      // Отправляем POST-запрос на /api/register/ с данными формы.
      // Бэкенд ожидает { username, email, password } и возвращает { token } при успехе.
      const response = await axios.post(
        "http://localhost:8000/api/register/",
        formData
      );

      // Сохраняем токен через AuthContext (функция login сохраняет его в localStorage).
      login(response.data.token);

      // Очищаем ошибку, если она была.
      setError(null);
    } catch (err) {
      // Если сервер вернул ошибку (например, 400), показываем сообщение.
      // Бэкенд возвращает { error: "Username already exists" } или другой текст.
      setError(err.response?.data?.error || t("register.error"));
    }
  };

  // JSX для рендеринга формы.
  return (
    <div className="dashboard-container">
      <Header />

      <div className="register-container">
        <h1>{t("register.title")}</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("register.username")}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("register.email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("register.password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn">
            {t("register.submit")}
          </button>
        </form>
        {/* Ссылка на страницу логина */}
        <p>
          {t("register.haveAccount")}{" "}
          <Link to="/login">{t("register.login")}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
