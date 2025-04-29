<template>
  <Dialog
    :visible="showModal"
    @update:visible="emits('closeModal')"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    class="flex flex-col w-full h-auto min-h-[550px] xl:min-w-[28rem] xl:max-w-[28rem]"
    :draggable="false"
    header="Create Maintenance Invoice"
  >
    <p class="text-surface-500 font-normal text-sm leading-4 mb-8">
      <span class="!text-red-500">*</span>Indicates required fields
    </p>
    <form
      @submit.prevent="handleSubmitCreateMaintenanceInvoiceForm"
      method="post"
      class="flex flex-col w-full h-full space-y-5"
    >
      <div class="flex flex-col space-y-2.5">
        <label for="id-invoice-type" class="form-label"
          >Invoice Type<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-cog" />
          <Select
            id="id-invoice-type"
            :options="invoiceOptions"
            option-label="name"
            option-value="code"
            v-model="invoiceDetails.type"
            placeholder="Select invoice type"
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
        <label for="id-amount-inv" class="form-label"
          >Invoice Amount<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-indian-rupee" />
          <InputNumber
            id="id-amount-inv"
            v-model="invoiceDetails.amount"
            placeholder="Enter invoice amount"
            :disabled="isLoading"
            :invalid="errors['amount'] && errors['amount'] !== ''"
          />
        </IconField>
        <span v-if="errors['amount']" class="text-error">{{
          errors["amount"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-invoice-date" class="form-label"
          >Invoice Date<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-calendar" />
          <DatePicker
            input-id="id-invoice-date"
            v-model="invoiceDetails.date"
            date-format="dd/mm/yy"
            :min-date="new Date()"
            placeholder="Select invoice date"
            :invalid="errors['date'] && errors['date'] !== ''"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['date']" class="text-error">{{
          errors["date"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-invoice-due-date" class="form-label"
          >Invoice Due Date<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-calendar" />
          <DatePicker
            input-id="id-invoice-due-date"
            v-model="invoiceDetails.dueDate"
            date-format="dd/mm/yy"
            :min-date="new Date()"
            placeholder="Select invoice due date"
            :invalid="errors['dueDate'] && errors['dueDate'] !== ''"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['dueDate']" class="text-error">{{
          errors["dueDate"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-invoice-model" class="form-label"
          >Penalty type<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-bolt" />
          <Select
            id="id-invoice-type"
            :options="penaltyOptions"
            option-label="name"
            option-value="code"
            v-model="invoiceDetails.penaltyType"
            placeholder="Select penalty type"
            class="input-select"
            :invalid="errors['penaltyType'] && errors['penaltyType'] !== ''"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['penaltyType']" class="text-error">{{
          errors["penaltyType"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-penalty-val-inv" class="form-label"
          >Penalty value<span class="text-red-500">*</span>:
        </label>
        <IconField>
          <InputIcon class="pi pi-pen-to-square" />
          <InputNumber
            input-id="id-penalty-val-inv"
            v-model="invoiceDetails.penaltyValue"
            placeholder="Enter penalty value"
            :disabled="isLoading"
            :invalid="errors['penaltyValue'] && errors['penaltyValue'] !== ''"
          />
        </IconField>
        <span v-if="errors['penaltyValue']" class="text-error">{{
          errors["penaltyValue"]
        }}</span>
      </div>
      <div class="w-full h-max pt-2.5">
        <Button
          type="submit"
          severity="brand"
          label="Create invoice"
          :loading="isLoading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import * as yup from "yup";
import { InvoiceType, PenaltyType } from "@/types/enums";
import { DatePicker } from "primevue";

const props = defineProps({
  showModal: { type: Boolean, required: true },
  // fetchMyVehicles: { type: Function, required: true },
});

const emits = defineEmits(["closeModal"]);
const { $api }: any = useNuxtApp();
const toast = useToast();

const invoiceDetails = reactive<{
  type: string;
  amount: number | undefined;
  date: Date | undefined;
  dueDate: Date | undefined;
  penaltyType: string;
  penaltyValue: number | undefined;
}>({
  type: "",
  amount: undefined,
  date: undefined,
  dueDate: undefined,
  penaltyType: "",
  penaltyValue: undefined,
});
const errors = ref<Record<string, any>>({});
const isLoading = ref<boolean>(false);

const invoiceOptions: SelectOption[] = [
  { name: "Maintenance", code: InvoiceType.MAINTENANCE },
  { name: "Booking", code: InvoiceType.BOOKING },
];

const penaltyOptions: SelectOption[] = [
  { name: "Fixed", code: PenaltyType.FIXED },
  { name: "Percentage", code: PenaltyType.PERCENTAGE },
];

const formSchema = yup.object({
  type: yup.string().required("Invoice type is required"),
  amount: yup.number().required("Amount is required"),
  date: yup.string().required("Invoice date is required"),
  dueDate: yup.string().required("Due date is required"),
  penaltyType: yup.string().required("Penalty Type is required"),
  penaltyValue: yup.number().required("Penalty Value is required"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      type: invoiceDetails.type,
      amount: invoiceDetails.amount,
      date: invoiceDetails.date,
      dueDate: invoiceDetails.dueDate,
      penaltyType: invoiceDetails.penaltyType,
      penaltyValue: invoiceDetails.penaltyValue,
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
        type: invoiceDetails.type,
        amount: invoiceDetails.amount,
        date: invoiceDetails.date,
        dueDate: invoiceDetails.dueDate,
        penaltyType: invoiceDetails.penaltyType,
        penaltyValue: invoiceDetails.penaltyValue,
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

const handleSubmitCreateMaintenanceInvoiceForm = async () => {
  if (await validateForm()) {
    try {
      isLoading.value = true;
      const data = await $api.post("/invoice/create-invoice", {
        ...invoiceDetails,
      });
      if (data.success) {
        invoiceDetails.type = "";
        invoiceDetails.amount = undefined;
        invoiceDetails.date = undefined;
        invoiceDetails.dueDate = undefined;
        invoiceDetails.penaltyType = "";
        invoiceDetails.penaltyValue = undefined;
        emits("closeModal");
        // props.fetchMyVehicles();
        toast.add({
          severity: "success",
          summary: "Invoice created",
          detail: "Invoice created successfully",
          life: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.add({
        severity: "error",
        summary: "An Error Occured",
        detail: "Unable to create invoice",
        life: 5000,
      });
    } finally {
      isLoading.value = false;
    }
  }
};

watch(
  () => invoiceDetails.type,
  () => validateField("type")
);

watch(
  () => invoiceDetails.amount,
  () => validateField("amount")
);

watch(
  () => invoiceDetails.date,
  () => validateField("date")
);
watch(
  () => invoiceDetails.dueDate,
  () => validateField("dueDate")
);
watch(
  () => invoiceDetails.penaltyType,
  () => validateField("penaltyType")
);
watch(
  () => invoiceDetails.penaltyValue,
  () => validateField("penaltyValue")
);
</script>

<style scoped>
.input-select {
  @apply pl-8 w-full;
}
</style>
