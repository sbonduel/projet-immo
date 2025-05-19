import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      welcome: "Bienvenue",
      login: "Connexion",
      logout: "Déconnexion",
      signup: "Inscription"
    },
  },
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      logout: "Logout",
      signup: "Signup"
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      signup: "Registrarse"
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "fr",
  fallbackLng: "fr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
