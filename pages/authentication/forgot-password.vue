<template>
  <div>
    <Button label="pay" severity="success" @click="payWithUPI" />
  </div>
</template>

<script setup lang="ts">
import { Button } from 'primevue';

definePageMeta({
  layout: 'authentication',
  middleware: "login-signup-client"
})

const payWithUPI = () => {
  const upiUrl = `upi://pay?pa=homkar1997@okaxis&pn=SocietyName&am=10&cu=INR&tn=Maintenance Payment`;
  window.location.href = upiUrl; // Opens UPI payment app
}

</script>

<style scoped>

</style>