<template>
  <div class="flex flex-col w-full h-max">
    <div>
      <h2 class="text-gray-900 tracking-tight font-bold text-2xl mt-10">
        Sign in to your account
      </h2>
      <p class="text-gray-500 text-sm mt-2">
        Not a member?
        <NuxtLink
          to="/authentication/signup"
          class="text-brand font-semibold hover:underline"
          >Sign up now!</NuxtLink
        >
      </p>
    </div>
    <form class="flex flex-col w-full h-max space-y-5 mt-10">
      <div class="flex flex-col space-y-2.5">
        <label for="id-login-email" class="form-label">Email: </label>
        <IconField>
          <InputIcon class="pi pi-envelope" />
          <InputText
            id="id-login-email"
            v-model="email"
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </IconField>
        <span v-if="errors['email']" class="text-error">{{
          errors["email"]
        }}</span>
      </div>
      <div class="flex flex-col space-y-2.5">
        <label for="id-login-password" class="form-label">Password: </label>
        <IconField>
          <InputIcon class="pi pi-lock" />
          <Password
            id="id-login-password"
            v-model="password"
            :toggle-mask="true"
            placeholder="Enter your password"
            :feedback="false"
            :disabled="isLoading"
          >
          </Password>
        </IconField>
        <span v-if="errors['password']" class="text-error">{{
          errors["password"]
        }}</span>
      </div>
      <div class="flex items-center justify-between w-full py-2.5">
        <div class="flex items-center space-x-2.5">
          <Checkbox input-id="login-remember" v-model="remember" binary />
          <label
            for="login-remember"
            class="text-surface-800 text-sm font-normal leading-4"
            >Remember me</label
          >
        </div>
        <NuxtLink
          to="/authentication/forgot-password"
          class="text-brand font-semibold text-sm leading-5"
          >Forgot password?</NuxtLink
        >
      </div>
      <div class="w-full h-max">
        <Button
          severity="brand"
          label="Login"
          :loading="isLoading"
          @click="handleLogin"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from "firebase/auth";
import {
  Button,
  Checkbox,
  IconField,
  InputIcon,
  InputText,
  Password,
} from "primevue";
import type { Router } from "vue-router";
import * as yup from "yup";
import { useUserStore } from "~/stores/user";

definePageMeta({
  layout: "authentication",
  middleware: "login-signup-client",
});

const toast = useToast();
const router: Router = useRouter();
const userStore = useUserStore();
const auth: Auth = getAuth();
const { $api }: any = useNuxtApp();

const email = ref<string>("");
const password = ref<string>("");
const remember = ref<boolean>(false);
const errors = ref<any>({});
const isLoading = ref<boolean>(false);

const formSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const validateField = async (field: any) => {
  try {
    await formSchema.validateAt(field, {
      email: email.value,
      password: password.value,
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
        email: email.value,
        password: password.value,
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

const signinUserInFirebase = async () => {
  try {
    return (await signInWithEmailAndPassword(auth, email.value, password.value))
      ? true
      : false;
  } catch (error: any) {
    console.log(error);
    await signOut(auth);
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      toast.add({
        severity: "error",
        summary: "Invalid credentials",
        detail: "Please provide valid credentials!",
        life: 5000,
      });
    } else if (error.code === "auth/user-not-found") {
      toast.add({
        severity: "error",
        summary: "Not registered",
        detail: "User is not registered. Please sign up!",
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
    return false;
  }
};

const handleLogin = async () => {
  try {
    if (await validateForm()) {
      isLoading.value = true;
      const loggedInFirestore = await signinUserInFirebase();
      if (loggedInFirestore) {
        const data: User | null = await userStore.fetchMe();
        if (data && data.status === "approved") {
          router.push("/resident/dashboard");
        } else if (data && data.status === "pending") {
          signOut(auth);
          router.push("/authentication/pending");
        } else if (data && data.status === "rejected") {
          signOut(auth);
          router.push("/authentication/rejected");
        } else if (data && data.status === "disabled") {
          signOut(auth);
          router.push("/authentication/disabled");
        } else {
          signOut(auth);
          router.push("/authentication/signin");
        }
      } else {
        signOut(auth);
      }
    }
  } catch (error: any) {
    console.log(error);
    signOut(auth);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => email.value,
  () => validateField("email")
);
watch(
  () => password.value,
  () => validateField("password")
);
</script>

<style scoped></style>
