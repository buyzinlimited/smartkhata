<script setup>
import BaseButton from "@/components/BaseButton.vue";
import BaseModal from "@/components/BaseModal.vue";
import {onMounted, reactive, ref} from "vue";
import {usePaymentStore} from "@/stores/payment.js";
import {useAccountStore} from "@/stores/account.js";
import {storeToRefs} from "pinia";
import {useAuthStore} from "@/stores/auth.js";

const authStore = useAuthStore();
const accountStore = useAccountStore();
const paymentStore = usePaymentStore();
const selectedDeposit = ref('');
const {accounts} = storeToRefs(accountStore);


const deposit = reactive({
  account_id: selectedDeposit,
  amount: '',
  reference: '',
  remark: '',
});

const depositStore = async () => {
  await paymentStore.depositStore(deposit);
}

const getAccounts = async () => {
  await accountStore.all();
}

onMounted(() => {
  getAccounts();
});
</script>

<template>
  <BaseModal :show="paymentStore.deposit">
    <div class="flex justify-between items-center border-b border-gray-300 border-dashed pb-3">
      <h2 class="text-xl font-semibold">Deposit</h2>
      <button type="button" class="cursor-pointer text-red-500" @click="paymentStore.deposit = false">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="mt-4">
      <form @submit.prevent="depositStore" class="w-full max-w-sm">
        <div class="form__group">
          <label class="form__label">Select Account <span class="text-danger">*</span></label>
          <select v-model="selectedDeposit" class="form__control">
            <option value="" disabled>Select option</option>
            <option :value="account.id" v-for="account in accounts.data" :key="account.id">{{account.name+ ' - '+account.number}}</option>
          </select>
        </div>
        <div class="form__group">
          <label class="form__label">Amount <span class="text-danger">*</span></label>
          <input type="number" v-model="deposit.amount" class="form__control" placeholder="Enter amount"/>
        </div>
        <div class="form__group">
          <label class="form__label">Reference (TrxID)</label>
          <input type="text" v-model="deposit.reference" class="form__control" placeholder="Enter reference"/>
        </div>
        <div class="form__group">
          <label class="form__label">Remark</label>
          <input type="text" v-model="deposit.remark" class="form__control" placeholder="Enter remark"/>
        </div>
        <BaseButton class="w-full bg-primary text-white" :loading="paymentStore.loading">submit</BaseButton>
      </form>
    </div>
  </BaseModal>
</template>

<style scoped>

</style>