<template>
  <div class="flex flex-col w-full h-max">
    <div>
      <NuxtLink
        to="/authentication/signin"
        class="mt-10 flex items-center text-brand font-semibold text-sm leading-4 mb-5"
      >
        <i class="pi pi-arrow-left mr-4"></i>
        Go back
      </NuxtLink>
      <h2 class="text-gray-900 tracking-tight font-bold text-2xl">
        Your account is disabled.
      </h2>
      <p class="text-gray-500 text-sm font-normal mt-2.5">
        Got a question? please get in touch with us at contact@mysocietyapp.com
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authentication",
});
</script>

<style scoped></style>
