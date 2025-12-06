<script setup>
import Default from "@/layouts/Default.vue";
import {onMounted, reactive} from "vue";
import {useAccountStore} from "@/stores/account.js";
import {storeToRefs} from "pinia";
import IconPrint from "@/components/icons/IconPrint.vue";
import {useRoute} from "vue-router";
import Swal from "sweetalert2";

const accountStore = useAccountStore();
const { transactions } = storeToRefs(accountStore);
const route = useRoute();

const form = reactive({
  account_id: route.params.id,
  date: new Date().toISOString().slice(0, 10),
});


const getAccountTransactions = async (page = 1) => {
  await accountStore.getAccountTransactions(form, page);
}

const getAccountStatement = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to proceed with downloading the file?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, download it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#4513bb',
  });

  if (result.isConfirmed) {
    await accountStore.getStatement(form);
  }
}

onMounted(() => {
  getAccountTransactions();
})
</script>

<template>
  <Default>
    <main class="px-4">
      <section class="py-2">
        <div class="bg-white rounded-xl px-4 py-2">
          <div class="flex items-center justify-between border-b border-dashed border-gray-300 py-4">
            <div class="flex-grow">
              <h2 class="text-base font-semibold">Account History</h2>
            </div>
            <button type="button" @click="getAccountStatement()"  class="cursor-pointer">
              <IconPrint class="size-5"/>
            </button>
          </div>

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
              :total-items="transactions.meta?.total"
              :current-page="transactions.meta?.current_page"
              :items-per-page="transactions.meta?.per_page"
              :pages-to-show="2"
              @page-change="getAccountTransactions"
              visible-always
          />
        </div>
      </section>
    </main>
  </Default>
</template>
