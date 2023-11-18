import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useConceptStore = defineStore("concept", () => {
    let conceptResponse = ref(null)
    let conceptInfoResponse = ref(null)
    const errorMessage = ref(null)



    async function newConceptData(data) {
        return await api.post("main/new-concept", data)
            .then((response) => {
                conceptResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchConcepts(data) {
        return await api.get("main/concepts?learning_area_number="+
                data.learning_area_number+"&sub_topic_number="+
                data.sub_topic_number
            )
            .then((response) => {
                conceptInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        conceptResponse,
        conceptInfoResponse,
        errorMessage,
        newConceptData,
        fetchConcepts
    }
})