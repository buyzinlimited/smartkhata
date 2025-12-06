<script setup>
import Default from "@/layouts/Default.vue";
import {storeToRefs} from "pinia";
import {onMounted, ref} from "vue";
import currency from "../../utils/currency.js";
import IconPrint from "@/components/icons/IconPrint.vue";
import {useAccountStore} from "@/stores/account.js";

const accountStore = useAccountStore();
const {transactions} = storeToRefs(accountStore);

const selectedDate = ref(new Date().toISOString().split('T')[0]);

const getTransactions = async (page = 1) => {
  await accountStore.getTransactions(
      selectedDate.value,
      page
  );
}

onMounted(() => {
  getTransactions();
})
</script>

<template>
  <Default>
    <section class="py-2">
      <div class="bg-white rounded-xl p-4">
        <div class="flex items-center justify-between border-b border-dashed border-gray-300 py-4">
          <h3 class="font-semibold text-lg">Expenses List</h3>
          <div class="flex items-center gap-2">
            <input type="date" v-model="selectedDate" @change="getTransactions()" class="px-2 py-1 border border-gray-200 focus:border-primary focus:outline-none focus:ring-0 rounded placeholder:text-sm disabled:bg-gray-100 appearance-none">
            <button type="button" class="cursor-pointer">
              <IconPrint class="size-5"/>
            </button>
          </div>
        </div>

        <div class="w-full divide-y divide-dashed divide-gray-200">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Fee</th>
                <th>Reference</th>
                <th>remark</th>
              </tr>
            </thead>
            <template v-if="transactions.data">
              <tbody>
              <tr v-for="(item, index) in transactions.data" :key="index">
                <td>{{item.sender?.name}} </td>
                <td>{{item.type}}</td>
                <td>{{item.amount}}</td>
                <td>{{item.fee ?? 0}}</td>
                <td>{{item.reference}}</td>
                <td>{{item.remark}}</td>
              </tr>
              </tbody>
            </template>

            <template v-else>
              <p class="text-center">Loading...</p>
            </template>
          </table>

          <Pagination
              v-if="transactions.data"
              class="mt-4"
              :total-items="transactions.meta.total"
              :current-page="transactions.meta.current_page"
              :items-per-page="transactions.meta.per_page"
              :pages-to-show="2"
              @page-change="getTransactions"
              visible-always
          />
        </div>
      </div>
    </section>
  </Default>
</template>
