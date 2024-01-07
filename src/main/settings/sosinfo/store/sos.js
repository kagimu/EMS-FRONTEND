import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSosStore = defineStore("sos", () => {
    let newsosInfoResponse = ref(null)
    let  sosInfoResponse= ref(null)
    let  deletesosInfoResponse= ref(null)
    let updateSosInfoResponse = ref(null)
    
    const errorMessage = ref(null)

    async function newSosInfo(data) {
        return await api.post("main/applications/new-source-of-school-info", data)
            .then((response) => {
                newsosInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSosInfo() {
        return await api.get("main/applications/source-of-school-info")
            .then((response) => {
                sosInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function deleteSos() {
        return await api.delete("main/applications/source-of-school-info")
            .then((response) => {
                deletesosInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function updateSos(sosnumber,data) {
        return await api.put("main/applications/edit-source-of-school-info/"+sosnumber,data)
            .then((response) => {
                updateSosInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        newsosInfoResponse,
        errorMessage,
        newSosInfo,
        fetchSosInfo,
        deleteSos,
        sosInfoResponse,
        deletesosInfoResponse,
        updateSosInfoResponse,
        updateSos,
    }
} )