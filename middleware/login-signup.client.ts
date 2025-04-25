import { getCurrentUser } from "vuefire";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const currentlyLoggedInUser = await getCurrentUser();
  if (currentlyLoggedInUser) {
    return navigateTo("/resident/dashboard");
  }
});
