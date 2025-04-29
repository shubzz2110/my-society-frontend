<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col space-y-1.5">
        <h1 class="page-header">Payments & Billing</h1>
        <p class="page-description">
          Create maintenance invoices and track payment and billing data here.
        </p>
      </div>
      <Button
        icon="pi pi-plus"
        class="!w-max"
        label="Generate bills"
        severity="brand"
        @click="toggleMenu"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      />
      <Menu ref="menu" :model="menuItems" popup />
    </div>
    <AdminPaymentsCreateMaintenanceInvoiceModal
      v-if="showCreateMaintenanceInvoiceModal"
      :show-modal="showCreateMaintenanceInvoiceModal"
      @closeModal="showCreateMaintenanceInvoiceModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";

definePageMeta({
  layout: "application",
});

const menu = ref();
const menuItems = ref<MenuItem[]>([
  {
    label: "Maintenance",
    icon: "pi pi-money-bill",
    command: () => (showCreateMaintenanceInvoiceModal.value = true),
  },
]);
const showCreateMaintenanceInvoiceModal = ref<boolean>(false);

const toggleMenu = (event: Event) => {
  menu.value.toggle(event);
};
</script>

<style scoped></style>
