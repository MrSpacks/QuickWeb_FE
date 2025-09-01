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
      <ul>
        <li>
          {t("contact.portfolio")}:{" "}
          <a href="https://mrspacks.tode.cz/">myportfolio.com</a>
        </li>
        <li>
          {t("contact.instagram")}:{" "}
          <a href="https://www.instagram.com/mrspacks">@mrspacks</a>
        </li>
        <li>{t("contact.address")}: 123 Main Street, City, Country</li>
        <li>{t("contact.email")}: mr.spacks@seznam.cz</li>
        <li>{t("contact.phone")}: +420 773 947 784</li>
      </ul>
    </div>
  );
};

export default Contact;
