<template>
  <div class="bg-white flex items-center justify-between w-full p-2.5 shadow">
    <div class="flex items-center">
      <Button
        @click="showMobileSideBar = true"
        icon="pi pi-bars"
        rounded
        text
        severity="secondary"
      />
      <h1 class="text-brand font-bold text-lg leading-5">
        Silver Park Residency
      </h1>
    </div>

    <div class="flex items-center space-x-2.5">
      <Button icon="pi pi-bell" rounded severity="secondary" />
      <Button icon="pi pi-user" rounded severity="secondary" />
    </div>

    <div
      class="xl:hidden bg-white fixed inset-0 mr-10 shadow-lg transition-all"
      :class="showMobileSideBar ? 'translate-x-0' : '-translate-x-full'"
    >
      <div
        class="flex items-center justify-between w-full h-max p-2.5 border-b border-surface-200"
      >
        <h1 class="text-brand font-bold text-lg leading-5 ml-2.5">
          Silver Park Residency
        </h1>
        <Button
          @click="showMobileSideBar = false"
          icon="pi pi-times"
          rounded
          text
          severity="secondary"
        />
      </div>
      <SideNavbar
        class="pt-5 px-2.5"
        @emitCloseMobileSideNavbar="showMobileSideBar = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "primevue";
import SideNavbar from "./SideNavbar.vue";

const showMobileSideBar = ref<boolean>(false);
</script>

<style scoped></style>
