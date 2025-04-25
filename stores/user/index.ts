import { defineStore } from "pinia";
import { getAuth, signOut, type Auth } from "firebase/auth";
import type { Router } from "vue-router";

export const useUserStore = defineStore(
  "userStore",
  () => {
    const { $api }: any = useNuxtApp();
    const auth: Auth = getAuth();
    const router: Router = useRouter();

    const user = ref<User | null>(null);

    const setUser = (newUser: User) => {
      user.value = newUser;
    };

    const getUser = computed(() => user?.value);
    const getRole = computed(() => user?.value?.role);

    const fetchMe = async () => {
      try {
        const data = await $api.get("/user/me");
        if (data && data.success) {
          user.value = data.user;
          return data.user;
        } else {
          return null;
        }
      } catch (error) {
        signOut(auth);
        console.log(error);
        throw error;
      }
    };

    const logout = () => {
      signOut(auth);
      user.value = null;
      localStorage.clear();
      router.go(0);
    };
    return {
      user,
      getUser,
      getRole,
      setUser,
      logout,
      fetchMe,
    };
  },
  { persist: true }
);
