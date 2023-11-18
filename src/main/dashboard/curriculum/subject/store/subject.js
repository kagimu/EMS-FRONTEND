import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSubjectStore = defineStore("subject", () => {
    let subjectResponse = ref(null)
    let subjectInfoResponse = ref(null)
    let subjectListResponse = ref(null)
    let subjectByClassResponse = ref(null)
    let schemeSubjectByClassResponse = ref(null)
    let academicYearByClassResponse = ref(null)
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
        return await api.get("main/subjects?subject_cluster_number="+data)
            .then((response) => {
                subjectInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchSubjectList(data) {
        return await api.get("main/subject-list?subject_cluster_number="+data)
            .then((response) => {
                subjectListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubjectByClass(data) {
        return await api.get("main/subjects-by-class?class_number="+data)
            .then((response) => {
                subjectByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAcademicYearByClass(data) {
        return await api.get("main/academic-by-class?class_number="+data)
            .then((response) => {
                academicYearByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSchemeSubjectByClass(data) {
        return await api.get("main/subjects-by-class?class_number="+data)
            .then((response) => {
                schemeSubjectByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSubjectsByClass(data) {
        return await api.get("main/subjects?class_level_number="+data)
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
        subjectByClassResponse,
        subjectListResponse,
        subjectResponse,
        subjectInfoResponse,
        schemeSubjectByClassResponse,
        academicYearByClassResponse,
        errorMessage,
        newSubjectData,
        fetchSubjects,
        fetchSubjectsByClass,
        fetchSubjectByClass,
        fetchAcademicYearByClass,
        fetchSchemeSubjectByClass,
        fetchSubjectList
    }
})