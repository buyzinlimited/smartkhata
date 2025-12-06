<script setup>
import currency from "@/utils/currency.js";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "@/stores/customer.js";

const customerStore = useCustomerStore();
const { statistics } = storeToRefs(customerStore);

const getStatistics = async () => {
  await customerStore.getStatistics();
};

onMounted(() => {
  getStatistics();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl">
    <h2 class="text-gray-700 font-bold">Customers Statistics</h2>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <article class="bg-red-50 w-full flex items-center p-4 rounded">
        <div class="flex-none h-10 w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="bg-red-500 rounded-full text-green-100 p-2 size-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
            />
          </svg>
        </div>
        <div class="block font-semibold text-base ml-2">
          <span class="block font-semibold text-red-700">Total Due</span>
          <h2 v-if="statistics" class="block text-red-700">
            {{ currency(statistics.total_due ?? 0) }}
          </h2>
          <h2 v-else class="block text-red-700">loading...</h2>
        </div>
      </article>

      <article class="bg-red-50 w-full flex items-center p-4 rounded">
        <div class="flex-none h-10 w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="bg-green-500 rounded-full text-green-100 p-2 size-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
            />
          </svg>
        </div>
        <div class="block font-semibold text-base ml-2">
          <span class="block font-semibold text-green-700">Total Payable</span>
          <h2 v-if="statistics" class="block text-green-700">
            {{ currency(statistics.total_payable ?? 0) }}
          </h2>
          <h2 v-else class="block text-green-700">loading...</h2>
        </div>
      </article>

      <article class="bg-red-50 w-full flex items-center p-4 rounded">
        <div class="flex-none h-10 w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="bg-danger rounded-full text-red-100 p-2 size-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
            />
          </svg>
        </div>
        <div class="block font-semibold text-base ml-2">
          <span class="block font-semibold text-red-700">Today Due</span>
          <h2 v-if="statistics" class="block text-red-700">
            {{ currency(statistics.today_due ?? 0) }}
          </h2>
          <h2 v-else class="block text-green-700">loading...</h2>
        </div>
      </article>

      <article class="bg-green-50 w-full flex items-center p-4 rounded">
        <div class="flex-none h-10 w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="bg-green-500 rounded-full text-green-100 p-2 size-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </div>
        <div class="block font-semibold text-base ml-2">
          <span class="block font-semibold text-green-700">Today Payable</span>
          <h2 v-if="statistics" class="block text-green-700">
            {{ currency(statistics.today_payable ?? 0) }}
          </h2>
          <h2 v-else class="block text-green-700">loading...</h2>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped></style>
