import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSubtopicStore = defineStore("subtopic", () => {
    let subtopicResponse = ref(null)
    let subtopicInfoResponse = ref(null)
    let subtopicEditResponse = ref(null)
    let subtopicListResponse = ref(null)
    let subtopicByClassInfoResponse = ref(null)
    let subtopicByClassTemplateResponse = ref(null)
    let importSchemeResponse = ref(null)
    let deleteSubTopicResponse = ref(null)
    let subTopicDataInfoResponse = ref(null)
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

    async function editSubtopicData(data) {
        return await api.post("main/sub-topic/edit", data)
            .then((response) => {
                subtopicEditResponse.value = response.data
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
        return await api.get("main/sub-topic-list?topic_number="+data.topic_number+"&curriculum_number="+data.curriculum_number)
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

    async function downloadSchemeTemplateExcel(data) {
        return await api.get("main/scheme-of-work/download-scheme-template?class_number="+data.class_number+"&subject_number="+data.subject_number)
            .then((response) => {
                subtopicByClassTemplateResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function importSchemeOfWork(data) {
        return await api.post("main/scheme-of-work/upload-scheme-of-work", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((response) => {
                importSchemeResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteSubTopic(data) {
        return await api.post("main/sub-topic/delete", data)
            .then((response) => {
                deleteSubTopicResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function subTopicData(data) {
        return await api.get("main/sub-topic/info?sub_topic_number="+data)
            .then((response) => {
                subTopicDataInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        subtopicResponse,
        importSchemeResponse,
        subtopicInfoResponse,
        subtopicByClassInfoResponse,
        subtopicListResponse,
        subtopicByClassTemplateResponse,
        deleteSubTopicResponse,
        subTopicDataInfoResponse,
        subtopicEditResponse,
        errorMessage,
        newSubtopicData,
        fetchSubTopics,
        fetchSubTopicsByClass,
        fetchSubTopicList,
        downloadSchemeTemplateExcel,
        importSchemeOfWork,
        deleteSubTopic,
        subTopicData,
        editSubtopicData
    }
})