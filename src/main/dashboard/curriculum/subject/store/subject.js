import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSubjectStore = defineStore("subject", () => {
    let subjectResponse = ref(null)
    let subjectInfoResponse = ref(null)
    const errorMessage = ref(null)



/*
    async function newSchoolData(data) {
        return await api.post("main/new-school", data)
            .then((response) => {
                newSchoolResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }*/

    async function newSubjectData(data) {
        return await api.post("main/new-subject", data)
            .then((response) => {
                subjectResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubjects(data) {
        return await api.get("main/subjects?level_number="+data)
            .then((response) => {
                subjectInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        subjectResponse,
        subjectInfoResponse,
        errorMessage,
        newSubjectData,
        fetchSubjects
    }
})