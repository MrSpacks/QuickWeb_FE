import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicCard.css";

const PublicCard = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/cards/${slug}/`
        );
        setCard(response.data);
      } catch {
        setError(t("publicCard.error"));
      }
    };
    fetchCard();
  }, [slug, t]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!card) {
    return <div>{t("publicCard.loading")}</div>;
  }

  return (
    <div
      className={`public-card-container ${card.template_id}`}
      style={{
        backgroundColor: card.background_color,
        fontFamily: card.font_style,
      }}
    >
      <div className="card-content">
        <h1>{card.title}</h1>
        {card.subtitle && <h2>{card.subtitle}</h2>}
        {card.description && <p className="description">{card.description}</p>}
        <div className="contact-info">
          {card.email && (
            <p>
              <strong>{t("publicCard.email")}</strong>{" "}
              <a href={`mailto:${card.email}`}>{card.email}</a>
            </p>
          )}
          {card.phone && (
            <p>
              <strong>{t("publicCard.phone")}</strong>{" "}
              <a href={`tel:${card.phone}`}>{card.phone}</a>
            </p>
          )}
        </div>
        {card.social_links && card.social_links.length > 0 && (
          <div className="social-links">
            <h3>{t("publicCard.socialLinks")}</h3>
            <div className="social-links-grid">
              {card.social_links.map((link, index) => (
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
      </div>
    </div>
  );
};

export default PublicCard;
