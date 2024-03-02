import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAuthStore = defineStore("auth", () => {
    let loginResponse = ref(null)
    let registrationResponse = ref(null)
    const errorMessage = ref(null)
    const token = ref(null)
    const userNumber = ref(null)
    const profile = ref(null)


    async function userLogin(data) {
        return await api.post("auth/login", data)
            .then((response) => {

                let dataInfo = response.data
                // localStorage.setItem("token", dataInfo.access_token)
                localStorage.clear()
                localStorage.setItem("token", dataInfo.token)
                let permissions = []

                if(response.data.data.type === 'Admin'){
                    permissions.push({"action":"manage","resource":"all"})
                }
                else {
               

                if (response.data.data.permissions === undefined)
                    permissions.push({"action":"read","resource":"general"})
                else
                response.data.data.permissions.forEach(permission => {
                        permissions.push({"action":permission,"resource":"general"})
                    });
                }
                localStorage.setItem('abilities',JSON.stringify(permissions))

                // localStorage.setItem("expires_in", dataInfo.expires_in)
                loginResponse.value = dataInfo
                userNumber.value = dataInfo.data.number
                token.value = dataInfo.token


            })
            .catch((response) => {
                if(response){
                    localStorage.removeItem("token")
                    errorMessage.value = response.response.data
                }
            })
    }


    async function userProfile() {
        return await api.get("main/profile")
            .then((response) => {
                let user = response.data
                localStorage.setItem("userProfile", JSON.stringify(user.data))
                profile.value = user.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function userRegistration(data) {
        return await api.post("auth/register", data)
            .then((response) => {
                registrationResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    function updateToken(data){
        if(data){
           token.value = data
        }
    }

    function updateProfile(data){
        if(data){
            let profileData = JSON.parse(data)
            profile.value = profileData
            userNumber.value = profileData.number
        }
    }

    return {
        loginResponse,
        registrationResponse,
        errorMessage,
        token,
        profile,
        userNumber,
        userLogin,
        userRegistration,
        userProfile,
        updateToken,
        updateProfile,
    }
})