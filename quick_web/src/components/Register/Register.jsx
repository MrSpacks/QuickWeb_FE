import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next"; // Хук для доступа к переводам i18next.
import { Navigate, Link } from "react-router-dom"; // Navigate для редиректа, Link для ссылок (на /login).
import axios from "axios"; // Библиотека для HTTP-запросов к API.
import { AuthContext } from "../../context/AuthContext";
// import { AuthProvider } from "../../context/AuthProvider";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher"; // Компонент для переключения языка.
import "./Register.css"; // Стили для формы.

// Функциональный компонент Register.
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

  // Состояние для хранения сообщения об ошибке (например, "Username already exists").
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
    <div className="register-container">
      {/* Выпадающий список для смены языка */}
      <LanguageSwitcher />

      {/* Заголовок формы с переводом */}
      <h1>{t("register.title")}</h1>

      {/* Показываем ошибку, если она есть */}
      {error && <p className="error">{error}</p>}

      {/* Форма регистрации */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t("register.username")}</label>
          <input
            type="text"
            name="username" // Имя поля соответствует ключу в formData
            value={formData.username}
            onChange={handleChange}
            required // Обязательное поле
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
  );
};

export default Register;
