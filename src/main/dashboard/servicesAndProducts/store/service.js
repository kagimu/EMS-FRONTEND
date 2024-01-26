import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useServiceStore = defineStore("service", () => {
    let newServiceResponse = ref(null)
    let errorMessage = ref(null)
    let servicesListResponse = ref(null)
    let deleteServiceResponse = ref(null)
    let updateServiceResponse = ref(null)

        async function createNewService(data) {
            return await api.post("main/services", data)
                .then((response) => {
                    newServiceResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchServicesList() {
            return await api.get("main/services")
                .then((response) => {
                    servicesListResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
    

        async function deleteService() {
            return await api.delete("main/")
                .then((response) => {
                    deleteServiceResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
        async function updateService(serviceid,data) {
            return await api.put("main/")
                .then((response) => {
                    updateServiceResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }


    return {
        newServiceResponse,
        errorMessage,      
        createNewService,
        servicesListResponse,
        fetchServicesList,
        deleteServiceResponse,
        deleteService,
        updateServiceResponse,
        updateService

    }
})