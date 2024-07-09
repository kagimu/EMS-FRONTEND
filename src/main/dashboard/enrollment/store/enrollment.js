import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useEnrolmentStore = defineStore("enrolment", () => {
    let newsEnrolmentResponse = ref(null)
    let  enrolmentResponse= ref(null)
    let checkListItemsResponse = ref(null)
    let terminateEnrolmentResponse = ref(null)
    let reEnrolmentResponse = ref(null)
    
    const errorMessage = ref(null)

    async function newEnrolment(data) {
        return await api.post("main/enrollment", data)
            .then((response) => {
                newsEnrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

// "main/admissions?page="+data.page+"&per_page="+ data.per_page+"&school_number="+data.school_number+"&campus_number="+data.campus_number+"&campus_class_number="+data.campus_class_number+"&stream_number="+data.stream_number+"&academic_year_number="+data.academic_year_number+"&study_period_number="+data.study_period_number)
    async function fetchEnrolment(data) {
        return await api.get("main/enrollment?page="+data?.page+"&per_page="+ data?.per_page+"&school_number="+data?.school_number+"&campus_number="+data?.campus_number+"&campus_class_number="+data?.campus_class_number+"&stream_number="+data?.stream_number+"&academic_year_number="+data?.academic_year_number+"&study_period_number="+data?.study_period_number+"&status="+data?.status)
            .then((response) => {
                enrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCheckListItems(admissionN) {
        return await api.get("main/admissions/items/"+admissionN)
            .then((response) => {
                checkListItemsResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    
    async function terminateEnrollment(student) {
        return await api.post("main/enrollment/terminate-student/"+student)
            .then((response) => {
                terminateEnrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function reEnrollment(student) {
        return await api.post("main/enrollment/re-enroll-student/"+student)
            .then((response) => {
                reEnrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        newEnrolment,
        fetchEnrolment,
        errorMessage,
        newsEnrolmentResponse,
        enrolmentResponse,
        checkListItemsResponse,
        fetchCheckListItems,
        terminateEnrollment,
        terminateEnrolmentResponse,
        reEnrolmentResponse,
        reEnrollment
    }
} )