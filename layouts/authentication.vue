<template>
  <div class="contents">
    <div class="flex flex-col min-h-dvh w-full">
      <div class="flex-1 min-h-full flex">
        <div
          class="px-6 xl:px-24 xl:flex-none py-12 flex flex-col justify-center flex-1"
        >
          <div class="xl:w-96 xl:max-w-sm w-full mx-auto">
            <nuxt-link to="/authentication/signin"
              ><img src="/logov1.png" alt="logo" class="w-auto h-20"
            /></nuxt-link>
            <NuxtPage />
          </div>
        </div>
        <div class="hidden flex-1 w-0 relative xl:block">
          <img
            src="/bg1.jpg"
            loading="lazy"
            alt="s"
            class="object-cover w-full h-full inset-0 absolute max-w-full brightness-50 select-none"
            draggable="false"
          />
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { Toast } from "primevue";
</script>

<style scoped></style>
