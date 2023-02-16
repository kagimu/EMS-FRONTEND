import { defineStore } from "pinia"
import { ref } from "vue"
import api from "../../config/api.js";

export const useLoginStore = defineStore("login", () => {
    let loginResponse = ref({})
    const loginError = ref(null)

    async function userLogin(data) {
        return await api
            .get("api/auth/login" + data)
            .then((response) => {
                loginResponse.value = response.data
            })
            .catch((response) => {
                loginError.value = response.response.data
            })
    }
    return {
        loginResponse,
        loginError,
        userLogin,
    }
})