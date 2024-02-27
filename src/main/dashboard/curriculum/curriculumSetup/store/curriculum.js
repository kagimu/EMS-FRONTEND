import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useCurriculumStore = defineStore("curriculum", () => {

    let importResponse = ref(null)
    let curriculumExcelResponse = ref(null)
    let curriculumResponse = ref(null)
    let curriculumEditResponse = ref(null)
    let curriculumDataResponse = ref(null)
    let curriculumInfoResponse = ref(null)
    let schoolCurriculumResponse = ref(null)
    let campusCurriculumLevelResponse = ref(null)
    let deleteCurriculumResponse = ref(null)
    let curriculumDataInfoResponse = ref(null)
    const errorMessage = ref(null)


    async function newCurriculumData(data) {
        return await api.post("main/new-curriculum", data)
            .then((response) => {
                curriculumResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function editCurriculumData(data) {
        return await api.post("main/curriculum/edit", data)
            .then((response) => {
                curriculumEditResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchCurriculum() {
        return await api.get("main/curriculum-list")
            .then((response) => {
                curriculumDataResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCurriculumInfo(data) {
        return await api.get("main/curriculum-info?curriculum_number="+data)
            .then((response) => {
                curriculumInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchSchoolCurriculum(data) {
        return await api.get("main/fetch-school-curriculum?school_number="+data)
            .then((response) => {
                schoolCurriculumResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampusCurriculumLevelList(data) {
        return await api.get("main/curriculum/campus-curriculum-level?campus_curriculum_number="+data)
            .then((response) => {
                campusCurriculumLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function uploadExcelFile(data) {
        return await api.post("main/upload-curriculum", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                importResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchUploadedExcel(data) {
        return await api.get("main/uploaded-curriculum?curriculum_number="+data)
            .then((response) => {
                curriculumExcelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function deleteCurriculum(data) {
        return await api.post("main/curriculum/delete", data)
            .then((response) => {
                deleteCurriculumResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchCurriculumData(data) {
        return await api.get("main/curriculum/info?curriculum_number="+data)
            .then((response) => {
                curriculumDataInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        importResponse,
        curriculumExcelResponse,
        curriculumResponse,
        curriculumDataResponse,
        curriculumInfoResponse,
        schoolCurriculumResponse,
        campusCurriculumLevelResponse,
        deleteCurriculumResponse,
        curriculumDataInfoResponse,
        curriculumEditResponse,
        errorMessage,
        uploadExcelFile,
        fetchUploadedExcel,
        newCurriculumData,
        fetchCurriculum,
        fetchCurriculumInfo,
        fetchSchoolCurriculum,
        fetchCampusCurriculumLevelList,
        deleteCurriculum,
        fetchCurriculumData,
        editCurriculumData,
    }
})