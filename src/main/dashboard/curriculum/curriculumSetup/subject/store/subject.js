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
    const deleteSubjectResponse = ref(null)
    const subjectDataInfoResponse = ref(null)
    const errorMessage = ref(null)
    const subjectEditResponse = ref(null)



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
        return await api.get("main/subjects?learning_area_number="+data.learning_area_number+
        "&subject_cluster_number="+data.subject_cluster_number+"&curriculum_number="+data.curriculum_number
            )
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
        return await api.get("main/subject-list?subject_cluster_number="+data.subject_cluster_number+"&curriculum_number="+data.curriculum_number)
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



    async function deleteSubject(data) {
        return await api.post("main/subject/delete", data)
            .then((response) => {
                deleteSubjectResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function subjectData(data) {
        return await api.get("main/subject/info?subject_number="+data)
            .then((response) => {
                subjectDataInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function editSubjectData(data) {
        return await api.post("main/subject/edit", data)
            .then((response) => {
                subjectEditResponse.value = response.data
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
        deleteSubjectResponse,
        subjectDataInfoResponse,
        subjectEditResponse,
        errorMessage,
        newSubjectData,
        fetchSubjects,
        fetchSubjectsByClass,
        fetchSubjectByClass,
        fetchAcademicYearByClass,
        fetchSchemeSubjectByClass,
        fetchSubjectList,
        deleteSubject,
        subjectData,
        editSubjectData,
    }
})