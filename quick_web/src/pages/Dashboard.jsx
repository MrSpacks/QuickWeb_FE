import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher/LanguageSwitcher";
import LogoutButton from "../components/LogoutButton/LogoutButton";
import "./Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { token, logout } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({ total_visits: 0 });
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    template_id: "default", // Значение по умолчанию
    font_style: "Arial", // Значение по умолчанию
    subtitle: "",
    email: "",
    phone: "",
    background_color: "#FFFFFF",
  });

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

  const handleCreateChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/cards/",
        formData,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setCards([...cards, response.data]);
      setFormData({
        title: "",
        slug: "",
        description: "",
        template_id: "default",
        font_style: "Arial",
        subtitle: "",
        email: "",
        phone: "",
        background_color: "#FFFFFF",
      });
      setShowCreateForm(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || t("dashboard.createError"));
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setError(null);
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
        <button className="btn create-btn" onClick={toggleCreateForm}>
          {t("dashboard.createCard")}
        </button>
        {showCreateForm && (
          <div className="create-form">
            <h3>{t("dashboard.createCard")}</h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>{t("dashboard.titleCard")}</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleCreateChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.slug")}</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.subtitle")}</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.description")}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.email")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.phone")}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleCreateChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.template_id")}</label>
                <select
                  name="template_id"
                  value={formData.template_id}
                  onChange={handleCreateChange}
                  required
                >
                  <option value="default">Default</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t("dashboard.font_style")}</label>
                <select
                  name="font_style"
                  value={formData.font_style}
                  onChange={handleCreateChange}
                  required
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Roboto">Roboto</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t("dashboard.background_color")}</label>
                <input
                  type="color"
                  name="background_color"
                  value={formData.background_color}
                  onChange={handleCreateChange}
                />
              </div>
              <button type="submit" className="btn save-btn">
                {t("dashboard.save")}
              </button>
              <button
                type="button"
                className="btn cancel-btn"
                onClick={toggleCreateForm}
              >
                {t("dashboard.cancel")}
              </button>
            </form>
          </div>
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
