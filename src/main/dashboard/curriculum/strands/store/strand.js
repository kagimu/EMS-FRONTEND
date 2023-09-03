import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useStrandStore = defineStore("strand", () => {
    let strandResponse = ref(null)
    let strandInfoResponse = ref(null)
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
        return await api.get("main/strands?subject_number="+data)
            .then((response) => {
                strandInfoResponse.value = response.data
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
        errorMessage,
        newStrandData,
        fetchStrands
    }
})