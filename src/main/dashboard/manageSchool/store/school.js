import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSchoolStore = defineStore("school", () => {
    let newSchoolResponse = ref(null)
    const errorMessage = ref(null)
    const schoolsResponse = ref(null)


/*    async function userLogin(data) {
        return await api.post("auth/login", data)
            .then((response) => {
                let dataInfo = response.data
                // localStorage.setItem("token", dataInfo.access_token)
                // localStorage.setItem("expires_in", dataInfo.expires_in)
                loginResponse.value = dataInfo
                userNumber.value = dataInfo.data.number
                // token.value = dataInfo.access_token
            })
            .catch((response) => {
                if(response){
                    localStorage.removeItem("token")
                    errorMessage.value = response.response.data
                }
            })
    }*/



    async function newSchoolData(data) {
        return await api.post("main/new-school", data)
            .then((response) => {
                newSchoolResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSchools(data) {
        return await api.get("main/schools", data)
            .then((response) => {
                schoolsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        newSchoolResponse,
        schoolsResponse,
        errorMessage,
        newSchoolData,
        fetchSchools
    }
})