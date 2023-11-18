import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSubjectClusterStore = defineStore("subjectCluster", () => {
    let subjectClusterResponse = ref(null)
    let subjectClusterInfoResponse = ref(null)
    let subjectClusterFilterResponse = ref(null)
    const errorMessage = ref(null)


    async function newSubjectClusterData(data) {
        return await api.post("main/new-subject-cluster", data)
            .then((response) => {
                subjectClusterResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchSubjectCluster(data) {
        return await api.get("main/subject-clusters?learning_area_number="+data)
            .then((response) => {
                subjectClusterInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubjectClusterFilter(data) {
        return await api.get("main/subject-cluster-filter?learning_area_number="+data)
            .then((response) => {
                subjectClusterFilterResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        subjectClusterResponse,
        subjectClusterInfoResponse,
        subjectClusterFilterResponse,
        errorMessage,
        newSubjectClusterData,
        fetchSubjectCluster,
        fetchSubjectClusterFilter
    }
})