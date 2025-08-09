import { useTranslation } from "react-i18next";
import "./Contact.css";
const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-container">
      <h1>{t("contact.title")}</h1>
      <p>{t("contact.description")}</p>
    </div>
  );
};

export default Contact;
