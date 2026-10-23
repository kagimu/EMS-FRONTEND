import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";
import { updateAbilities } from "@/abilities";

export const useAuthStore = defineStore("auth", () => {
    let loginResponse = ref(null)
    let registrationResponse = ref(null)
    const errorMessage = ref(null)
    const token = ref(null)
    const userNumber = ref(null)
    const profile = ref(null)
    const resetPasswordResponse = ref(null)
    const setUserPasswordResponse = ref(null)


    async function userLogin(data) {
        return await api.post("auth/login", data)
            .then((response) => {
                if(response && response.data) {
                    let dataInfo = response.data

                   
                    localStorage.setItem("token", dataInfo.token)
                    let permissions = []

                    if (dataInfo.data.type === 'Admin') {
                        permissions.push({"action": "manage", "resource": "all"})
                    } else if(dataInfo.data.type === 'User') {
                        permissions.push({"action": "read", "resource": "all"})
                    } else {
                        if (dataInfo.data && dataInfo.data.permissions.length > 0){
                            dataInfo.data.permissions.forEach(permission => {
                                permissions.push({"action": permission, "resource": "general"})
                            });
                        }else {
                            permissions.push({"action": "read", "resource": "general"})
                        }
                    }
                    localStorage.setItem('abilities', JSON.stringify(permissions))
                    updateAbilities(permissions)

                    // localStorage.setItem("expires_in", dataInfo.expires_in)
                    loginResponse.value = dataInfo
                    userNumber.value = dataInfo.data.number
                    token.value = dataInfo.token
                }

            })
            .catch((error) => {
                if(error && error.response){
                    localStorage.removeItem("token")
                    errorMessage.value = error.response.data
                }
            })
    }


    async function resetPassword(data) {
        return await api.post("auth/reset-password", data)
            .then((response) => {
                resetPasswordResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    localStorage.removeItem("token")
                    errorMessage.value = error.response.data
                }
            })
    }


    async function userProfile() {
        return await api.get("main/profile")
            .then((response) => {
                let user = response.data
                localStorage.setItem("userProfile", JSON.stringify(user.data))
                profile.value = user.data
                syncAbilitiesWithProfile(user.data)
            })
            .catch((error) => {
                if(error && error.response){
                    localStorage.removeItem("token")
                    errorMessage.value = error.response.data
                }
            })
    }

    async function userRegistration(data, options = {}) {
        // Reset so the caller can trust the result of THIS attempt only.
        registrationResponse.value = null
        errorMessage.value = null
        return await api.post("auth/register", data, options)
            .then((response) => {
                registrationResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    localStorage.removeItem("token")
                    errorMessage.value = error.response.data
                } else {
                    // Timeout / network error: no response to read.
                    errorMessage.value = { message: (error && error.message) || 'Network error' }
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
            syncAbilitiesWithProfile(profileData)
        }
    }

    // Keep the live CASL ability in sync with the session. The login response
    // sets granular abilities; a restored Admin session must always have the
    // installation-level manage rule even if the stored ability list is stale
    // or missing. This is presentation-only: the backend still authorises.
    function syncAbilitiesWithProfile(profileData) {
        if (!profileData) {
            return
        }

        let stored = []
        try {
            stored = JSON.parse(localStorage.getItem('abilities') || '[]')
        } catch (error) {
            stored = []
        }

        if (profileData.type === 'Admin' && !stored.some((rule) => rule.action === 'manage')) {
            stored = [{ action: 'manage', resource: 'all' }]
            localStorage.setItem('abilities', JSON.stringify(stored))
        }

        updateAbilities(stored)
    }

    async function setUserPassword(data) {
        return await api.post("auth/set-password", data)
            .then((response) => {
                setUserPasswordResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    localStorage.removeItem("token")
                    errorMessage.value = error.response.data
                }
            })
    }

    return {
        loginResponse,
        registrationResponse,
        errorMessage,
        token,
        profile,
        userNumber,
        resetPasswordResponse,
        setUserPasswordResponse,
        userLogin,
        userRegistration,
        userProfile,
        updateToken,
        updateProfile,
        resetPassword,
        setUserPassword,
    }
})