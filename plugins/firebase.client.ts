import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { VueFire, VueFireAuth } from "vuefire";

export default defineNuxtPlugin((nuxtApp) => {
  // configuring runtime config
  const config = useRuntimeConfig();

  // Firebase config
  const firebaseConfig = {
    apiKey: config.public.FB_API_KEY,
    authDomain: config.public.FB_AUTH_DOMAIN,
    projectId: config.public.FB_PROJECT_ID,
    storageBucket: config.public.FB_STORAGE_BUCKET,
    messagingSenderId: config.public.FB_MESSAGING_SENDER_ID,
    appId: config.public.FB_APP_ID,
  };

  // Initialising firebase application
  const firebaseApp = initializeApp(firebaseConfig);

  // Setting up firebase variables
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  // Adding auth globally
  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.provide("auth", auth);

  // Adding auth db
  nuxtApp.vueApp.provide("db", db);
  nuxtApp.provide("db", db);

  // Initialising vue fire
  nuxtApp.vueApp.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  });
});
