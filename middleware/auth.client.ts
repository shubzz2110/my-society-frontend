import { getCurrentUser } from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const isUserLoggedIn = await getCurrentUser();
  if (!isUserLoggedIn) {
    return navigateTo("/authentication/signin");
  }
});
