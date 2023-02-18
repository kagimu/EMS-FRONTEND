import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAuthStore = defineStore("auth", () => {
    let loginResponse = ref({})
    const loginError = ref({})
    const token = ref(null)
    const profile = ref({})


    async function userLogin(data) {
        return await api.post("api/auth/login", data)
            .then((response) => {
                let dataInfo = response.data
                localStorage.setItem("token", dataInfo.access_token)
                localStorage.setItem("expires_in", dataInfo.expires_in)
                loginResponse.value = dataInfo
                token.value = dataInfo.access_token
            })
            .catch((response) => {
                if(response){
                    localStorage.removeItem("token")
                    loginError.value = response.response.data
                }
            })
    }


    async function userProfile() {
        return await api.get("api/auth/profile")
            .then((response) => {
                let user = response.data
                localStorage.setItem("userProfile", JSON.stringify(user))
                profile.value = user
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
        token,
        profile,
        userLogin,
        userRegistration,
        userProfile,
    }
})