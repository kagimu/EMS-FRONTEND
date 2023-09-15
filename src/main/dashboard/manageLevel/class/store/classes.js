import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useClassesStore = defineStore("classes", () => {
    let classResponse = ref(null)
    let classLevelResponse = ref(null)
    let classInfoResponse = ref(null)
    let classSubjectsInfoResponse = ref(null)
    let classSubjectResponse = ref(null)
    const errorMessage = ref(null)




    async function newClassData(data) {
        return await api.post("main/new-class", data)
            .then((response) => {
                classResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newClassLevelData(data) {
        return await api.post("main/new-class-level", data)
            .then((response) => {
                classLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    async function addClassSubjectData(data) {
        return await api.post("main/subject-to-class", data)
            .then((response) => {
                classSubjectResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClasses(data) {
        data = data ? data : ""
        return await api.get("main/classes?level_number="+data)
            .then((response) => {
                classInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassSubjects(data) {
        return await api.get("main/class-subjects?level_number="+data)
            .then((response) => {
                classSubjectsInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        classResponse,
        classInfoResponse,
        classSubjectsInfoResponse,
        classSubjectResponse,
        classLevelResponse,
        errorMessage,
        newClassData,
        fetchClasses,
        fetchClassSubjects,
        addClassSubjectData,
        newClassLevelData
    }
})