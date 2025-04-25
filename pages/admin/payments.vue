<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col space-y-1.5">
        <h1 class="page-header">Maintenance & Payments</h1>
        <p class="page-description">Create maintenance invoices and track payment data here.</p>
      </div>
      <Button
        icon="pi pi-plus"
        class="!w-max"
        label="Create maintenance invoice"
        severity="brand"
      />
    </div>
    
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'application'
})
</script>

<style scoped>

</style>