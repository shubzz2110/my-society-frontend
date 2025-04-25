<template>
  <div class="flex flex-col w-full h-dvh min-h-dvh">
    <div class="xl:hidden">
      <!-- <MobileNavbar /> -->
      <NuxtPage />
    </div>
    <div class="xl:flex w-full h-full flex-1 hidden">
      <div
        class="flex flex-col bg-white xl:min-w-[18rem] xl:max-w-[18rem] w-full h-full shadow"
      >
        <div class="w-full h-max px-20 pt-5 select-none" draggable="false">
          <img src="/logov1.png" class="w-full" alt="logo" draggable="false" />
        </div>
        <Divider />
        <SideNavbar />
      </div>
      <div class="flex flex-col w-full max-w-[calc(100vw-18rem)] h-full p-5">
        <Transition name="fade">
          <Loading v-if="isLoading" />
        </Transition>
        <Toast />
        <ConfirmDialog :draggable="false" />
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isLoading } = useLoading();
</script>

<style>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
