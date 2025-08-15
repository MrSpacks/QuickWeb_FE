import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button/Button";
import CardForm from "../components/Card/CardForm";
import "./Dashboard.css";
import "./LandingPage/LandingPage.css";
import Burger from "../components/Burger/Burger";

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
      try {
        const cardsResponse = await axios.get(
          "http://localhost:8000/api/cards/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setCards(cardsResponse.data);
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
    return <Navigate to="/login" />;
  }

  const handleDelete = async (id) => {
    if (window.confirm(t("dashboard.confirmDelete"))) {
      try {
        const card = cards.find((c) => c.id === id);
        if (!card) throw new Error("Card not found");
        await axios.delete(`http://localhost:8000/api/cards/${card.slug}/`, {
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
  const handleCreateSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/cards/",
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
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

  const handleEditSubmit = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/cards/${editCard.slug}/`,
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

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowEditForm(false);
    setError(null);
  };

  const toggleEditForm = async (card) => {
    if (!card) {
      setEditCard(null);
      setShowEditForm(false);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/cards/${card.slug}/`,
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
      <header className="landing_header">
        <div className="logo">
          <img src="/img/logo.jpg" alt="EasyWord Logo" />
        </div>
        <Burger className="mobile" />
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
        <LogoutButton className="desktop" onLogout={logout} />
      </header>
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
              <div key={card.id} className="card-item">
                <div className="card_header">
                  {card.avatar && (
                    <img
                      src={card.avatar}
                      alt="Avatar"
                      className="avatar_mini"
                    />
                  )}
                  <h3>{card.title}</h3>
                </div>
                <p>
                  <Link to={`/${card.slug}`}>{t("dashboard.viewCard")}</Link>
                </p>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
