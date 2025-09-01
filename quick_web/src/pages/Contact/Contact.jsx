import { useTranslation } from "react-i18next";
import "./Contact.css";
import Header from "../../components/Header/Header";
const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-container">
      <Header />
      <h1>{t("contact.title")}</h1>
      <p>{t("contact.description")}</p>
    </div>
  );
};

export default Contact;
