import { useTranslation } from "react-i18next";

import "./About_us.css";
import Header from "../../components/Header/Header";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-container">
      <Header />
      <h1>{t("about.title")}</h1>
      <p>{t("about.description")}</p>
    </div>
  );
};

export default AboutUs;
