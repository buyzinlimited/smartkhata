<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const logout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to proceed with logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, logout!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#4513bb",
  });

  if (result.isConfirmed) {
    await authStore.logout();
  }
};
</script>

<template>
  <header
    class="sticky top-0 bg-white flex justify-between items-center px-4 py-4"
  >
    <div class="flex items-center gap-2">
      <a href="/" class="flex items-center">
        <img src="/logo.png" alt="logo" class="h-10 w-auto" />
      </a>
    </div>
    <div class="flex items-center space-x-4">
      <div class="w-8 h-8 ring-2 rounded-full">
        <img
          :src="user.avatar_url"
          :alt="user.name"
          class="w-full cursor-pointer"
        />
      </div>
      <div class="block">
        <h3 class="font-semibold">{{ user.name }}</h3>
        <span class="font-normal text-sm">{{ user.phone }}</span>
      </div>
    </div>
  </header>

  <main class="w-full">
    <!-- content area -->
    <div class="bg-red-50 p-6 min-h-screen">
      <!-- dynamic content -->
      <slot />
    </div>
  </main>
</template>

<style scoped></style>
