import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// EN translations
import enCommon from '../../public/locales/en/common.json'
import enNav from '../../public/locales/en/nav.json'
import enFooter from '../../public/locales/en/footer.json'

// TH translations
import thCommon from '../../public/locales/th/common.json'
import thNav from '../../public/locales/th/nav.json'
import thFooter from '../../public/locales/th/footer.json'

const resources = {
    en: {
        common: enCommon,
        nav: enNav,
        footer: enFooter,
    },
    th: {
        common: thCommon,
        nav: thNav,
        footer: thFooter,
    },
}

if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        supportedLngs: ['en', 'th'],
        ns: ['common', 'nav', 'footer'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
    })
}

export default i18n
