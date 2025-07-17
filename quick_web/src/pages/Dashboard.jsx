import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import LogoutButton from "../components/LogoutButton/LogoutButton";
import "./Dashboard.css";

// Компонент Dashboard
const Dashboard = () => {
  const { t } = useTranslation();
  const { token, logout } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({ total_visits: 0 });
  const [error, setError] = useState(null);

  // Загружаем визитки и статистику при монтировании
  useEffect(() => {
    // Если не авторизован, ничего не загружаем
    if (!token) return;

    const fetchData = async () => {
      try {
        // Запрос на список визиток
        const cardsResponse = await axios.get(
          "http://localhost:8000/api/cards/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setCards(cardsResponse.data);

        // Запрос на статистику
        const statsResponse = await axios.get(
          "http://localhost:8000/api/stats/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setStats(statsResponse.data);
      } catch (error) {
        setError(t("dashboard.error"));
        if (error.response?.status === 401) {
          logout(); // Выходим, если токен недействителен
        }
      }
    };
    fetchData();
  }, [token, t, logout]);

  // Если не авторизован, редиректим на /login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Удаление визитки
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <LanguageSwitcher />
        <LogoutButton />
      </header>
      <h1>{t("dashboard.title")}</h1>
      <div className="stats-section">
        <h2>{t("dashboard.stats")}</h2>
        <p>
          {t("dashboard.totalVisits")}: {stats.total_visits}
        </p>
      </div>
      <div className="cards-section">
        <h2>{t("dashboard.cards")}</h2>
        <button className="btn create-btn">{t("dashboard.createCard")}</button>
        {error && <p className="error">{error}</p>}
        {cards.length === 0 ? (
          <p>{t("dashboard.noCards")}</p>
        ) : (
          <div className="cards-grid">
            {cards.map((card) => (
              <div key={card.id} className="card-item">
                <h3>{card.name}</h3>
                <p>
                  <Link to={`/${card.slug}`}>{t("dashboard.viewCard")}</Link>
                </p>
                <button className="btn edit-btn">{t("dashboard.edit")}</button>
                <button
                  className="btn delete-btn"
                  onClick={() => handleDelete(card.id)}
                >
                  {t("dashboard.delete")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
