import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAdmissionStore = defineStore("admission", () => {
    const newStudentDetailsAdmissionResponse = ref(null)
    const errorMessage = ref(null)
    const admissionOffersResponse = ref(null)
    const newAdmissionOfferResponse = ref(null)
    const admissionOfferByStudentIdResponse = ref(null)
    const admissionOfferByAdmissionIdResponse = ref(null)
    const studentAssessmentResultsResponse = ref(null)
    const admissionByClassResponse = ref(null)
    const admitStudentResponse = ref(null)

    async function newStudentDetailsAdmission(data) {
        return await api.post("main/new-student-details-admission", data)
            .then((response) => {
                newStudentDetailsAdmissionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newAdmissionOffer(data) {
        return await api.post("main/admissions/admission-offers", data)
            .then((response) => {
                newAdmissionOfferResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    
    async function fetchAdmissionOffers(data) {
        return await api.get("main/admissions/admission-offers")
            .then((response) => {
                admissionOffersResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAdmissionOfferByStudentId(studentId) {
        return await api.get("main/admissions/admission-offers/"+studentId)
            .then((response) => {
                admissionOfferByStudentIdResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAdmissionOfferByAdmissionId(admissionId) {
        return await api.get("main/admissions/admission-offer/"+admissionId)
            .then((response) => {
                admissionOfferByAdmissionIdResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchStudentInterviewAssessmentResults(studNo,interviewNumber) {
        return await api.get("main/interviews/student-interview-assessment-results?student_number="+studNo+"&interview_number="+interviewNumber)
            .then((response) => {
                studentAssessmentResultsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAdmissionByClass(class_number) {
        return await api.get("main/admissions?class_number="+class_number)
            .then((response) => {
                admissionByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    // async function admitStudent(studentNumber,class_number,campus_number,stream_number,study_period_number,interview_number) {
    //     return await api.post("main/admissions?student_number="+studentNumber+"&class_number="+class_number+"&campus_number="+campus_number+"&stream_number="+stream_number+"&study_period_number="+study_period_number+"&interview_number="+interview_number)
    //         .then((response) => {
    //             admitStudentResponse.value = response.data
    //         })
    //         .catch((response) => {
    //             if(response){
    //                 errorMessage.value = response.response.data
    //             }
    //         })
    // }

    async function admitStudent(data) {
        return await api.post("main/admissions",data)
            .then((response) => {
                admitStudentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }






    return {
        newStudentDetailsAdmissionResponse,
        errorMessage,
        newStudentDetailsAdmission,
        admissionOffersResponse,
        fetchAdmissionOffers,
        newAdmissionOfferResponse,
        newAdmissionOffer,
        admissionOfferByStudentIdResponse,
        fetchAdmissionOfferByStudentId,
        admissionOfferByAdmissionIdResponse,
        fetchAdmissionOfferByAdmissionId,
        studentAssessmentResultsResponse,
        fetchStudentInterviewAssessmentResults,
        admissionByClassResponse,
        fetchAdmissionByClass,
        admitStudentResponse,
        admitStudent
        
    }
})