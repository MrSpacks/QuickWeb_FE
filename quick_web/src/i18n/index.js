import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ru from "./ru.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: "en", // Язык по умолчанию
  fallbackLng: "en", // Резервный язык
  interpolation: {
    escapeValue: false, // React сам экранирует
  },
});

export default i18n;
