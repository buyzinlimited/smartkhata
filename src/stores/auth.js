import {defineStore} from 'pinia'
import axiosInstance from "@/plugins/axios.js";
import {useToastStore} from "@/stores/toast.js";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loading: false,
    user: {},
    token: null,
    api_key: null,
    errors: {},
  }),

  // persist: true,

  persist: {
    paths: ['token', 'user', 'api_key'],
  },

  getters: {
    loggedIn: state => !!state.token,
  },

  actions: {

    async login(formData) {
      this.loading = true;
      const toastStore = useToastStore();
      try {
        const response = await axiosInstance.post("/api/auth/login", formData);
        console.log(response.data);
        if (response.status === 200){
          this.token = response.data?.token;
          this.user = response.data?.user;
          this.api_key = response.data?.api_key;
          toastStore.success(response.data.message);
          setTimeout(() => {
            window.location.replace(import.meta.env.BASE_URL);
          }, 1000);
          return new Promise((resolve) =>{
            resolve(response.data)
          });
        }
      } catch (error) {
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }finally {
        this.loading = false
      }
    },


    async getUser() {
      try {
        const response = await axiosInstance.get('/api/user');
        if (response.status === 200) {
          this.user = response.data;
          this.selectedCompany = this.companies[0] || null;
        }
      } catch (error) {
        if (error.response) {
          this.errors = error.response.data.errors;
        }
      }
    },

    async logout(){
      this.loading = true;
      try {
        const response = await axiosInstance.post('/api/logout');
        if (response.status === 200) {
          const toastStore = useToastStore();
          toastStore.success(response.data.message);
          this.$reset();
          setTimeout(() => {
            window.location.replace(import.meta.env.BASE_URL);
          }, 1000);
          return new Promise((resolve) => {
            resolve(response);
          });
        }
      }catch (error){
        const toastStore = useToastStore();
        if (error.response){
          this.errors = error.response.data.errors;
          toastStore.error(error.response.data.message);
        }
      }finally {
        this.loading = false;
      }
    },
  },
})