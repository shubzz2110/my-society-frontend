// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      'postcss-import': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: "My Society Manager",
      meta: [
        {
          name: "description",
          content:
            "",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: [
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@primevue/nuxt-module",
  ],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  piniaPluginPersistedstate: {
    storage: "localStorage",
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: "http://localhost:5000/api/",
      FB_API_KEY: process.env.FB_API_KEY,
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      FB_PROJECT_ID: process.env.FB_PROJECT_ID,
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      FB_APP_ID: process.env.FB_APP_ID,
    },
  },
  primevue: {
    options: {
      theme: 'none'
    }
  },
  routeRules: {
    "/resident/**": { appMiddleware: ['auth-client', 'role-client'] },
    "/admin/**": { appMiddleware: ['auth-client', 'role-client'] },
    "/security/**": { appMiddleware: ['auth-client', 'role-client'] },
  },

})
