import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations/en.json";
import vi from "./translations/vi.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if translation is missing
  interpolation: {
    escapeValue: false, // React handles XSS, so escaping is not needed
  },
  keySeparator: ".", // Use dot notation for nested keys (e.g., title.next_gallery)
  nsSeparator: ":", // Namespace separator (optional, not heavily used in your setup)
  debug: process.env.NODE_ENV === "development", // Enable debug in development mode
  react: {
    useSuspense: true, // Enable suspense for React (improves performance)
  },
});

export default i18n;