import { defineStore } from 'pinia'
import axiosInstance from "@/plugins/axios.js";
import {useToastStore} from "@/stores/toast.js";

const toastStore = useToastStore();

export const useCustomerStore = defineStore('customer', {

  state: () => ({
    loading: false,
    modal: false,
    customers: {},
    customer: {},
    errors: {},
    statistics: {},
  }),

  getters: {

  },

  actions: {

    async all (){
      try {
        const response = await axiosInstance.get('/api/customers');
        if (response.status === 200) {
          this.customers = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      }catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },


    async store (formData){
      this.loading = true;
      try {
        const response = await axiosInstance.post('/api/customer/store',formData);
        if (response.status === 201) {
          toastStore.success(response.data.message);
          this.modal = false;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      }catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }finally {
        this.loading = false;
      }
    },


    async show (id){
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/api/customer/${id}/show`);
        if (response.status === 200) {
          this.customer = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      }catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }finally {
        this.loading = false;
      }
    },


    async payment (form){
      this.loading = true;
      try {
        const response = await axiosInstance.post(`/api/customer/${form.customer_id}/payment`, {
          due: form.due,
          payable: form.payable,
          remark: form.remark,
        });
        if (response.status === 201) {
          toastStore.success(response.data.message);
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      }catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }finally {
        this.loading = false;
      }
    },


    async getReport (id){
      try {
        const response = await axiosInstance.get(`/api/customers/${id}/report`);
        if (response.status === 200) {
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      }catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },


    async getStatistics (){
      try {
        const response = await axiosInstance.get(`/api/customers/statistics`);
        if (response.status === 200) {
          this.statistics = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      }catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },


    async getStatements (){
      this.loading = true;
      try {
        const response = await axiosInstance.get('/api/customers/statements', {
          responseType: "blob",
        });

        // Create a Blob from response data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a link element and trigger download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `report_${new Date().toISOString().slice(0, 10)}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
    },


    async delete (id){
      try {
        const response = await axiosInstance.delete(`/api/customer/${id}/delete`);
        if (response.status === 200) {
          toastStore.success(response.data.message);
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      }catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },



  },
})