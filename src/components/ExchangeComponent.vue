<script setup>
import BaseButton from "@/components/BaseButton.vue";
import BaseModal from "@/components/BaseModal.vue";
import {usePaymentStore} from "@/stores/payment.js";
import {onMounted, reactive, ref} from "vue";
import {storeToRefs} from "pinia";
import {useAccountStore} from "@/stores/account.js";

const paymentStore = usePaymentStore();
const accountStore = useAccountStore();
const {accounts} = storeToRefs(accountStore);
const selectedSender = ref('');
const selectedReceiver = ref('');


const form = reactive({
  sender_id: selectedSender,
  receiver_id: selectedReceiver,
  amount: '',
  fee: '',
  reference: '',
  account_no: '',
  remark: '',
});

const onSubmit = async () => {
  await paymentStore.getExchange(form);
}
const getAccounts = async () => {
  await accountStore.all();
}

onMounted(() => {
  getAccounts();
});
</script>

<template>
  <BaseModal :show="paymentStore.exchange">
    <div class="flex justify-between items-center border-b border-gray-300 border-dashed pb-3">
      <h2 class="text-xl font-semibold">Add Exchange</h2>
      <button type="button" class="cursor-pointer text-red-500" @click="paymentStore.exchange = false">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="mt-4">
      <form @submit.prevent="onSubmit" class="w-full max-w-sm">
        <div class="grid grid-cols-2 gap-4">
          <div class="form__group">
            <label class="form__label">Send <span class="text-danger">*</span></label>
            <select v-model="selectedSender" class="form__control">
              <option value="" disabled>Select Sender</option>
              <option :value="account.id" v-for="account in accounts.data" :key="account.id">{{account.name +' - '+account.number}}</option>
            </select>
          </div>
          <div class="form__group">
            <label class="form__label">Received <span class="text-danger">*</span></label>
            <select v-model="selectedReceiver" class="form__control">
              <option value="" disabled>Select Receiver</option>
              <option :value="account.id" v-for="account in accounts.data" :key="account.id">{{account.name +' - '+account.number}}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form__group">
            <label class="form__label">Amount <span class="text-danger">*</span></label>
            <input type="number" v-model="form.amount" class="form__control" placeholder="Enter amount"/>
          </div>

          <div class="form__group">
            <label class="form__label">Fee</label>
            <input type="number" v-model="form.fee" class="form__control" placeholder="Enter fee"/>
          </div>
        </div>

        <div class="form__group">
          <label class="form__label">Account No</label>
          <input type="number" v-model="form.account_no" class="form__control" placeholder="Enter account no"/>
        </div>

        <div class="form__group">
          <label class="form__label">TrxID</label>
          <input type="text" v-model="form.reference" class="form__control" placeholder="Enter TrxID"/>
        </div>

        <div class="form__group">
          <label class="form__label">Remark</label>
          <input type="text" v-model="form.remark" class="form__control" placeholder="Enter remark"/>
        </div>

        <BaseButton class="w-full bg-primary text-white" :loading="paymentStore.loading">submit</BaseButton>
      </form>
    </div>
  </BaseModal>
</template>

<style scoped>

</style>