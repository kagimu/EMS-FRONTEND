import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTopicStore = defineStore("topic", () => {
    let topicResponse = ref(null)
    let topicInfoResponse = ref(null)
    let topicListResponse = ref(null)
    const errorMessage = ref(null)



    async function newTopicData(data) {
        return await api.post("main/new-topic", data)
            .then((response) => {
                topicResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchTopics(data) {
        return await api.get("main/topics?strand_number="+data)
            .then((response) => {
                topicInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchTopicList(data) {
        return await api.get("main/topic-list?strand_number="+data)
            .then((response) => {
                topicListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        topicResponse,
        topicInfoResponse,
        topicListResponse,
        errorMessage,
        newTopicData,
        fetchTopics,
        fetchTopicList
    }
})