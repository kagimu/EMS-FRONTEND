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
        return await api.get("main/topics?learning_area_number="+data.learning_area_number+
        "&subject_cluster_number="+data.subject_cluster_number+
        "&subject_number="+data.subject_number+
        "&strand_number="+data.strand_number+
        "&class_number="+data.class_number+
        "&curriculum_number="+data.curriculum_number
            )
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
        return await api.get("main/topic-list?strand_number="+data.strand_number+"&curriculum_number="+data.curriculum_number)
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