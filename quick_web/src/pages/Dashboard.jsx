import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button/Button";
import CardForm from "../components/CardForm";
import "./Dashboard.css";

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
        await axios.delete(`http://localhost:8000/api/cards/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setCards(cards.filter((card) => card.id !== id));
      } catch {
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
      setCards([...cards, response.data]);
      setShowCreateForm(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || t("dashboard.createError"));
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/cards/${editCard.id}/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCards(
        cards.map((card) => (card.id === editCard.id ? response.data : card))
      );
      setShowEditForm(false);
      setEditCard(null);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || t("dashboard.editError"));
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setShowEditForm(false);
    setError(null);
  };

  const toggleEditForm = (card) => {
    setEditCard(card);
    setShowEditForm(!showEditForm);
    setShowCreateForm(false);
    setError(null);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <LanguageSwitcher />
        <LogoutButton />
      </header>
      <div className="cards-section">
        <h2>{t("dashboard.cards")}</h2>
        <Button
          text={t("dashboard.createCard")}
          onClick={toggleCreateForm}
          background="#28a745"
        />
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
                <h3>{card.title}</h3>
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
