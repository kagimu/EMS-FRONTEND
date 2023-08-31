import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useClassesStore = defineStore("classes", () => {
    let classResponse = ref(null)
    let classInfoResponse = ref(null)
    let classSubjectsInfoResponse = ref(null)
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

    async function fetchClasses(data) {
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
        errorMessage,
        newClassData,
        fetchClasses,
        fetchClassSubjects
    }
})