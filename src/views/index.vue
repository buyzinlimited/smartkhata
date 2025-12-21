<script setup>
import Default from "@/layouts/Default.vue";
import { onMounted, reactive, ref } from "vue";
import currency from "../utils/currency.js";
import { useAccountStore } from "@/stores/account.js";
import { storeToRefs } from "pinia";
import CustomersStatistics from "@/components/CustomersStatistics.vue";
import ActionsComponent from "@/components/ActionsComponent.vue";

const accountStore = useAccountStore();
const { accounts, balance, statistics, transactions } = storeToRefs(accountStore);

const getBalance = async () => {
  await accountStore.getBalance();
};

const getStatistics = async () => {
  await accountStore.getStatistics();
};

const selectedDate = ref(new Date().toISOString().split("T")[0]);

const getLatestTransactions = async () => {
  await accountStore.getLatestTransactions(selectedDate.value);
};

const form = reactive({
  account_id: '',
  date: selectedDate.value,
});

const pdfReport = async () => {
  await accountStore.getStatement(form);
};

onMounted(() => {
  getBalance();
  getStatistics();
  getLatestTransactions();
});
</script>

<template>
  <Default>
    <section class="mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-xl">
          <h2 class="block text-gray-700 font-bold">Total Balance</h2>
          <div class="text-3xl font-bold text-green-500">
            <span v-if="balance">{{ currency(balance.balance) }}</span>
            <span v-else>Loading...</span>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <article class="bg-green-50 w-full flex items-center p-4 rounded">
              <div class="flex-none h-10 w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="bg-green-500 rounded-full text-green-100 p-2 size-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
                </svg>
              </div>
              <div class="block font-semibold text-base ml-2">
                <h2 class="block font-semibold text-green-700">Today Income</h2>
                <span v-if="statistics" class="block text-green-700">{{
                  currency(statistics.income)
                }}</span>
                <span v-else class="block text-green-700">Loading...</span>
              </div>
            </article>

            <article class="bg-red-50 w-full flex items-center p-4 rounded">
              <div class="flex-none h-10 w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="bg-red-500 rounded-full text-red-100 p-2 size-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              <div class="block font-semibold text-base ml-2">
                <h2 class="block font-semibold text-red-700">Today Expense</h2>
                <span v-if="statistics" class="block text-red-700">{{
                  currency(statistics.expense)
                }}</span>
                <span v-else class="block text-red-700">Loading...</span>
              </div>
            </article>
          </div>

          <ActionsComponent />
        </div>

        <CustomersStatistics />
      </div>
    </section>

    <!-- Transactions list -->
    <section class="py-2">
      <div class="bg-white rounded-xl p-4">
        <div class="flex items-center justify-between border-b border-dashed border-gray-300 py-4">
          <h3 class="font-semibold text-lg">Latest Transactions</h3>

          <div class="flex items-center gap-2">
            <select v-model="form.account_id" class="bg-white border border-gray-300 px-4 py-1 appearance-auto">
              <option value="" disabled>Select Account</option>
              <option v-for="account in accounts.data" :value="account.id">{{ account.label }}</option>
            </select>
            <button type="button" @click.prevent="pdfReport"
              class="bg-primary text-white px-4 py-1 rounded cursor-pointer">
              Print
            </button>
          </div>

        </div>

        <div class="w-full divide-y divide-dashed divide-gray-200">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Type</th>
                <th>Number</th>
                <th>Fee</th>
                <th>Before</th>
                <th>Amount</th>
                <th>After</th>
                <th>Cash</th>
                <th>Reference</th>
                <th>remark</th>
              </tr>
            </thead>
            <template v-if="transactions.data">
              <tbody>
                <tr v-for="(item, index) in transactions.data" :key="index">
                  <td>{{ item.sender?.name }}</td>
                  <td>
                    <span v-if="item.type === 'deposit'" class="capitalize text-green-500">{{ item.type }}</span>
                    <span v-else-if="item.type === 'withdraw'" class="capitalize text-orange-500">{{ item.type }}</span>
                    <span v-if="item.type === 'exchange'" class="capitalize text-blue-500">{{ item.type }}</span>
                    <span v-if="item.type === 'expense'" class="capitalize text-red-500">{{ item.type }}</span>
                  </td>
                  <td>{{ item.number ?? 'N/A' }}</td>
                  <td>{{ item.fee ?? 0 }}</td>
                  <td>{{ currency(item.before_balance) }}</td>
                  <td>{{ currency(item.amount) }}</td>
                  <td>{{ currency(item.after_balance) }}</td>
                  <td>{{ currency(item.cash) }}</td>
                  <td>{{ item.reference }}</td>
                  <td>{{ item.remark }}</td>
                </tr>
              </tbody>
            </template>

            <template v-else>
              <p class="text-center">Loading...</p>
            </template>
          </table>
        </div>
      </div>
    </section>
  </Default>
</template>

<style scoped></style>
