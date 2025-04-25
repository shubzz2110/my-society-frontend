export const useNavigationStore = defineStore("navigationStore", () => {
  const userStore = useUserStore();
  const currentRole = userStore.getRole ? userStore.getRole : undefined;

  const navItems = computed<NavItem[]>(() => {
    switch (currentRole) {
      case "admin":
        return adminNav;
      case "security":
        return securityNav;
      default:
        return residentNav;
    }
  });

  return {
    navItems,
  };
});
