<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col space-y-1.5">
        <h1 class="page-header">Users</h1>
        <p class="page-description">Create modify user data here.</p>
      </div>
      <Button
        icon="pi pi-plus"
        class="!w-max"
        label="Create a user"
        severity="brand"
      />
    </div>
    <div class="flex items-center justify-between w-full h-max py-7">
      <div class="flex items-center space-x-5">
        <IconField class="min-w-80">
          <InputIcon class="pi pi-search"></InputIcon>
          <InputText
            v-model="searchQuery"
            type="search"
            placeholder="Search a user..."
          />
        </IconField>
        <Button
          v-if="!addFilters"
          @click="addFilters = true"
          icon="pi pi-filter"
          label="Add filters"
          severity="secondary"
        />
        <Button
          v-else
          @click="resetFilters"
          icon="pi pi-filter"
          label="Remove filters"
          severity="danger"
        />
      </div>
      <Select
        :options="SelectOption"
        option-label="name"
        option-value="code"
        v-model="sortBy"
        class="min-w-40"
        @change="fetchUsers"
      />
    </div>
    <!-- Filters -->
    <FiltersUserFilter v-model:filters="filters" v-if="addFilters" />
    <div class="flex flex-col w-full h-full flex-1 overflow-hidden">
      <DataTable
        scrollable
        scrollHeight="flex"
        :value="users"
        :lazy="true"
        :paginator="true"
        :totalRecords="totalUsers"
        :rows="pageSize"
        :pageLinkSize="3"
        dataKey="id"
        @page="onPageChange"
        :loading="loading"
      >
        <template #empty>
          <div class="flex items-center justify-center w-full h-full">
            <h1 class="text-sm font-normal text-surface-800 leading-4">
              No Users found
            </h1>
          </div>
        </template>
        <Column class="capitalize" header="Name" field="name"> </Column>
        <Column header="Email" body-class="lowercase" field="email"> </Column>
        <Column header="Phone" field="phone">
          <template #body="{ data }">
            <h1>+91 {{ data.phone }}</h1>
          </template>
        </Column>
        <Column header="Wing" field="wing"></Column>
        <Column header="Flat No." field="flatNumber"></Column>
        <Column class="capitalize" header="Role" field="role"></Column>
        <Column header="Status" field="status" class="capitalize">
          <template #body="{ data }">
            <h1
              :class="[
                { 'text-red-500': data.status === 'rejected' },
                { 'text-yellow-500': data.status === 'disabled' },
                { 'text-green-500': data.status === 'approved' },
              ]"
            >
              {{ data.status }}
            </h1>
          </template>
        </Column>
        <Column field="actions" header="Actions">
          <template #body="{ data }">
            <button
              @click="(event) => toggleRowMenu(event, data.id)"
              class="text-surface-800 w-max h-max flex items-center justify-center"
            >
              <i class="pi pi-ellipsis-v"></i>
            </button>
            <Menu
              :ref="(el) => setMenuRef(el, data.id)"
              :id="data.id"
              :model="getMenuItems(data)"
              :popup="true"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";

definePageMeta({
  layout: "application",
});

const { $api }: any = useNuxtApp();
const { startLoading, stopLoading } = useLoading();
const toast = useToast();

enum SelectCode {
  RECENT = "recent",
  AZ = "az",
  ZA = "za",
}

const SelectOption = ref<SelectOption[]>([
  { name: "Recently added", code: SelectCode.RECENT },
  { name: "A - Z", code: SelectCode.AZ },
  { name: "Z - A", code: SelectCode.ZA },
]);

const sortBy = ref<string>("recent");
const searchQuery = ref<string>("");
const loading = ref<boolean>(false);
const users = ref<ApiUser[]>([]);
const menuRefs = ref<Record<string, any>>({});
const totalUsers = ref<number>(0);
const pageSize = ref<number>(14);
const currentPage = ref<number>(1);
const addFilters = ref<boolean>(false);
const filters = ref({ status: "", role: "", wing: "" });

const setMenuRef = (el: any, id: string) => {
  if (el) menuRefs.value[id] = el;
};

const getMenuItems = (user: ApiUser): MenuItem[] => {
  const isApproved = user.status === "approved";
  return [
    {
      label: "Options",
      items: [
        { label: "Edit", icon: "pi pi-pencil" },
        {
          label: "Disable",
          icon: "pi pi-ban",
          disabled: !isApproved,
          command: () => approveOrRejectUser(user.id, "disabled"),
        },
      ],
    },
    {
      label: "Actions",
      items: [
        {
          label: "Approve",
          icon: "pi pi-check-square",
          disabled: isApproved,
          command: () => approveOrRejectUser(user.id, "approved"),
        },
        {
          label: "Reject",
          icon: "pi pi-times-circle",
          disabled: isApproved,
          command: () => approveOrRejectUser(user.id, "rejected"),
        },
      ],
    },
  ];
};

const toggleRowMenu = (event: Event, id: string) => {
  const menu = menuRefs.value[id];
  if (menu) menu.toggle(event);
};

const hasActiveFilters = computed(() =>
  Object.values(filters.value).some(Boolean)
);

const fetchUsers = async () => {
  try {
    loading.value = true;

    const params: Record<string, any> = {
      limit: pageSize.value,
      offset: Math.ceil(currentPage.value - 1) * pageSize.value,
      sortBy: sortBy.value,
      search: searchQuery.value,
      ...Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => Boolean(value))
      ),
    };

    const data = await $api.get("/user/users", {
      params: params,
    });

    users.value = data.users || [];
    totalUsers.value = data?.totalUsers || 0;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const onPageChange = (data: any) => {
  currentPage.value = data?.page + 1;
  console.log(currentPage.value);
  fetchUsers();
};

const resetFilters = () => {
  addFilters.value = false;
  if (!hasActiveFilters.value) return;
  filters.value.role = "";
  filters.value.status = "";
  filters.value.wing = "";
  fetchUsers();
};

const approveOrRejectUser = async (
  id: number,
  status: "approved" | "rejected" | "disabled"
) => {
  try {
    startLoading();
    const data = await $api.put(
      "/user/update",
      { status: status },
      { params: { id: id } }
    );
    const index = users.value.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.value[index] = data.updatedUser;
    }
    toast.add({
      severity: "success",
      summary: "Status updated",
      detail: `User status has been updated to ${status}`,
      life: 5000,
    });
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "An Error Occured",
      detail: "Unable to user status",
      life: 5000,
    });
  } finally {
    stopLoading();
  }
};

onMounted(() => {
  fetchUsers();
});

let timeout: any = null;
watch(searchQuery, (newValue) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    searchQuery.value = newValue;
    fetchUsers();
  }, 500);
});

watch(filters, () => {
  fetchUsers();
});
</script>

<style scoped></style>
