<template>
  <div class="flex-1 flex-col w-full h-full overflow-hidden">
    <div class="flex flex-col overflow-y-auto space-y-2.5 ">
      <button
        v-for="item in navigationStore.navItems"
        :key="item.id"
        @click="$router.push(item.to)"
        class="drawer-link"
        :class="{
          'bg-brand !text-white hover:!bg-blue-500': isActive(item),
        }"
      >
        <i :class="`${item.icon}`"></i>
        <h1>{{ item.label }}</h1>
      </button>
      <button
        @click="() => userStore.logout()"
        class="drawer-link !text-red-500"
      >
        <i class="pi pi-sign-out"></i>
        <h1>Logout</h1>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const navigationStore = useNavigationStore();
const userStore = useUserStore();
const route = useRoute();
// const { logout } = useAuth();

const isActive = (tab: NavItem) => tab.to === route.path;
</script>

<style scoped>
.drawer-link {
  @apply flex items-center space-x-2.5 px-6 py-3 hover:bg-surface-300 text-surface-800 font-semibold text-sm;
}
</style>
