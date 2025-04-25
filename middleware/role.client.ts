export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();

  if (!userStore.user) {
    await userStore.fetchMe(); // Ensure user is fetched from backend
  }

  const role = userStore.getRole;

  // Defining allowed paths based on roles
  const roleRoutes: Record<string, string> = {
    admin: "/admin",
    resident: "/resident",
    security: "/security",
  };

  const allowedPath = role ? roleRoutes[role] : undefined;

  // If role is invalid or missing, redirect to login
  if (!allowedPath) {
    userStore.logout();
    return navigateTo("/authentication/login");
  }

  // Prevent access to authentication pages
  if (to.fullPath.startsWith("/authentication")) {
    return;
  }

  // Redirect if user is trying to access unauthorized pages
  if (!to.fullPath.startsWith(allowedPath)) {
    return navigateTo(`${allowedPath}/dashboard`);
  }
});
