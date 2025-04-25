<template>
  <div class="absolute z-50 inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm transition-all duration-500 ease-in-out">
    <div class="lds-dual-ring transition-all duration-500 ease-in-out"></div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

.lds-dual-ring,
.lds-dual-ring:after {
  box-sizing: border-box;
}
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 6.4px solid var(--brand);
  border-color: var(--brand) transparent var(--brand) transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
