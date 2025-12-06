import { defineStore } from "pinia";
import axiosInstance from "@/plugins/axios.js";
import { useToastStore } from "@/stores/toast.js";

const toastStore = useToastStore();

export const useAccountStore = defineStore("account", {
  state: () => ({
    loading: false,
    modal: false,
    errors: {},
    accounts: {},
    transactions: {},
    statement: {},
    balance: 0,
    statistics: {},
  }),

  getters: {},

  actions: {
    async all() {
      try {
        const response = await axiosInstance.get(`/api/accounts`);
        if (response.status === 200) {
          this.accounts = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },

    async store(form) {
      this.loading = true;
      try {
        const response = await axiosInstance.post("/api/account/store", form);
        if (response.status === 201) {
          this.modal = false;
          toastStore.success(response.data.message);
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      } finally {
        this.loading = false;
      }
    },

    async getLatestTransactions(date) {
      try {
        const response = await axiosInstance.get(`/api/transactions/latest`, {
          params: {
            date: date,
          },
        });
        if (response.status === 200) {
          this.transactions = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },

    async getTransactions(date, page) {
      try {
        const response = await axiosInstance.get(`/api/transactions`, {
          params: {
            date: date,
            page: page,
          },
        });
        if (response.status === 200) {
          this.transactions = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },

    async getAccountTransactions(form, page) {
      try {
        const response = await axiosInstance.get(
          `/api/account/${form.account_id}/transactions`,
          {
            params: {
              date: form.date,
              page: page,
            },
          }
        );
        if (response.status === 200) {
          this.transactions = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },

    async getStatement(form) {
      try {
        const response = await axiosInstance.get(
          `/api/account/${form.account_id}/statement`,
          {
            params: { date: form.date },
            responseType: "blob", // Important for handling PDFs
          }
        );

        if (response.status === 200) {
          // Create a Blob from the PDF response
          const blob = new Blob([response.data], { type: "application/pdf" });

          // Create a URL for the blob and trigger download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `statement_${form.account_id}_${form.date}.pdf`;
          document.body.appendChild(a);
          a.click();

          // Cleanup
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },

    async getBalance() {
      try {
        const response = await axiosInstance.get(`/api/balance`);
        if (response.status === 200) {
          this.balance = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },

    async getStatistics() {
      try {
        const response = await axiosInstance.get(`/api/account/statistics`);
        if (response.status === 200) {
          this.statistics = response.data;
          return new Promise((resolve) => {
            resolve(response.data);
          });
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },

    async getTransactionsReport(date) {
      try {
        const response = await axiosInstance.get(
          `/api/account/${form.account_id}/statement`,
          {
            params: { date: date },
            responseType: "blob", // Important for handling PDFs
          }
        );

        if (response.status === 200) {
          // Create a Blob from the PDF response
          const blob = new Blob([response.data], { type: "application/pdf" });

          // Create a URL for the blob and trigger download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `statement_${form.account_id}_${form.date}.pdf`;
          document.body.appendChild(a);
          a.click();

          // Cleanup
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }
    },
  },
});
