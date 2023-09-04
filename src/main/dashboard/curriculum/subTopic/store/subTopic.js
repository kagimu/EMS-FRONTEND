import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSubtopicStore = defineStore("subtopic", () => {
    let subtopicResponse = ref(null)
    let subtopicInfoResponse = ref(null)
    const errorMessage = ref(null)



    async function newSubtopicData(data) {
        return await api.post("main/new-sub-topic", data)
            .then((response) => {
                subtopicResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubTopics(data) {
        return await api.get("main/sub-topics?topic_number="+data)
            .then((response) => {
                subtopicInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        subtopicResponse,
        subtopicInfoResponse,
        errorMessage,
        newSubtopicData,
        fetchSubTopics
    }
})