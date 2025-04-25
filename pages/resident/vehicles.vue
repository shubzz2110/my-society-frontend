<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col space-y-1.5">
        <h1 class="page-header">My vehicles</h1>
        <p class="page-description">
          Here you can add, edit and remove your vehicle details.
        </p>
      </div>
      <Button
        icon="pi pi-plus"
        class="!w-max"
        label="Add vehicle"
        severity="brand"
        @click="showCreateVehicleModal = true"
      />
    </div>
    <div class="flex items-center justify-between w-full h-max py-7">
      <IconField class="min-w-96">
        <InputIcon class="pi pi-search"></InputIcon>
        <InputText
          v-model="searchQuery"
          type="search"
          placeholder="Search a vehicle..."
        />
      </IconField>
    </div>
    <div class="flex flex-col w-full h-full flex-1 overflow-y-auto">
      <DataTable
        scrollable
        scrollHeight="flex"
        :value="vehicles"
        :lazy="true"
        dataKey="id"
        :loading="loading"
      >
        <Column field="vehicleNumber" header="Vehicle Number">
          <template #body="{ data }">
            <span class="uppercase">{{ data.vehicleNumber }}</span>
          </template>
        </Column>
        <Column field="type" header="Vehicle Type" class="capitalize"></Column>
        <Column
          field="model"
          class="capitalize"
          header="Vehicle Model"
        ></Column>
        <Column field="parkingSlot" header="Parking Slot/Number"></Column>
        <Column field="stickerIssued" header="Sticker issued">
          <template #body="{ data }">
            <span>
              <i
                v-if="data.stickerIssued"
                class="pi pi-check-circle text-green-500"
              ></i>
              <i v-else class="pi pi-times-circle text-red-500"></i>
            </span>
          </template>
        </Column>
        <Column field="addedOn" header="Added on">
          <template #body="{ data }">
            {{ moment(data.createdAt).format("DD MMMM YYYY") }}
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
    <!-- <ResidentFamilyMemberCreateFamilyMemberModal
      v-if="showCreateVehicleModal"
      :showModal="showCreateVehicleModal"
      @closeModal="showCreateVehicleModal = false"
      :fetchMyVehicles="fetchMyVehicles"
    />
    <ResidentFamilyMemberEditFamilyMemberModal
      v-if="showEditFamilyMemberModal"
      :showModal="showEditFamilyMemberModal"
      :vehicle="selectedMember || {}"
      @closeModal="closeEditFamilyMemberModal"
      :fetchMyVehicles="fetchMyVehicles"
    /> -->
    <ResidentVehicleCreateVehicleModal
      v-if="showCreateVehicleModal"
      :show-modal="showCreateVehicleModal"
      :fetch-my-vehicles="fetchMyVehicles"
      @close-modal="showCreateVehicleModal = false"
    />
  </div>
</template>

<script setup lang="ts">
// import moment from "moment";
import moment from "moment";
import type { ButtonProps } from "primevue";
import type { MenuItem } from "primevue/menuitem";

definePageMeta({
  layout: "application",
});

const { $api }: any = useNuxtApp();
const confirm = useConfirm();
const toast = useToast();
const { startLoading, stopLoading } = useLoading();

const showCreateVehicleModal = ref<boolean>(false);
const searchQuery = ref<string>("");
const menuRefs = ref<Record<string, any>>({});
const vehicles = ref<Vehicle[]>([]);
const showEditFamilyMemberModal = ref<boolean>(false);
const selectedMember = ref<Vehicle | null>(null);
const loading = ref<boolean>(false);

const getMenuItems = (vehicle: Vehicle): MenuItem[] => {
  return [
    {
      label: "Options",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => openShowEditFamilyMemberModal(vehicle),
        },
        {
          label: "Remove",
          icon: "pi pi-trash",
          command: () =>
            confirm.require({
              message: "Do you want to delete this record?",
              header: "Danger Zone",
              icon: "pi pi-info-circle",
              rejectLabel: "Cancel",
              rejectProps: {
                label: "Cancel",
                severity: "secondary",
                outlined: true,
              } as ButtonProps,
              acceptProps: {
                label: "Delete",
                severity: "danger",
              } as ButtonProps,
              accept: () => removevVehicle(vehicle),
              reject: () => {
                toast.add({
                  severity: "error",
                  summary: "Rejected",
                  detail: "You have rejected",
                  life: 3000,
                });
              },
            }),
        },
      ],
    },
  ];
};

const setMenuRef = (el: any, id: number) => {
  if (el) menuRefs.value[id] = el;
};

const toggleRowMenu = (event: Event, id: number) => {
  const menu = menuRefs.value[id];
  if (menu) menu.toggle(event);
};

const fetchMyVehicles = async () => {
  try {
    loading.value = true;
    const data = await $api.get("/vehicle/get-my-vehicles");
    vehicles.value = data.vehicles || [];
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const openShowEditFamilyMemberModal = (vehicle: Vehicle) => {
  showEditFamilyMemberModal.value = true;
  selectedMember.value = vehicle;
};

const closeEditFamilyMemberModal = () => {
  showEditFamilyMemberModal.value = false;
  selectedMember.value = null;
};

const removevVehicle = async (vehicle: Vehicle) => {
  try {
    startLoading();
    const data = await $api.delete("/vehicle/delete-vehicle", {
      params: { id: vehicle.id },
    });
    if (data.success) {
      toast.add({
        severity: "success",
        summary: "Removed successfully",
        detail: "Vehicle details removed successfully",
        life: 5000,
      });
      fetchMyVehicles();
    }
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "An Error Occured",
      detail: "Unable to update vehicle",
      life: 5000,
    });
  } finally {
    stopLoading();
  }
};

const searchableMembers = computed(() =>
  vehicles.value.filter((vehicle: Vehicle) =>
    vehicle.vehicleNumber
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
);

onMounted(() => {
  fetchMyVehicles();
});
</script>

<style scoped>
.info {
  @apply flex flex-col space-y-0.5;
}
.value {
  @apply text-surface-800 font-semibold text-base leading-6 capitalize;
}
</style>
