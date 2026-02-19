export type Language = "en" | "hi" | "zh" | "ru" | "fr" | "de" | "es" | "pt"

export const languages = [
  { code: "en" as Language, name: "English", flag: "🇬🇧" },
  { code: "hi" as Language, name: "हिन्दी", flag: "🇮🇳" },
  { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
  { code: "ru" as Language, name: "Русский", flag: "🇷🇺" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  { code: "pt" as Language, name: "Português", flag: "🇧🇷" },
]

export const translations = {
  en: {
    // Header
    features: "Features",
    pricing: "Pricing",
    download: "Download",
    start: "START",
    language: "Language",

    // Hero
    professionalVpn: "Professional VPN",
    service: "Service",
    fast: "Fast",
    safe: "Safe",
    reliable: "Reliable",
    heroDescription:
      "Fast work with a huge number of servers around the world. Stay private, secure and connected anytime, anywhere.",
    mobile: "Mobile",
    extension: "Extension",
    montiVpnForMobile: "FoxyWall for Mobile",
    availableOnIosAndroid: "Available on iOS and Android",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "FoxyWall Chrome Extension",
    availableForChrome: "Available for Chrome browser",
    downloadExtension: "Download Extension",
    montiVpnForDesktop: "FoxyWall for Desktop",
    comingSoonDesktop: "Coming soon for Windows and macOS",
    comingSoon: "Coming Soon",

    // Features
    trustedByThousands: "TRUSTED BY THOUSANDS",
    feature1: "Total confidentiality of your data and movements on the network",
    feature2: "Unlimited connected devices",
    feature3: "Great selection of regions",
    feature4: "Free regions available",
    feature5: "Resistant to blocking",
    feature6: "Ease of use",
    feature7: "Secure payment options",
    feature8: "Low prices",

    // Pricing
    fairPricing: "FAIR PRICING MODEL",
    pricingDescription: "Choose the plan that works best for you. Simple pricing, no hidden fees.",
    oneMonth: "1 month",
    oneYear: "1 year",
    bestValue: "Best Value",
    save33: "Save 33%",
    getStarted: "Get Started",

    // Footer
    privacyPolicy: "Privacy Policy",
    terms: "Terms",
    allRightsReserved: "All rights reserved.",
  },
  hi: {
    // Header
    features: "विशेषताएं",
    pricing: "मूल्य निर्धारण",
    download: "डाउनलोड",
    start: "शुरू करें",
    language: "भाषा",

    // Hero
    professionalVpn: "प्रोफेशनल VPN",
    service: "सेवा",
    fast: "तेज़",
    safe: "सुरक्षित",
    reliable: "विश्वसनीय",
    heroDescription: "दुनिया भर में बड़ी संख्या में सर्वरों के साथ तेज़ काम। कभी भी, कहीं भी निजी, सुरक्षित और कनेक्टेड रहें।",
    mobile: "मोबाइल",
    extension: "एक्सटेंशन",
    montiVpnForMobile: "मोबाइल के लिए FoxyWall",
    availableOnIosAndroid: "iOS और Android पर उपलब्ध",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "FoxyWall क्रोम एक्सटेंशन",
    availableForChrome: "क्रोम ब्राउज़र के लिए उपलब्ध",
    downloadExtension: "एक्सटेंशन डाउनलोड करें",
    montiVpnForDesktop: "डेस्कटॉप के लिए FoxyWall",
    comingSoonDesktop: "Windows और macOS के लिए जल्द आ रहा है",
    comingSoon: "जल्द आ रहा है",

    // Features
    trustedByThousands: "हजारों लोगों द्वारा विश्वसनीय",
    feature1: "नेटवर्क पर आपके डेटा और गतिविधियों की पूर्ण गोपनीयता",
    feature2: "असीमित कनेक्टेड डिवाइस",
    feature3: "क्षेत्रों का शानदार चयन",
    feature4: "मुफ्त क्षेत्र उपलब्ध",
    feature5: "ब्लॉकिंग के प्रतिरोधी",
    feature6: "उपयोग में आसान",
    feature7: "सुरक्षित भुगतान विकल्प",
    feature8: "कम कीमतें",

    // Pricing
    fairPricing: "उचित मूल्य निर्धारण",
    pricingDescription: "वह प्लान चुनें जो आपके लिए सबसे अच्छा काम करे। सरल मूल्य निर्धारण, कोई छुपी हुई फीस नहीं।",
    oneMonth: "1 महीना",
    oneYear: "1 साल",
    bestValue: "सर्वोत्तम मूल्य",
    save33: "33% बचाएं",
    getStarted: "शुरू करें",

    // Footer
    privacyPolicy: "गोपनीयता नीति",
    terms: "शर्तें",
    allRightsReserved: "सर्वाधिकार सुरक्षित।",
  },
  zh: {
    // Header
    features: "功能",
    pricing: "价格",
    download: "下载",
    start: "开始",
    language: "语言",

    // Hero
    professionalVpn: "专业 VPN",
    service: "服务",
    fast: "快速",
    safe: "安全",
    reliable: "可靠",
    heroDescription: "全球大量服务器快速运行。随时随地保持私密、安全和连接。",
    mobile: "移动端",
    extension: "浏览器扩展",
    montiVpnForMobile: "FoxyWall 移动版",
    availableOnIosAndroid: "适用于 iOS 和 Android",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "FoxyWall Chrome 扩展",
    availableForChrome: "适用于 Chrome 浏览器",
    downloadExtension: "下载扩展",
    montiVpnForDesktop: "FoxyWall 桌面版",
    comingSoonDesktop: "即将推出 Windows 和 macOS 版本",
    comingSoon: "即将推出",

    // Features
    trustedByThousands: "数千人信赖",
    feature1: "您的数据和网络活动完全保密",
    feature2: "无限连接设备",
    feature3: "丰富的地区选择",
    feature4: "提供免费地区",
    feature5: "抗封锁",
    feature6: "易于使用",
    feature7: "安全支付选项",
    feature8: "低价格",

    // Pricing
    fairPricing: "公平定价模式",
    pricingDescription: "选择最适合您的计划。简单定价，无隐藏费用。",
    oneMonth: "1个月",
    oneYear: "1年",
    bestValue: "最佳价值",
    save33: "节省33%",
    getStarted: "立即开始",

    // Footer
    privacyPolicy: "隐私政策",
    terms: "条款",
    allRightsReserved: "版权所有。",
  },
  ru: {
    // Header
    features: "Функции",
    pricing: "Цены",
    download: "Скачать",
    start: "СТАРТ",
    language: "Язык",

    // Hero
    professionalVpn: "Профессиональный VPN",
    service: "Сервис",
    fast: "Быстрый",
    safe: "Безопасный",
    reliable: "Надёжный",
    heroDescription:
      "Быстрая работа с огромным количеством серверов по всему миру. Оставайтесь приватными, защищёнными и подключёнными в любое время.",
    mobile: "Мобильный",
    extension: "Расширение",
    montiVpnForMobile: "FoxyWall для мобильных",
    availableOnIosAndroid: "Доступно для iOS и Android",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "Расширение FoxyWall для Chrome",
    availableForChrome: "Доступно для браузера Chrome",
    downloadExtension: "Скачать расширение",
    montiVpnForDesktop: "FoxyWall для десктопа",
    comingSoonDesktop: "Скоро для Windows и macOS",
    comingSoon: "Скоро",

    // Features
    trustedByThousands: "ДОВЕРЯЮТ ТЫСЯЧИ",
    feature1: "Полная конфиденциальность ваших данных и действий в сети",
    feature2: "Неограниченное количество подключённых устройств",
    feature3: "Большой выбор регионов",
    feature4: "Доступны бесплатные регионы",
    feature5: "Устойчивость к блокировкам",
    feature6: "Простота использования",
    feature7: "Безопасные способы оплаты",
    feature8: "Низкие цены",

    // Pricing
    fairPricing: "ЧЕСТНЫЕ ЦЕНЫ",
    pricingDescription: "Выберите план, который подходит именно вам. Простое ценообразование, без скрытых платежей.",
    oneMonth: "1 месяц",
    oneYear: "1 год",
    bestValue: "Лучшее предложение",
    save33: "Скидка 33%",
    getStarted: "Начать",

    // Footer
    privacyPolicy: "Политика конфиденциальности",
    terms: "Условия",
    allRightsReserved: "Все права защищены.",
  },
  fr: {
    // Header
    features: "Fonctionnalités",
    pricing: "Tarifs",
    download: "Télécharger",
    start: "DÉMARRER",
    language: "Langue",

    // Hero
    professionalVpn: "VPN Professionnel",
    service: "Service",
    fast: "Rapide",
    safe: "Sûr",
    reliable: "Fiable",
    heroDescription:
      "Travail rapide avec un grand nombre de serveurs dans le monde entier. Restez privé, sécurisé et connecté à tout moment.",
    mobile: "Mobile",
    extension: "Extension",
    montiVpnForMobile: "FoxyWall pour Mobile",
    availableOnIosAndroid: "Disponible sur iOS et Android",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "Extension Chrome FoxyWall",
    availableForChrome: "Disponible pour le navigateur Chrome",
    downloadExtension: "Télécharger l'extension",
    montiVpnForDesktop: "FoxyWall pour Bureau",
    comingSoonDesktop: "Bientôt disponible pour Windows et macOS",
    comingSoon: "Bientôt",

    // Features
    trustedByThousands: "APPROUVÉ PAR DES MILLIERS",
    feature1: "Confidentialité totale de vos données et mouvements sur le réseau",
    feature2: "Appareils connectés illimités",
    feature3: "Grande sélection de régions",
    feature4: "Régions gratuites disponibles",
    feature5: "Résistant au blocage",
    feature6: "Facilité d'utilisation",
    feature7: "Options de paiement sécurisées",
    feature8: "Prix bas",

    // Pricing
    fairPricing: "TARIFICATION ÉQUITABLE",
    pricingDescription: "Choisissez le plan qui vous convient le mieux. Tarification simple, sans frais cachés.",
    oneMonth: "1 mois",
    oneYear: "1 an",
    bestValue: "Meilleure offre",
    save33: "Économisez 33%",
    getStarted: "Commencer",

    // Footer
    privacyPolicy: "Politique de confidentialité",
    terms: "Conditions",
    allRightsReserved: "Tous droits réservés.",
  },
  de: {
    // Header
    features: "Funktionen",
    pricing: "Preise",
    download: "Herunterladen",
    start: "STARTEN",
    language: "Sprache",

    // Hero
    professionalVpn: "Professioneller VPN",
    service: "Dienst",
    fast: "Schnell",
    safe: "Sicher",
    reliable: "Zuverlässig",
    heroDescription:
      "Schnelle Arbeit mit einer großen Anzahl von Servern weltweit. Bleiben Sie privat, sicher und jederzeit verbunden.",
    mobile: "Mobil",
    extension: "Erweiterung",
    montiVpnForMobile: "FoxyWall für Mobilgeräte",
    availableOnIosAndroid: "Verfügbar für iOS und Android",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "FoxyWall Chrome-Erweiterung",
    availableForChrome: "Verfügbar für Chrome-Browser",
    downloadExtension: "Erweiterung herunterladen",
    montiVpnForDesktop: "FoxyWall für Desktop",
    comingSoonDesktop: "Bald verfügbar für Windows und macOS",
    comingSoon: "Bald verfügbar",

    // Features
    trustedByThousands: "VON TAUSENDEN VERTRAUT",
    feature1: "Vollständige Vertraulichkeit Ihrer Daten und Bewegungen im Netzwerk",
    feature2: "Unbegrenzte verbundene Geräte",
    feature3: "Große Auswahl an Regionen",
    feature4: "Kostenlose Regionen verfügbar",
    feature5: "Resistent gegen Blockierung",
    feature6: "Einfache Bedienung",
    feature7: "Sichere Zahlungsoptionen",
    feature8: "Niedrige Preise",

    // Pricing
    fairPricing: "FAIRES PREISMODELL",
    pricingDescription:
      "Wählen Sie den Plan, der am besten zu Ihnen passt. Einfache Preisgestaltung, keine versteckten Gebühren.",
    oneMonth: "1 Monat",
    oneYear: "1 Jahr",
    bestValue: "Bestes Angebot",
    save33: "33% sparen",
    getStarted: "Loslegen",

    // Footer
    privacyPolicy: "Datenschutzrichtlinie",
    terms: "AGB",
    allRightsReserved: "Alle Rechte vorbehalten.",
  },
  es: {
    // Header
    features: "Características",
    pricing: "Precios",
    download: "Descargar",
    start: "INICIAR",
    language: "Idioma",

    // Hero
    professionalVpn: "VPN Profesional",
    service: "Servicio",
    fast: "Rápido",
    safe: "Seguro",
    reliable: "Confiable",
    heroDescription:
      "Trabajo rápido con una gran cantidad de servidores en todo el mundo. Mantente privado, seguro y conectado en cualquier momento.",
    mobile: "Móvil",
    extension: "Extensión",
    montiVpnForMobile: "FoxyWall para Móvil",
    availableOnIosAndroid: "Disponible en iOS y Android",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "Extensión Chrome de FoxyWall",
    availableForChrome: "Disponible para el navegador Chrome",
    downloadExtension: "Descargar extensión",
    montiVpnForDesktop: "FoxyWall para Escritorio",
    comingSoonDesktop: "Próximamente para Windows y macOS",
    comingSoon: "Próximamente",

    // Features
    trustedByThousands: "CONFIADO POR MILES",
    feature1: "Confidencialidad total de tus datos y movimientos en la red",
    feature2: "Dispositivos conectados ilimitados",
    feature3: "Gran selección de regiones",
    feature4: "Regiones gratuitas disponibles",
    feature5: "Resistente al bloqueo",
    feature6: "Fácil de usar",
    feature7: "Opciones de pago seguras",
    feature8: "Precios bajos",

    // Pricing
    fairPricing: "MODELO DE PRECIOS JUSTO",
    pricingDescription: "Elige el plan que mejor funcione para ti. Precios simples, sin cargos ocultos.",
    oneMonth: "1 mes",
    oneYear: "1 año",
    bestValue: "Mejor oferta",
    save33: "Ahorra 33%",
    getStarted: "Comenzar",

    // Footer
    privacyPolicy: "Política de privacidad",
    terms: "Términos",
    allRightsReserved: "Todos los derechos reservados.",
  },
  pt: {
    // Header
    features: "Recursos",
    pricing: "Preços",
    download: "Baixar",
    start: "INICIAR",
    language: "Idioma",

    // Hero
    professionalVpn: "VPN Profissional",
    service: "Serviço",
    fast: "Rápido",
    safe: "Seguro",
    reliable: "Confiável",
    heroDescription:
      "Trabalho rápido com um grande número de servidores em todo o mundo. Mantenha-se privado, seguro e conectado a qualquer momento.",
    mobile: "Móvel",
    extension: "Extensão",
    montiVpnForMobile: "FoxyWall para Móvel",
    availableOnIosAndroid: "Disponível no iOS e Android",
    appStore: "App Store",
    googlePlay: "Google Play",
    montiVpnForExtension: "Extensão Chrome FoxyWall",
    availableForChrome: "Disponível para o navegador Chrome",
    downloadExtension: "Baixar extensão",
    montiVpnForDesktop: "FoxyWall para Desktop",
    comingSoonDesktop: "Em breve para Windows e macOS",
    comingSoon: "Em breve",

    // Features
    trustedByThousands: "CONFIADO POR MILHARES",
    feature1: "Confidencialidade total dos seus dados e movimentos na rede",
    feature2: "Dispositivos conectados ilimitados",
    feature3: "Grande seleção de regiões",
    feature4: "Regiões gratuitas disponíveis",
    feature5: "Resistente a bloqueios",
    feature6: "Fácil de usar",
    feature7: "Opções de pagamento seguras",
    feature8: "Preços baixos",

    // Pricing
    fairPricing: "MODELO DE PREÇOS JUSTO",
    pricingDescription: "Escolha o plano que funciona melhor para você. Preços simples, sem taxas ocultas.",
    oneMonth: "1 mês",
    oneYear: "1 ano",
    bestValue: "Melhor oferta",
    save33: "Economize 33%",
    getStarted: "Começar",

    // Footer
    privacyPolicy: "Política de Privacidade",
    terms: "Termos",
    allRightsReserved: "Todos os direitos reservados.",
  },
}

export type TranslationKey = keyof typeof translations.en
