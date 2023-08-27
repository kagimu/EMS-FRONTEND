import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useCampusStore = defineStore("campus", () => {
    let newCampusResponse = ref(null)
    const errorMessage = ref(null)


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



    async function newCampusData(data) {
        return await api.post("main/new-campus", data)
            .then((response) => {
                newCampusResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        newCampusResponse,
        errorMessage,
        newCampusData
    }
})