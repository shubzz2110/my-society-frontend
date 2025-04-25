<template>
  <div class="pb-7 flex items-center space-x-5 w-full h-max">
    <Select
      :options="statuses"
      option-label="name"
      option-value="code"
      v-model="filters.status"
      class="min-w-60"
      placeholder="Filter by status"
      @update:model-value="(val) => updateFilter('status', val)"
    />
    <Select
      :options="roles"
      option-label="name"
      option-value="code"
      v-model="filters.role"
      class="min-w-60"
      placeholder="Filter by role"
      @update:model-value="(val) => updateFilter('role', val)"
    />
    <Select
      :options="wings"
      option-label="name"
      option-value="code"
      v-model="filters.wing"
      class="min-w-60"
      placeholder="Filter by wing"
      @update:model-value="(val) => updateFilter('wing', val)"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  filters: {
    type: Object,
    required: true,
    default: () => ({
      status: "",
      role: "",
      wing: "",
    }),
  },
});

const emit = defineEmits(["update:filters"]);

enum StatusesOptions {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DISABLED = "disabled",
}

enum RoleOptions {
  RESIDENT = "resident",
  SECURITY = "security",
  ADMIN = "admin",
}

const statuses = ref<SelectOption[]>([
  { name: "Pending", code: StatusesOptions.PENDING },
  { name: "Approved", code: StatusesOptions.APPROVED },
  { name: "Rejected", code: StatusesOptions.REJECTED },
  { name: "Disabled", code: StatusesOptions.DISABLED },
]);

const roles = ref<SelectOption[]>([
  { name: "Resident", code: RoleOptions.RESIDENT },
  { name: "Security", code: RoleOptions.SECURITY },
  { name: "Admin", code: RoleOptions.ADMIN },
]);

const wings = ref<SelectOption[]>([
  { name: "A", code: "A" },
  { name: "B", code: "B" },
]);

const updateFilter = (key: string, value: string) => {
  emit("update:filters", { ...props.filters, [key]: value });
};
</script>

<style scoped></style>
