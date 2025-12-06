<script setup>
import Default from "@/layouts/Default.vue";
import {onMounted, reactive} from "vue";
import BaseButton from "@/components/BaseButton.vue";
import {useCustomerStore} from "@/stores/customer.js";
import {storeToRefs} from "pinia";
import {useRoute, useRouter} from "vue-router";
import currency from "../../utils/currency.js";
import Swal from "sweetalert2";
import IconDeleted from "@/components/icons/IconDeleted.vue";
import IconPrint from "@/components/icons/IconPrint.vue";

const customerStore = useCustomerStore();
const { customer } = storeToRefs(customerStore);
const route = useRoute();
const router = useRouter();


const getCustomer = async () => {
  await customerStore.show(route.params.id);
}

const form = reactive({
  customer_id: route.params.id,
  due: '',
  payable: '',
  remark: '',
});

const onSubmit = async () => {
  await customerStore.payment(form);
  form.due = '';
  form.payable = '';
  form.remark = '';
  await getCustomer();
}

const customerDeleted = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#00dc82',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    await customerStore.delete(id);
    await router.push({name: 'customers'})
  }
}

onMounted(() => {
  getCustomer();
})
</script>

<template>
  <Default>
    <main class="px-4">
      <section class="py-2">
        <div class="bg-white rounded-xl px-4 py-2">
          <nav class="flex items-center justify-between border-b border-dashed border-gray-300 py-2">
            <template v-if="customer.data">
              <div class="flex items-center gap-2">
                <img :src="customer.data?.avatar_url" alt="user" class="h-10 w-10">
                <div class="w-full">
                  <h3 class="font-semibold text-base">{{customer.data?.name}}</h3>
                  <small v-if="customer.data?.balance < 0" class="text-sm text-red-500">{{currency(customer.data?.balance)}}</small>
                  <small v-else class="text-sm text-green-500">{{currency(customer.data?.balance)}}</small>
                </div>
              </div>
            </template>

            <template v-else>
              <div role="status" class="w-full animate-pulse">
                <div class="flex items-center">
                  <svg class="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                  </svg>
                  <div>
                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                    <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                </div>
              </div>
            </template>

            <div class="flex items-center gap-2">
              <button type="button" class="bg-red-50 text-dark cursor-pointer p-2 rounded-full">
                <IconPrint class="size-5"/>
              </button>
              <button type="button" @click.prevent="customerDeleted(route.params.id)" class="bg-red-50 text-dark rounded-full cursor-pointer p-2">
                <IconDeleted class="size-5"/>
              </button>
            </div>
          </nav>

          <div class="w-full mt-4">
            <form @submit.prevent="onSubmit" class="w-full grid grid-cols-2 gap-4">
              <div class="form__group">
                <label class="form__label">Due Amount</label>
                <input type="number" v-model="form.due" class="form__control" placeholder="Enter due amount"/>
              </div>
              <div class="form__group">
                <label class="form__label">Payable Amount</label>
                <input type="number" v-model="form.payable" class="form__control" placeholder="Enter payable amount"/>
              </div>
              <div class="form__group col-span-2">
                <label class="form__label">Remark</label>
                <input type="text" v-model="form.remark" class="form__control" placeholder="Enter remark"/>
              </div>
              <BaseButton class="w-full bg-primary text-white col-span-2" :loading="customerStore.loading">submit</BaseButton>
            </form>
          </div>
        </div>
      </section>

    </main>

  </Default>
</template>
