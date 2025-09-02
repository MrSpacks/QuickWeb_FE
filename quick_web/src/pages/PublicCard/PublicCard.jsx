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
  const [showQr, setShowQr] = useState(false); // состояние для окна QR

  const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${slug}/`);
        setCard({
          ...response.data,
          avatar: response.data.avatar
            ? `${BASE_URL}${response.data.avatar}`
            : null,
          background_image: response.data.background_image
            ? `${BASE_URL}${response.data.background_image}`
            : null,
        });
      } catch (err) {
        console.error(
          "Ошибка:",
          err.response ? err.response.data : err.message
        );
        setError(t("publicCard.error"));
      }
    };
    fetchCard();
  }, [slug, t]);

  if (error) return <div className="error">{error}</div>;
  if (!card) return <div>{t("publicCard.loading")}</div>;

  // ссылка на QR для текущей страницы
  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    currentUrl
  )}&size=250x250`;

  return (
    <div
      className={`public-card-container ${card.template_id}`}
      style={{
        backgroundColor: card.background_color,
        color: card.text_color,
        fontFamily: card.font_style,
      }}
    >
      {card.background_image && (
        <img className="card-bg" src={card.background_image} alt="" />
      )}

      {/* кнопка QR в углу */}
      <button
        className="qr-button"
        onClick={() => setShowQr(true)}
        title="Показать QR-код"
      >
        <img
          className="qr_icon"
          src="/qrcode-scan-svgrepo-com.svg"
          alt="QR Code icon"
        />
      </button>

      <div className="card-content">
        <div className="avatar-container">
          {card.avatar && (
            <img src={card.avatar} alt="Avatar" className="avatar" />
          )}
          <h1>{card.title}</h1>
        </div>
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

      {/* Модальное окно с QR */}
      {showQr && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <button className="qr-close" onClick={() => setShowQr(false)}>
              ✖
            </button>

            <img src={qrUrl} alt="QR Code" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCard;
