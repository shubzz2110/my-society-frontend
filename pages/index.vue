<template>
  <div></div>
</template>

<script setup lang="ts">
const router = useRouter();
onBeforeMount(() => {
  router.push("/authentication/signin");
});
</script>

<style scoped></style>
