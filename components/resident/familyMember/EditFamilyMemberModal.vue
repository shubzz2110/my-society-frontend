<template>
  <Dialog
    :visible="showModal"
    @update:visible="emits('closeModal')"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="flex flex-col w-full h-auto min-h-[580px] xl:min-w-[28rem] xl:max-w-[28rem]"
    :draggable="false"
    header="Edit member details"
  >
    <p class="text-surface-500 font-normal text-sm leading-4 mb-8">
      <span class="!text-red-500">*</span>Indicates required fields
    </p>
    <form
      @submit.prevent="handleSubmitEditMemberForm"
      method="post"
      class="flex flex-col w-full h-full space-y-5"
    >
      <div class="flex flex-col space-y-2.5">
        <label for="id-member-name" class="form-label"
          >Name<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="id-member-name"
            v-model="memberDetails.name"
            placeholder="Enter member full name"
            :disabled="isLoading"
            :invalid="errors['name'] && errors['name'] !== ''"
            maxlength="40"
          />
        </IconField>
        <span v-if="errors['name']" class="text-error">{{
          errors["name"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-member-gender" class="form-label"
          >Gender<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-venus" />
          <Select
            id="id-member-gender"
            :options="genders"
            option-label="name"
            option-value="code"
            v-model="memberDetails.gender"
            placeholder="Select gender"
            class="input-select"
            :invalid="errors['gender'] && errors['gender'] !== ''"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['gender']" class="text-error">{{
          errors["gender"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-member-relation" class="form-label"
          >Relation<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-user-plus" />
          <Select
            id="id-member-relation"
            :options="relations"
            option-label="name"
            option-value="code"
            v-model="memberDetails.relation"
            placeholder="Select relation with resident"
            class="input-select"
            :invalid="errors['relation'] && errors['relation'] !== ''"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['relation']" class="text-error">{{
          errors["relation"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-member-contact" class="form-label">Contact: </label>
        <IconField>
          <InputIcon class="pi pi-phone" />
          <InputMask
            id="member-contact"
            v-model="memberDetails.contact"
            mask="9999999999"
            placeholder="Enter member contact number"
            :disabled="isLoading"
            :invalid="errors['contact'] && errors['contact'] !== ''"
          />
        </IconField>
        <span v-if="errors['contact']" class="text-error">{{
          errors["contact"]
        }}</span>
      </div>
      <div class="flex flex-col items-start space-y-2.5 w-max">
        <label class="form-label">Photo</label>
        <div class="flex items-center space-x-2.5">
          <FileUpload
            ref="fileRequired"
            mode="basic"
            chooseLabel="Upload Photo"
            accept="image/*, application/pdf"
            customUpload
            :chooseIcon="'pi pi-upload text-sm'"
            auto
            :disabled="isLoading"
          />
        </div>
      </div>
      <div class="w-full h-max pt-2.5">
        <Button
          type="submit"
          severity="brand"
          label="Update member"
          :loading="isLoading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { Gender, Relation } from "@/types/enums";
import * as yup from "yup";

const props = defineProps({
  showModal: { type: Boolean, required: true },
  fetchMembers: { type: Function, required: true },
  member: { type: Object, required: true },
});

const emits = defineEmits(["closeModal"]);
const { $api }: any = useNuxtApp();
const toast = useToast();

const memberDetails = reactive<{
  name: string;
  gender: string;
  relation: string;
  contact?: string;
  photoUrl?: string;
}>({
  name: props.member.name,
  gender: props.member.gender,
  relation: props.member.relation,
  contact: props.member.contact || "",
  photoUrl: props.member.photoUrl || "",
});
const errors = ref<Record<string, any>>({});
const isLoading = ref<boolean>(false);
const genders: SelectOption[] = [
  { name: "Male", code: Gender.MALE },
  { name: "Female", code: Gender.FEMALE },
  { name: "Other", code: Gender.OTHER },
];
const relations: SelectOption[] = [
  { name: "Spouse", code: Relation.SPOUSE },
  { name: "Child", code: Relation.CHILD },
  { name: "Parent", code: Relation.PARENT },
  { name: "Brother", code: Relation.BROTHER },
  { name: "Other", code: Relation.OTHER },
];

const formSchema = yup.object({
  name: yup.string().required("Member name is required"),
  gender: yup.string().required("Gender is required"),
  relation: yup.string().required("Relation is required"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      name: memberDetails.name,
      gender: memberDetails.gender,
      relation: memberDetails.relation,
    });
    delete errors.value[field];
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      errors.value[field] = error.message;
    }
  }
};

const validateForm = async () => {
  try {
    await formSchema.validate(
      {
        name: memberDetails.name,
        gender: memberDetails.gender,
        relation: memberDetails.relation,
      },
      { abortEarly: false }
    );
    errors.value = {};
    return true;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((error: any) => {
        errors.value[error.path] = error.message;
      });
    }
    return false;
  }
};

const handleSubmitEditMemberForm = async () => {
  if (await validateForm()) {
    try {
      isLoading.value = true;
      console.log(memberDetails);
      const data = await $api.put(
        "/family-member/update-member",
        {
          ...memberDetails,
        },
        { params: { id: props.member.id } }
      );
      if (data.success) {
        memberDetails.name = "";
        memberDetails.contact = "";
        memberDetails.gender = "";
        memberDetails.relation = "";
        memberDetails.photoUrl = "";
        emits("closeModal");
        props.fetchMembers();
        toast.add({
          severity: "success",
          summary: "Updated successfully",
          detail: "Member updated successfully",
          life: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.add({
        severity: "error",
        summary: "An Error Occured",
        detail: "Unable to update member",
        life: 5000,
      });
    } finally {
      isLoading.value = false;
    }
  }
};

watch(
  () => memberDetails.name,
  () => validateField("name")
);

watch(
  () => memberDetails.gender,
  () => validateField("gender")
);

watch(
  () => memberDetails.relation,
  () => validateField("relation")
);
</script>

<style scoped>
.input-select {
  @apply pl-8 w-full;
}
</style>
