<template>
  <Dialog
    :visible="showModal"
    @update:visible="emits('closeModal')"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="flex flex-col w-full h-auto min-h-[550px] xl:min-w-[28rem] xl:max-w-[28rem]"
    :draggable="false"
    header="Add vehicle"
  >
    <p class="text-surface-500 font-normal text-sm leading-4 mb-8">
      <span class="!text-red-500">*</span>Indicates required fields
    </p>
    <form
      @submit.prevent="handleSubmitAddVehicleForm"
      method="post"
      class="flex flex-col w-full h-full space-y-5"
    >
      <div class="flex flex-col space-y-2.5">
        <label for="id-vehicle-number" class="form-label"
          >Vehicle number<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-car" />
          <InputMask
            id="id-vehicle-number"
            v-model="vehicleDetails.vehicleNumber"
            placeholder="Enter vehicle number"
            :disabled="isLoading"
            :invalid="errors['vehicleNumber'] && errors['vehicleNumber'] !== ''"
            maxlength="40"
            mask="aa-99-aa-9999"
            class="!uppercase placeholder:!capitalize"
          />
        </IconField>
        <span v-if="errors['vehicleNumber']" class="text-error">{{
          errors["vehicleNumber"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-vehicle-type" class="form-label"
          >Vehicle Type<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-cog" />
          <Select
            id="id-vehicle-type"
            :options="vehicleOptions"
            option-label="name"
            option-value="code"
            v-model="vehicleDetails.type"
            placeholder="Select type"
            class="input-select"
            :invalid="errors['type'] && errors['type'] !== ''"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['type']" class="text-error">{{
          errors["type"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-vehicle-model" class="form-label"
          >Model<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-bolt" />
          <InputText
            id="id-vehicle-model"
            v-model="vehicleDetails.model"
            placeholder="Enter vehicle model"
            :disabled="isLoading"
            :invalid="errors['model'] && errors['model'] !== ''"
            maxlength="40"
          />
        </IconField>
        <span v-if="errors['model']" class="text-error">{{
          errors["model"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-parking-slot" class="form-label">Parking Number / Slot: </label>
        <IconField>
          <InputIcon class="pi pi-clipboard" />
          <InputNumber
            id="id-parking-slot"
            v-model="vehicleDetails.parkingSlot"
            placeholder="Enter parking number/slot"
            :disabled="isLoading"
            :invalid="errors['parkingSlot'] && errors['parkingSlot'] !== ''"
          />
        </IconField>
        <span v-if="errors['parkingSlot']" class="text-error">{{
          errors["parkingSlot"]
        }}</span>
      </div>
      <div class="w-full h-max pt-2.5">
        <Button
          type="submit"
          severity="brand"
          label="Add vehicle"
          :loading="isLoading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { VehicleType } from "@/types/enums";

const props = defineProps({
  showModal: { type: Boolean, required: true },
  fetchMyVehicles: { type: Function, required: true },
});

const emits = defineEmits(["closeModal"]);
const { $api }: any = useNuxtApp();
const toast = useToast();

const vehicleDetails = reactive<{
  vehicleNumber: string;
  type: string;
  model: string;
  parkingSlot?: number | undefined;
}>({
  vehicleNumber: "",
  type: "",
  model: "",
  parkingSlot: undefined,
});
const errors = ref<Record<string, any>>({});
const isLoading = ref<boolean>(false);

const vehicleOptions: SelectOption[] = [
  { name: "Car", code: VehicleType.CAR },
  { name: "Bike", code: VehicleType.BIKE },
  { name: "Other", code: VehicleType.OTHER },
];

const formSchema = yup.object({
  vehicleNumber: yup.string().required("Vehicle number is required"),
  type: yup.string().required("Vehicle type required"),
  model: yup.string().required("Vehicle model is required"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      vehicleNumber: vehicleDetails.vehicleNumber,
      type: vehicleDetails.type,
      model: vehicleDetails.model,
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
        vehicleNumber: vehicleDetails.vehicleNumber,
        type: vehicleDetails.type,
        model: vehicleDetails.model,
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

const handleSubmitAddVehicleForm = async () => {
  if (await validateForm()) {
    try {
      isLoading.value = true;
      const data = await $api.post("/vehicle/add-vehicle", {
        ...vehicleDetails,
      });
      if (data.success) {
        vehicleDetails.vehicleNumber = "";
        vehicleDetails.type = "";
        vehicleDetails.model = "";
        vehicleDetails.parkingSlot = undefined;
        emits("closeModal");
        props.fetchMyVehicles();
        toast.add({
          severity: "success",
          summary: "Vehicle added",
          detail: "Vehicle added successfully",
          life: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.add({
        severity: "error",
        summary: "An Error Occured",
        detail: "Unable to add vehicle",
        life: 5000,
      });
    } finally {
      isLoading.value = false;
    }
  }
};

watch(
  () => vehicleDetails.vehicleNumber,
  () => validateField("name")
);

watch(
  () => vehicleDetails.type,
  () => validateField("gender")
);

watch(
  () => vehicleDetails.model,
  () => validateField("relation")
);
</script>

<style scoped>
.input-select {
  @apply pl-8 w-full;
}
</style>
