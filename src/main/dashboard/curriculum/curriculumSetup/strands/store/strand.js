import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useStrandStore = defineStore("strand", () => {
    let strandResponse = ref(null)
    let strandInfoResponse = ref(null)
    let strandListResponse = ref(null)
    const errorMessage = ref(null)



    async function newStrandData(data) {
        return await api.post("main/new-strand", data)
            .then((response) => {
                strandResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchStrands(data) {
        return await api.get("main/strands?learning_area_number="+data.learning_area_number+
        "&subject_cluster_number="+data.subject_cluster_number+
        "&subject_number="+data.subject_number
            )
            .then((response) => {
                strandInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchStrandList(data) {
        return await api.get("main/strand-list?subject_number="+data)
            .then((response) => {
                strandListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }





    return {
        strandResponse,
        strandInfoResponse,
        strandListResponse,
        errorMessage,
        newStrandData,
        fetchStrands,
        fetchStrandList
    }
})