import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// EN translations
import enCommon from '../../public/locales/en/common.json'
import enNav from '../../public/locales/en/nav.json'
import enFooter from '../../public/locales/en/footer.json'
import enHome from '../../public/locales/en/home.json'
import enAuth from '../../public/locales/en/auth.json'
import enAbout from '../../public/locales/en/about.json'

// TH translations
import thCommon from '../../public/locales/th/common.json'
import thNav from '../../public/locales/th/nav.json'
import thFooter from '../../public/locales/th/footer.json'
import thHome from '../../public/locales/th/home.json'
import thAuth from '../../public/locales/th/auth.json'
import thAbout from '../../public/locales/th/about.json'

const resources = {
    en: {
        common: enCommon,
        nav: enNav,
        footer: enFooter,
        home: enHome,
        auth: enAuth,
        about: enAbout,
    },
    th: {
        common: thCommon,
        nav: thNav,
        footer: thFooter,
        home: thHome,
        auth: thAuth,
        about: thAbout,
    },
}

const savedLang = typeof window !== 'undefined' ? window.localStorage.getItem('carethia_lang') : null

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources,
        lng: savedLang === 'th' || savedLang === 'en' ? savedLang : 'en',
        fallbackLng: 'en',
        supportedLngs: ['en', 'th'],
        ns: ['common', 'nav', 'footer', 'home', 'auth', 'about'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
    })
}

export default i18n
