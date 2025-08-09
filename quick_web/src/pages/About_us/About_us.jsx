import { useTranslation } from "react-i18next";

import "./About_us.css";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="about-container">
      <h1>{t("about.title")}</h1>
      <p>{t("about.description")}</p>
    </div>
  );
};

export default AboutUs;
