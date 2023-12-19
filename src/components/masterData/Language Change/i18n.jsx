import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translations from "./translations.json"; // Import the JSON file

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // Set the resources to the imported JSON data
        resources: translations,

        fallbackLng: "en",
        debug: true,

        // have a common namespace used around the full app
        ns: ["translations"],
        defaultNS: "translations",

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
