import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";
import alert from "bootstrap/js/src/alert.js";

export const useLoginStore = defineStore("login", () => {
    let loginResponse = ref({})
    const loginError = ref(null)

    async function userLogin(data) {
        return await api
            .post("auth/login", data)
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
    }
})