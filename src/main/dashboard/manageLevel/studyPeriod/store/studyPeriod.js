import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useStudyPeriodStore = defineStore("studyPeriod", () => {
    const errorMessage = ref(null)
    const academicYearResponse = ref(null)
    const newStudyPeriodResponse = ref(null)
    const studyPeriodResponse = ref(null)
    const deleteStudyPeriodResponse = ref(null)
    const studyPeriodDataResponse = ref(null)
    const editStudyPeriodResponse = ref(null)
    const studyPeriodByAcademicYearResponse = ref(null)
    const newStudyPeriodGroupNameResponse = ref(null)
    const studyPeriodGroupNameResponse = ref(null)
    const deleteStudyPeriodGroupNameResponse = ref(null)
    const editStudyPeriodGroupNameResponse = ref(null)



    async function newStudyPeriod(data) {
        return await api.post("main/study-period/new", data)
            .then((response) => {
                newStudyPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function editStudyPeriod(data) {
        return await api.post("main/study-period/edit", data)
            .then((response) => {
                editStudyPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchStudyPeriod(data) {
        let campus_curriculum_number = data.campus_curriculum_number ? data.campus_curriculum_number : ""
        let  academic_year_number = data.academic_year_number ? data.academic_year_number :  ""
        // alert(campus_curriculum_number)

        return await api.get("main/study-period/all?campus_curriculum_number="+campus_curriculum_number+"&academic_year_number="+academic_year_number)
            .then((response) => {
                studyPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    


    async function fetchStudyPeriodByAcademicYear(academic_year_number) {
        return await api.get("main/study-period/by-academic-year?academic_year_number="+academic_year_number)
            .then((response) => {
                studyPeriodByAcademicYearResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteStudyPeriod(data) {
        return await api.post("main/study-period/delete", data)
            .then((response) => {
                deleteStudyPeriodResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchStudyPeriodData(data) {
        return await api.get("main/study-period/info?study_period_number="+data)
            .then((response) => {
                studyPeriodDataResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newStudyPeriodGroupName(data) {
        return await api.post("main/study-period/names", data)
            .then((response) => {
                newStudyPeriodGroupNameResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchStudyPeriodGroupName(data) {
        return await api.get("main/study-period/names?school_number="+data)
            .then((response) => {
                studyPeriodGroupNameResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteStudyPeriodGroupName(data) {
        return await api.delete("main/study-period/names/"+data.study_name_number)
            .then((response) => {
                deleteStudyPeriodGroupNameResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    
    async function editStudyPeriodGroupName(data) {
        return await api.put("main/study-period/names", data)
            .then((response) => {
                editStudyPeriodGroupNameResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        newStudyPeriodResponse,
        academicYearResponse,
        studyPeriodResponse,
        deleteStudyPeriodResponse,
        studyPeriodByAcademicYearResponse,
        studyPeriodDataResponse,
        editStudyPeriodResponse,
        studyPeriodGroupNameResponse,
        newStudyPeriodGroupNameResponse,
        deleteStudyPeriodGroupNameResponse,
        editStudyPeriodGroupNameResponse,
        errorMessage,
        newStudyPeriod,
        fetchStudyPeriod,
        deleteStudyPeriod,
        fetchStudyPeriodByAcademicYear,
        fetchStudyPeriodData,
        editStudyPeriod,
        newStudyPeriodGroupName,
        fetchStudyPeriodGroupName,
        deleteStudyPeriodGroupName,
        editStudyPeriodGroupName
        
    }
})