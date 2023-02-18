import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";
import alert from "bootstrap/js/src/alert.js";
// import alert from "bootstrap/js/src/alert.js";


export const useAuthStore = defineStore("auth", () => {
    let loginResponse = ref({})
    const loginError = ref({})
    const token = ref(null)


    async function userLogin(data) {
        return await api.post("api/auth/login", data)
            .then((response) => {
                loginResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    loginError.value = response.response.data
                }
            })
    }

    async function userRegistration(data) {
        return await api.post("api/auth/register", data)
            .then((response) => {
                loginResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    loginError.value = response.response.data
                }
            })
    }
    return {
        loginResponse,
        loginError,
        userLogin,
        userRegistration,
        token,
    }
})