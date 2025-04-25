<template>
  <div class="flex flex-col w-full h-max">
    <div>
      <h2 class="text-gray-900 tracking-tight font-bold text-2xl mt-10">
        Create your account.
      </h2>
      <p class="text-gray-500 text-sm mt-2">
        Already a member?
        <NuxtLink
          to="/authentication/signin"
          class="text-brand font-semibold hover:underline"
          >Sign in</NuxtLink
        >
      </p>
    </div>
    <form class="flex flex-col w-full h-full space-y-5 mt-10">
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-name" class="form-label">Name: </label>
        <IconField>
          <InputIcon class="pi pi-user" />
          <InputText
            id="id-register-name"
            v-model="name"
            placeholder="Enter your full name"
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
        <label for="id-register-email" class="form-label">Email: </label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText
            id="id-register-email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            :disabled="isLoading"
            :invalid="errors['email'] && errors['email'] !== ''"
            maxlength="100"
          />
        </IconField>
        <span v-if="errors['email']" class="text-error">{{
          errors["email"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-mobile" class="form-label"
          >Mobile Number:
        </label>
        <IconField>
          <InputIcon class="pi pi-phone" />
          <InputMask
            id="id-register-mobile"
            v-model="phone"
            mask="9999999999"
            placeholder="Enter your mobile number"
            :disabled="isLoading"
            :invalid="errors['phone'] && errors['phone'] !== ''"
          />
        </IconField>
        <span v-if="errors['phone']" class="text-error">{{
          errors["phone"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-wing" class="form-label">Wing: </label>
        <IconField>
          <InputIcon class="pi pi-building" />
          <InputText
            id="id-register-wing"
            v-model="wing"
            placeholder="Enter your wing"
            :disabled="isLoading"
            :invalid="errors['wing'] && errors['wing'] !== ''"
          />
        </IconField>
        <span v-if="errors['wing']" class="text-error">{{
          errors["wing"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-flat-no" class="form-label"
          >Flat Number:
        </label>
        <IconField>
          <InputIcon class="pi pi-home" />
          <InputNumber
            id="id-register-flat-no"
            v-model="flatNumber"
            placeholder="Enter your flat number"
            :disabled="isLoading"
            :invalid="errors['flatNumber'] && errors['flatNumber'] !== ''"
          />
        </IconField>
        <span v-if="errors['flatNumber']" class="text-error">{{
          errors["flatNumber"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-password" class="form-label">Password: </label>
        <IconField>
          <InputIcon class="pi pi-lock" />
          <Password
            id="id-register-password"
            v-model="password"
            :toggle-mask="true"
            placeholder="Create your password"
            :disabled="isLoading"
            :invalid="errors['password'] && errors['password'] !== ''"
          >
            <template #header>
              <h6 class="text-surface-800 font-semibold text-sm pb-2.5">
                Pick a password
              </h6>
            </template>
            <template #footer>
              <Divider />
              <p class="mt-2.5 text-surface-800 font-semibold text-sm pb-2.5">
                Suggestions
              </p>
              <ul class="pl-2 ml-2 mt-0 list-disc" style="line-height: 1.5">
                <li class="text-sm font-normal text-surface-800">
                  At least one lowercase
                </li>
                <li class="text-sm font-normal text-surface-800">
                  At least one uppercase
                </li>
                <li class="text-sm font-normal text-surface-800">
                  At least one numeric
                </li>
                <li class="text-sm font-normal text-surface-800">
                  Minimum 8 characters
                </li>
              </ul>
            </template>
          </Password>
        </IconField>
        <span v-if="errors['password']" class="text-error">{{
          errors["password"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-register-confirm-password" class="form-label"
          >Confirm Password:
        </label>
        <IconField>
          <InputIcon class="pi pi-lock" />
          <Password
            id="id-register-confirm-password"
            v-model="confirmPassword"
            :toggle-mask="true"
            placeholder="Confirm password"
            :feedback="false"
            :disabled="isLoading"
            :invalid="
              errors['confirmPassword'] && errors['confirmPassword'] !== ''
            "
          >
          </Password>
        </IconField>
        <span v-if="errors['confirmPassword']" class="text-error">{{
          errors["confirmPassword"]
        }}</span>
      </div>
      <div class="w-full h-max pt-5">
        <Button
          severity="brand"
          label="Register"
          :loading="isLoading"
          @click="handleRegisterUser"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signOut,
  type Auth,
} from "firebase/auth";
import {
  IconField,
  InputText,
  InputIcon,
  Password,
  Button,
  InputNumber,
  useToast,
  InputMask,
} from "primevue";
import type { Router } from "vue-router";
import * as yup from "yup";

definePageMeta({
  layout: "authentication",
  middleware: "login-signup-client",
});

const { $api }: any = useNuxtApp();
const auth: Auth = getAuth();
const toast = useToast();
const router: Router = useRouter();

interface UserRegisterData {
  firebaseUID: string;
  name: string;
  email: string;
  phone: string;
  flatNumber: number | undefined;
  wing: string;
}

const name = ref<string>("");
const email = ref<string>("");
const flatNumber = ref<number | undefined>();
const phone = ref<string>("");
const wing = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const errors = ref<any>({});
const isLoading = ref<boolean>(false);

const formSchema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  flatNumber: yup.number().required("Please enter a flat number"),
  phone: yup
    .string()
    .required("Please enter mobile number")
    .matches(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit mobile number"
    ),
  wing: yup.string().required("Please enter wing"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 chars are required")
    .max(15, "Maximum 15 chars are required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      name: name.value,
      email: email.value,
      flatNumber: flatNumber.value,
      wing: wing.value,
      phone: phone.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
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
        name: name.value,
        email: email.value,
        flatNumber: flatNumber.value,
        phone: phone.value,
        wing: wing.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
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

const createUserInFirebase = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;
    return user;
  } catch (error: any) {
    console.log(error);
    if (error.code === "auth/email-already-in-use") {
      toast.add({
        severity: "error",
        summary: "Email already exists",
        detail: "Email already exists, Try different",
        life: 5000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Server error",
        detail: "Something went wrong, Try again",
        life: 5000,
      });
    }
    return null;
  }
};

const createUserInBackend = async (data: UserRegisterData) => {
  try {
    await $api.post("/auth/register", data);
    return true;
  } catch (error) {
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Backend error",
      detail: "Something went wrong, Try again",
      life: 5000,
    });
    return false;
  }
};

const handleRegisterUser = async () => {
  try {
    if (await validateForm()) {
      isLoading.value = true;
      // Creating user in firebase with email and password
      const usercreatedInFirebase = await createUserInFirebase();
      if (usercreatedInFirebase) {
        // Creating payload to be sent in register user API
        const payload: UserRegisterData = {
          firebaseUID: usercreatedInFirebase.uid,
          name: name.value,
          email: email.value,
          flatNumber: flatNumber.value,
          phone: phone.value,
          wing: wing.value,
        };
        const userCreatedInBackend = await createUserInBackend(payload);

        if (userCreatedInBackend) {
          toast.add({
            severity: "success",
            summary: "Signed up successfully",
            detail: "Registration successfull, try login",
            life: 3000,
          });
          signOut(auth);
          router.push("/authentication/signin");
        } else {
          if (auth.currentUser) {
            deleteUser(auth.currentUser);
          }
        }
      }
    }
  } catch (error: any) {
    signOut(auth);
    console.log(error);
    toast.add({
      severity: "error",
      summary: "Server error",
      detail: "Something went wrong, Try again",
      life: 5000,
    });
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => name.value,
  () => validateField("name")
);
watch(
  () => email.value,
  () => validateField("email")
);
watch(
  () => flatNumber.value,
  () => validateField("flatNumber")
);
watch(
  () => phone.value,
  () => validateField("phone")
);
watch(
  () => wing.value,
  () => validateField("wing")
);
watch(
  () => password.value,
  () => validateField("password")
);
watch(
  () => confirmPassword.value,
  () => validateField("confirmPassword")
);
</script>

<style scoped></style>
