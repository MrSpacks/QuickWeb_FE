import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PublicCard.css";

const PublicCard = () => {
  const { t } = useTranslation();
  const { slug } = useParams(); // получаем slug из URL
  const [card, setCard] = useState(null); // данные карточки
  const [error, setError] = useState(null); // сообщение об ошибке

  useEffect(() => {
    const fetchCard = async () => {
      try {
        console.log("Slug из useParams:", slug);

        // отправляем запрос БЕЗ авторизации (публичная карточка)
        const response = await axios.get(
          // `http://127.0.0.1:8000/api/business-cards/${slug}/`,
          `http://127.0.0.1:8000/${slug}/`,
          {
            headers: {
              Authorization: undefined, // гарантируем отсутствие токена
            },
          }
        );

        console.log("Данные карточки:", response.data);
        setCard(response.data);
      } catch (err) {
        console.error("Ошибка при получении карточки:", err);
        setError(t("publicCard.error")); // локализованное сообщение
      }
    };

    fetchCard();
  }, [slug, t]);

  // если произошла ошибка
  if (error) return <div className="error">{error}</div>;

  // если данные ещё не загружены
  if (!card) return <div>{t("publicCard.loading")}</div>;

  // основной рендер карточки
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

        {card.social_links?.length > 0 && (
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
