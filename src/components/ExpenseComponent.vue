<script setup>
import { onMounted, reactive, ref } from "vue";
import { usePaymentStore } from "@/stores/payment.js";
import BaseButton from "@/components/BaseButton.vue";
import BaseModal from "@/components/BaseModal.vue";
import { useAccountStore } from "@/stores/account.js";
import { storeToRefs } from "pinia";

const paymentStore = usePaymentStore();
const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const getAccounts = async () => {
  await accountStore.all();
};

const selectedAccount = ref("");

const form = reactive({
  account_id: selectedAccount,
  type: "expense",
  amount: "",
  reference: "",
  remark: "",
});
const onSubmit = async () => {
  await paymentStore.expenseStore(form);
};

onMounted(() => {
  getAccounts();
});
</script>

<template>
  <BaseModal :show="paymentStore.expense">
    <div
      class="flex justify-between items-center border-b border-gray-300 border-dashed pb-3"
    >
      <h2 class="text-xl font-semibold">Expense</h2>
      <button
        type="button"
        class="cursor-pointer text-red-500"
        @click="paymentStore.expense = false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="mt-4">
      <form @submit.prevent="onSubmit" class="w-full max-w-sm">
        <div class="form__group">
          <label class="form__label"
            >Select Account <span class="text-danger">*</span></label
          >
          <select v-model="selectedAccount" class="form__control">
            <option value="" disabled>Select option</option>
            <option
              :value="account.id"
              v-for="account in accounts.data"
              :key="account.id"
            >
              {{ account.name + " - " + account.number }}
            </option>
          </select>
        </div>

        <div class="form__group">
          <label class="form__label"
            >Amount <span class="text-danger">*</span></label
          >
          <input
            type="number"
            v-model="form.amount"
            class="form__control"
            placeholder="Enter amount"
          />
        </div>
        <div class="form__group">
          <label class="form__label">Reference (TrxID)</label>
          <input
            type="text"
            v-model="form.reference"
            class="form__control"
            placeholder="Enter reference"
          />
        </div>
        <div class="form__group">
          <label class="form__label">Remark</label>
          <input
            type="text"
            v-model="form.remark"
            class="form__control"
            placeholder="Enter remark"
          />
        </div>
        <BaseButton
          class="w-full bg-primary text-white"
          :loading="paymentStore.loading"
          >submit</BaseButton
        >
      </form>
    </div>
  </BaseModal>
</template>

<style scoped></style>
