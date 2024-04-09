import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTopicStore = defineStore("topic", () => {
    let topicResponse = ref(null)
    let topicInfoResponse = ref(null)
    let topicEditResponse = ref(null)
    let topicListResponse = ref(null)
    let deleteTopicResponse = ref(null)
    let topicDataInfoResponse = ref(null)
    const errorMessage = ref(null)



    async function newTopicData(data) {
        return await api.post("main/new-topic", data)
            .then((response) => {
                topicResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function editTopicData(data) {
        return await api.post("main/topic/edit", data)
            .then((response) => {
                topicEditResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
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
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchTopicList(data) {
        return await api.get("main/topic-list?strand_number="+data.strand_number+"&curriculum_number="+data.curriculum_number)
            .then((response) => {
                topicListResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function deleteTopic(data) {
        return await api.post("main/topic/delete", data)
            .then((response) => {
                deleteTopicResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function topicData(data) {
        return await api.get("main/topic/info?topic_number="+data)
            .then((response) => {
                topicDataInfoResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    return {
        topicResponse,
        topicInfoResponse,
        topicListResponse,
        deleteTopicResponse,
        topicDataInfoResponse,
        topicEditResponse,
        errorMessage,
        newTopicData,
        fetchTopics,
        fetchTopicList,
        deleteTopic,
        topicData,
        editTopicData,
    }
})