// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  nitro: {
    output: {
      publicDir: "../backend/public",
    },
    
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/i18n", "@pinia/nuxt"],

  i18n: {
    locales: [
      { code: "en", file: "en.json", dir: "ltr" },
      { code: "fa", file: "fa.json", dir: "rtl" },
    ],
    defaultLocale: "en",
    strategy: "no_prefix", // As per proposal 'depending on URL preferences', let's stick to simplest first
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  routeRules: {
    '/': {appLayout: 'default'},
    '/auth/**': {appLayout: 'default'},
    '/dashboard/**': {appLayout: 'dashboard-aside'},
  },
  css: ['~/assets/css/tailwind.css', '~/assets/css/theme.css', 
    '~/assets/css/transition.css', '~/assets/css/inputs.css',
    '~/assets/css/dialog.css'
  ],
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: 'http://srv.informa.ir:3000'
    }
  },
  devServer: {
    // host: '10.75.52.183'
  }
});