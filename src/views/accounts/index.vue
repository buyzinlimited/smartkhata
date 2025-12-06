<script setup>
import Default from "@/layouts/Default.vue";
import {storeToRefs} from "pinia";
import {onMounted, reactive} from "vue";
import currency from "../../utils/currency.js";
import {useAccountStore} from "@/stores/account.js";
import IconPlus from "@/components/icons/IconPlus.vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import IconLock from "@/components/icons/IconLock.vue";

const accountStore = useAccountStore();
const {accounts, statistics} = storeToRefs(accountStore);

const getAccounts = async () => {
  await accountStore.all();
}

const form = reactive({
  name: '',
  number: '',
  opening_balance: '',
});

const onSubmit = async () => {
  await accountStore.store(form);
  form.name = '';
  form.number = '';
  form.opening_balance = '';
  await getAccounts();
}


const getAccountsStatistics = async () => {
  await accountStore.getStatistics();
}

onMounted(() => {
  getAccountsStatistics();
  getAccounts();
});
</script>

<template>
  <Default>
    <section class="mb-6">
      <div class="bg-white rounded-xl p-4">
        <div class="grid grid-cols-4 gap-4">
          <article class="bg-green-50 w-full flex items-center p-4 rounded">
            <div class="flex-none h-10 w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="bg-green-500 rounded-full text-green-100 p-2 size-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
              </svg>
            </div>
            <div class="block font-semibold text-base ml-2">
              <h2 class="block font-semibold text-green-700">Today Deposit</h2>
              <span v-if="statistics.deposit" class="block text-green-700">{{currency(statistics.deposit)}}</span>
              <span v-else class="block text-green-700">Loading...</span>
            </div>
          </article>

          <article class="bg-red-50 w-full flex items-center p-4 rounded">
            <div class="flex-none h-10 w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="bg-red-500 rounded-full text-red-100 p-2 size-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <div class="block font-semibold text-base ml-2">
              <h2 class="block font-semibold text-red-700">Today Withdraw</h2>
              <span v-if="statistics.withdraw" class="block text-red-700">{{currency(statistics.withdraw)}}</span>
              <span v-else class="block text-red-700">Loading...</span>
            </div>
          </article>
          <article class="bg-green-50 w-full flex items-center p-4 rounded">
            <div class="flex-none h-10 w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="bg-green-500 rounded-full text-green-100 p-2 size-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25" />
              </svg>
            </div>
            <div class="block font-semibold text-base ml-2">
              <h2 class="block font-semibold text-green-700">Today Income</h2>
              <span v-if="statistics.income" class="block text-green-700">{{currency(statistics.income)}}</span>
              <span v-else class="block text-green-700">Loading...</span>
            </div>
          </article>

          <article class="bg-red-50 w-full flex items-center p-4 rounded">
            <div class="flex-none h-10 w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="bg-red-500 rounded-full text-red-100 p-2 size-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
            <div class="block font-semibold text-base ml-2">
              <h2 class="block font-semibold text-red-700">Today Expense</h2>
              <span v-if="statistics.expense >= 0" class="block text-red-700">{{currency(statistics.expense)}}</span>
              <span v-else class="block text-red-700">Loading...</span>
            </div>
          </article>
        </div>
      </div>
    </section>


    <section class="py-2">
      <div class="bg-white rounded-xl px-4">
        <div class="flex items-center justify-between border-b border-dashed border-gray-300 py-4">
          <h3 class="font-semibold text-lg">Accounts List</h3>
          <div class="flex items-center gap-2">
            <button type="button" @click="accountStore.modal = !accountStore.modal" class="bg-red-50 p-2 rounded-full cursor-pointer">
              <IconPlus class="size-5"/>
            </button>
          </div>
        </div>

        <div class="w-full divide-y divide-dashed divide-gray-200 max-h-[calc(100vh-12rem)] scrollbar overflow-y-auto">
          <template v-if="accounts.data">
            <RouterLink :to="{name: 'account.statement', params: {id: account.id}}" v-for="account in accounts.data" class="py-2  flex items-center justify-between">
              <div class="flex items-center gap-2">
                <img src="/icons/deposit.png" alt="img" class="bg-primary/10 p-1 rounded h-10 w-auto">
                <div>
                  <h4 class="flex items-center gap-2 mr-2">
                    {{account.name}}
                    <IconLock v-if="account.default" class="size-4"/>
                  </h4>
                  <small>{{account.number}}</small>
                </div>
              </div>
              <div class="flex-none flex items-center gap-2">
                <div class="flex  items-center gap-2">
                  <div class="flex-none text-right">
                    <h4 class="text-green-500">{{currency(account.current_balance)}}</h4>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-primary">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </RouterLink>
          </template>

          <template v-else>
            <p>loading...</p>
          </template>
        </div>
      </div>
    </section>

    <BaseModal :show="accountStore.modal">
      <div class="flex justify-between items-center border-b border-gray-300 border-dashed pb-3">
        <h2 class="text-xl font-semibold">Add Account</h2>
        <button type="button" class="cursor-pointer text-red-500" @click="accountStore.modal = false">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mt-4">
        <form @submit.prevent="onSubmit" class="w-full max-w-sm">
          <div class="form__group">
            <label class="form__label">Name <span class="text-danger">*</span></label>
            <input type="text" v-model="form.name" class="form__control" placeholder="Enter name"/>
          </div>
          <div class="form__group">
            <label class="form__label">Number <span class="text-danger">*</span></label>
            <input type="tel" v-model="form.number" class="form__control" placeholder="Enter number"/>
          </div>

          <div class="form__group">
            <label class="form__label">Opening Balance <span class="text-danger">*</span></label>
            <input type="number" v-model="form.opening_balance" class="form__control" placeholder="Enter balance"/>
          </div>
          <BaseButton class="w-full bg-primary text-white" :loading="accountStore.loading">submit</BaseButton>
        </form>
      </div>
    </BaseModal>

  </Default>
</template>
