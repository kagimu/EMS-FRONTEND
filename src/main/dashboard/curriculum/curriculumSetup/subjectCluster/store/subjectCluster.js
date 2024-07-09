import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSubjectClusterStore = defineStore("subjectCluster", () => {
    let subjectClusterResponse = ref(null)
    let subjectClusterInfoResponse = ref(null)
    let subjectClusterFilterResponse = ref(null)
    let deleteSubjectClusterResponse = ref(null)
    let subjectClusterDataInfoResponse = ref(null)
    let subjectClusterEditResponse = ref(null)
    const errorMessage = ref(null)


    async function newSubjectClusterData(data) {
        return await api.post("main/new-subject-cluster", data)
            .then((response) => {
                subjectClusterResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchSubjectCluster(data) {
        return await api.get("main/subject-clusters?learning_area_number="+data.learning_area_number+"&curriculum_number="+data.curriculum_number)
            .then((response) => {
                subjectClusterInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubjectClusterFilter(data) {
        return await api.get("main/subject-cluster-filter?learning_area_number="+data.learning_area_number+"&curriculum_number="+data.curriculum_number)
            .then((response) => {
                subjectClusterFilterResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteSubjectCluster(data) {
        return await api.post("main/subject-cluster/delete", data)
            .then((response) => {
                deleteSubjectClusterResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function subjectClusterData(data) {
        return await api.get("main/subject-cluster/info?subject_cluster_number="+data)
            .then((response) => {
                subjectClusterDataInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function editSubjectClusterData(data) {
        return await api.post("main/subject-cluster/edit", data)
            .then((response) => {
                subjectClusterEditResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        subjectClusterResponse,
        subjectClusterInfoResponse,
        subjectClusterFilterResponse,
        deleteSubjectClusterResponse,
        subjectClusterDataInfoResponse,
        subjectClusterEditResponse,
        errorMessage,
        newSubjectClusterData,
        fetchSubjectCluster,
        fetchSubjectClusterFilter,
        deleteSubjectCluster,
        subjectClusterData,
        editSubjectClusterData
    }
})