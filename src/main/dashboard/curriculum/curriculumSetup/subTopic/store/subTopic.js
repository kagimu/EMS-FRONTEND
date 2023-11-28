import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSubtopicStore = defineStore("subtopic", () => {
    let subtopicResponse = ref(null)
    let subtopicInfoResponse = ref(null)
    let subtopicListResponse = ref(null)
    let subtopicByClassInfoResponse = ref(null)
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
        return await api.get("main/sub-topics?learning_area_number="+data.learning_area_number+
                "&subject_cluster_number="+data.subject_cluster_number+
                "&subject_number="+data.subject_number+
                "&strand_number="+data.strand_number+
                "&topic_number="+data.topic_number+
                "&class_number="+data.class_number+
                "&curriculum_number="+data.curriculum_number
            )
            .then((response) => {
                subtopicInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubTopicList(data) {
        return await api.get("main/sub-topic-list?topic_number="+data)
            .then((response) => {
                subtopicListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubTopicsByClass(data) {
        return await api.get("main/sub-topics-by-class?class_number="+data.class_number+"&subject_number="+data.subject_number)
            .then((response) => {
                subtopicByClassInfoResponse.value = response.data
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
        subtopicByClassInfoResponse,
        subtopicListResponse,
        errorMessage,
        newSubtopicData,
        fetchSubTopics,
        fetchSubTopicsByClass,
        fetchSubTopicList
    }
})