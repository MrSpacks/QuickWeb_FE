import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = (props) => {
  const { i18n } = useTranslation();
  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "cs", name: "Čeština" },
  ];
  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const style = {
    width: "100px",
    height: "36px",
    fontSize: "14px",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
  };
  return (
    <select
      className={`language-switcher ${props.className || ""}`}
      onChange={handleLanguageChange}
      value={i18n.language}
      style={style}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
// CZ: Tento komponent umožňuje uživatelům přepínat mezi jazyky
// RU: Этот компонент позволяет пользователям переключаться между языками
