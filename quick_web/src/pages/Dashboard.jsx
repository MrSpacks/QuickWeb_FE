import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { token, logout } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({ total_visits: 0 });
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [formData, setFormData] = useState({
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
  const [editFormData, setEditFormData] = useState({
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

  const handleEditClick = (card) => {
    setEditCardId(card.id);
    setEditFormData({
      title: card.title,
      slug: card.slug || "",
      description: card.description || "",
      template_id: card.template_id,
      font_style: card.font_style,
      subtitle: card.subtitle || "",
      email: card.email || "",
      phone: card.phone || "",
      background_color: card.background_color || "#FFFFFF",
    });
    setShowEditForm(true);
    setError(null);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/cards/${editCardId}/`,
        editFormData,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setCards(
        cards.map((card) => (card.id === editCardId ? response.data : card))
      );
      setShowEditForm(false);
      setEditCardId(null);
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

  const toggleEditForm = () => {
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
      <h1>{t("dashboard.title")}</h1>
      <div className="stats-section">
        <h2>{t("dashboard.stats")}</h2>
        <p>
          {t("dashboard.totalVisits")}: {stats.total_visits}
        </p>
      </div>
      <div className="cards-section">
        <h2>{t("dashboard.cards")}</h2>
        <Button
          text={t("dashboard.createCard")}
          onClick={toggleCreateForm}
          background="#28a745"
        />
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
              <Button
                type="submit"
                text={t("dashboard.save")}
                background="#28a745"
              />
              <Button
                text={t("dashboard.cancel")}
                background="#6c757d"
                onClick={toggleCreateForm}
              />
            </form>
          </div>
        )}
        {showEditForm && (
          <div className="create-form">
            <h3>{t("dashboard.editCard")}</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>{t("dashboard.titleCard")}</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.slug")}</label>
                <input
                  type="text"
                  name="slug"
                  value={editFormData.slug}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.subtitle")}</label>
                <input
                  type="text"
                  name="subtitle"
                  value={editFormData.subtitle}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.description")}</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.email")}</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.phone")}</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>{t("dashboard.template_id")}</label>
                <select
                  name="template_id"
                  value={editFormData.template_id}
                  onChange={handleEditChange}
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
                  value={editFormData.font_style}
                  onChange={handleEditChange}
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
                  value={editFormData.background_color}
                  onChange={handleEditChange}
                />
              </div>
              <Button
                type="submit"
                text={t("dashboard.save")}
                background="#28a745"
              />
              <Button
                text={t("dashboard.cancel")}
                background="#6c757d"
                onClick={toggleEditForm}
              />
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
                <Button
                  text={t("dashboard.edit")}
                  onClick={() => handleEditClick(card)}
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
