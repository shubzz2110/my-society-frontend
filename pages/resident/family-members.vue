<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex items-center justify-between w-full">
      <div class="flex flex-col space-y-1.5">
        <h1 class="page-header">Family Members</h1>
        <p class="page-description">
          Here you can add, edit and remove family members.
        </p>
      </div>
      <Button
        icon="pi pi-plus"
        class="!w-max"
        label="Add family member"
        severity="brand"
        @click="showCreateFamilyMemberModal = true"
      />
    </div>
    <div class="flex items-center justify-between w-full h-max py-7">
      <IconField class="min-w-96">
        <InputIcon class="pi pi-search"></InputIcon>
        <InputText
          v-model="searchQuery"
          type="search"
          placeholder="Search a member..."
        />
      </IconField>
    </div>
    <div class="flex flex-col w-full h-full flex-1 overflow-y-auto">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        <div
          v-for="member in searchableMembers"
          :key="member.id"
          class="flex flex-col bg-surface-0 rounded-md w-full min-h-[422px] max-h-[422px] shadow-md border border-surface-300 overflow-hidden relative"
        >
          <div class="flex items-start justify-center py-5 w-full">
            <div
              class="bg-surface-200 rounded-full min-w-28 min-h-28 h-28 w-28 flex items-center justify-center"
            >
              <i class="pi pi-user text-surface-600 text-3xl"></i>
            </div>
            <button
              @click="(event) => toggleRowMenu(event, member.id)"
              class="text-surface-800 w-max h-max flex items-center justify-center absolute right-5 top-5"
            >
              <i class="pi pi-ellipsis-v"></i>
            </button>
            <Menu
              :ref="(el) => setMenuRef(el, member.id)"
              :id="member.id"
              :model="getMenuItems(member)"
              :popup="true"
            />
          </div>
          <div class="flex flex-col w-full space-y-2.5 px-4.5 pb-4.5">
            <div class="info">
              <h1 class="form-label">Name:</h1>
              <h1 class="value">{{ member.name }}</h1>
            </div>
            <div class="info">
              <h1 class="form-label">Gender:</h1>
              <h1 class="value">{{ member.gender }}</h1>
            </div>
            <div class="info">
              <h1 class="form-label">Relation:</h1>
              <h1 class="value">{{ member.relation }}</h1>
            </div>
            <div class="info">
              <h1 class="form-label">Contact:</h1>
              <h1 class="value">+91 {{ member.contact || "Not provided" }}</h1>
            </div>
            <div class="info">
              <h1 class="form-label">Added on:</h1>
              <h1 class="value">
                {{ moment(member.createdAt).format("DD MMMM YYYY") }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ResidentFamilyMemberCreateFamilyMemberModal
      v-if="showCreateFamilyMemberModal"
      :showModal="showCreateFamilyMemberModal"
      @closeModal="showCreateFamilyMemberModal = false"
      :fetchMembers="fetchMembers"
    />
    <ResidentFamilyMemberEditFamilyMemberModal
      v-if="showEditFamilyMemberModal"
      :showModal="showEditFamilyMemberModal"
      :member="selectedMember || {}"
      @closeModal="closeEditFamilyMemberModal"
      :fetchMembers="fetchMembers"
    />
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import type { ButtonProps } from "primevue";
import type { MenuItem } from "primevue/menuitem";

definePageMeta({
  layout: "application",
});

const { $api }: any = useNuxtApp();
const { startLoading, stopLoading } = useLoading();
const confirm = useConfirm();
const toast = useToast();

const showCreateFamilyMemberModal = ref<boolean>(false);
const searchQuery = ref<string>("");
const menuRefs = ref<Record<string, any>>({});
const members = ref<FamilyMember[]>([]);
const showEditFamilyMemberModal = ref<boolean>(false);
const selectedMember = ref<FamilyMember | null>(null);

const getMenuItems = (member: FamilyMember): MenuItem[] => {
  return [
    {
      label: "Options",
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
          command: () => openShowEditFamilyMemberModal(member),
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
              accept: () => removeFamilyMember(member),
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

const fetchMembers = async () => {
  try {
    startLoading();
    const data = await $api.get("/family-member/get-members");
    members.value = data.members || [];
  } catch (error) {
    console.log(error);
  } finally {
    stopLoading();
  }
};

const openShowEditFamilyMemberModal = (member: FamilyMember) => {
  showEditFamilyMemberModal.value = true;
  selectedMember.value = member;
};

const closeEditFamilyMemberModal = () => {
  showEditFamilyMemberModal.value = false;
  selectedMember.value = null;
};

const removeFamilyMember = async (member: FamilyMember) => {
  try {
    const data = await $api.delete("/family-member/delete-member", {
      params: { id: member.id },
    });
    if (data.success) {
      toast.add({
        severity: "success",
        summary: "Removed successfully",
        detail: "Member removed successfully",
        life: 5000,
      });
      fetchMembers();
    }
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "An Error Occured",
      detail: "Unable to update member",
      life: 5000,
    });
  }
};

const searchableMembers = computed(() =>
  members.value.filter((member: FamilyMember) =>
    member.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

onMounted(() => {
  fetchMembers();
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
