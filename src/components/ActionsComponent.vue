<script setup>
import WithdrawComponent from "@/components/WithdrawComponent.vue";
import DepositComponent from "@/components/DepositComponent.vue";
import ExchangeComponent from "@/components/ExchangeComponent.vue";
import ExpenseComponent from "@/components/ExpenseComponent.vue";
import { usePaymentStore } from "@/stores/payment.js";

const paymentStore = usePaymentStore();
</script>

<template>
  <div class="mt-4 flex items-center justify-center space-x-4">

    <button type="button" @click="paymentStore.deposit = true"
      class="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
      Deposit
    </button>
    <button type="button" @click="paymentStore.withdraw = true"
      class="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer">
      Withdraw
    </button>
    <button type="button" @click="paymentStore.exchange = true"
      class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
      Exchange
    </button>
    <button type="button" @click="paymentStore.expense = true"
      class="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
      Expense
    </button>
  </div>

  <ExchangeComponent />

  <DepositComponent />

  <WithdrawComponent />

  <ExpenseComponent />
</template>

<style scoped></style>
