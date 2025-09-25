// Этот компонент отображает панель управления пользователя с возможностью создания, редактирования и удаления карточек.
// Он использует контекст аутентификации для проверки токена пользователя и взаимодействует с API для управления карточками.

import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import CardForm from "../../components/Card/CardForm";
import Header from "../../components/Header/Header";
import "./Dashboard.css";
import { API_BASE_URL } from "../../../config";

const Dashboard = () => {
  const { t } = useTranslation();
  const { token, logout } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCard, setEditCard] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      {
        /* Получаем список карточек пользователя */
      }
      try {
        const cardsResponse = await axios.get(`${API_BASE_URL}api/cards/`, {
          headers: { Authorization: `Token ${token}` }, // Используем токен для аутентификации
        });
        setCards(cardsResponse.data); // Обновляем состояние карточек
      } catch (error) {
        setError(t("dashboard.error"));
        if (error.response?.status === 401) {
          logout();
        }
      }
    };
    fetchData();
  }, [token, t, logout]);

  if (!token) {
    return <Navigate to="/login" />; // Перенаправляем на страницу входа, если нет токена
  }

  // Функция для удаления карточки
  const handleDelete = async (id) => {
    if (window.confirm(t("dashboard.confirmDelete"))) {
      try {
        const card = cards.find((c) => c.id === id);
        if (!card) throw new Error("Card not found");
        await axios.delete(`${API_BASE_URL}api/cards/${card.slug}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setCards(cards.filter((card) => card.id !== id));
      } catch (err) {
        console.error(
          "Ошибка удаления:",
          err.response ? err.response.data : err.message
        );
        setError(t("dashboard.deleteError"));
      }
    }
  };

  // Функция для создания новой карточки
  const handleCreateSubmit = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}api/cards/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Ответ (create):", response.data);
      setCards([...cards, response.data]);
      setShowCreateForm(false);
      setError(null);
    } catch (error) {
      console.error(
        "Ошибка создания:",
        error.response ? error.response.data : error.message
      );
      setError(error.response?.data?.error || t("dashboard.createError"));
    }
  };

  // Функция для редактирования карточки
  const handleEditSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}api/cards/${editCard.slug}/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Ответ (edit):", response.data);
      setCards(
        cards.map((card) => (card.id === editCard.id ? response.data : card))
      );
      setShowEditForm(false);
      setEditCard(null);
      setError(null);
    } catch (error) {
      console.error(
        "Ошибка редактирования:",
        error.response ? error.response.data : error.message
      );
      setError(error.response?.data?.error || t("dashboard.editError"));
    }
  };
  // Функция для переключения формы создания карточки
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowEditForm(false);
    setError(null);
  };

  // Функция для переключения формы редактирования карточки
  const toggleEditForm = async (card) => {
    if (!card) {
      setEditCard(null);
      setShowEditForm(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}api/cards/${card.slug}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setEditCard(response.data);
      setShowEditForm(true);
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки карточки:", err);
      setError(t("dashboard.loadCardError"));
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <h1>{t("dashboard.cards")}</h1>
        <Button
          text={t("dashboard.createCard")}
          onClick={toggleCreateForm}
          background="#28a745"
        />
      </div>
      <div className="cards-section">
        {showCreateForm && (
          <CardForm
            initialData={{}}
            onSubmit={handleCreateSubmit}
            onCancel={toggleCreateForm}
            isEditing={false}
          />
        )}
        {showEditForm && (
          <CardForm
            initialData={editCard}
            onSubmit={handleEditSubmit}
            onCancel={() => toggleEditForm(null)}
            isEditing={true}
          />
        )}
        {error && <p className="error">{error}</p>}
        {cards.length === 0 ? (
          <p>{t("dashboard.noCards")}</p>
        ) : (
          <div className="cards-grid">
            {cards.map((card) => (
              <div
                key={card.id}
                className="card-item"
                style={{
                  backgroundColor: card.background_color,
                  color: card.text_color,
                  fontFamily: card.font_style,
                }}
              >
                <div className="card_header">
                  <div className="eye_mobile"></div>
                  {card.background_image && (
                    <img
                      className="card_bg_small_card"
                      src={card.background_image}
                      alt={card.title}
                    />
                  )}
                  {card.avatar && (
                    <img
                      src={card.avatar}
                      alt="Avatar"
                      className="avatar_mini"
                    />
                  )}
                  <h3 className="card_title_mini">{card.title}</h3>
                </div>
                <div className="link_wrapper">
                  <Link className="link" to={`/${card.slug}`}>
                    {t("dashboard.viewCard")}
                  </Link>
                </div>
                {card.social_links?.length > 0 && (
                  <div className="social-links">
                    <h3>{t("publicCard.socialLinks")}</h3>
                    <div className="social-links-grid">
                      {card.social_links.slice(0, 2).map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`social-link ${link.platform.toLowerCase()}`}
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div className="button_wrapper">
                  <Button
                    text={t("dashboard.edit")}
                    onClick={() => toggleEditForm(card)}
                    background="#007bff"
                  />
                  <Button
                    text={t("dashboard.delete")}
                    onClick={() => handleDelete(card.id)}
                    background="#dc3545"
                  />
                </div>
                <div className="bottom_line_mobile"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
