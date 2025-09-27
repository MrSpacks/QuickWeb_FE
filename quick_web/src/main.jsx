import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "./context/AuthProvider";
import App from "./App";
import i18n from "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </I18nextProvider>
);
