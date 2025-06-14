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
    const admissionByFiltersResponse = ref(null)
    const admitStudentResponse = ref(null)
    const admissionByStudentResponse = ref(null)
    const directAdmitStudentResponse = ref(null)
    const admissionLetterPhraseResponse = ref()

    async function newStudentDetailsAdmission(data) {
        return await api.post("main/new-student-details-admission", data)
            .then((response) => {
                newStudentDetailsAdmissionResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
// ("main/admissions?school_number="+school_number+"&campus_number="+campus_number+"&campus_class_number="+campus_class_number+"&stream_number="+stream_number+"&academic_year_number="+academic_year_number+"&study_period_number="+study_period_number)

    async function fetchAdmissionByFilters(data) {
        return await api.get("main/admissions?page="+data.page+"&per_page="+ data.per_page+"&school_number="+data.school_number+"&campus_number="+data.campus_number+"&campus_class_number="+data.campus_class_number+"&stream_number="+data.stream_number+"&academic_year_number="+data.academic_year_number+"&study_period_number="+data.study_period_number
            +"&class_number="+data.class_number
        )
            .then((response) => {
                admissionByFiltersResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function admitStudent(data) {
        return await api.post("main/admissions",data)
            .then((response) => {
                admitStudentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function directAdmitStudent(data) {
        return await api.post("main/admissions/existing-admission",data)
            .then((response) => {
                directAdmitStudentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAdmissionByStudentId(student_number) {
        return await api.get("main/admissions/"+student_number)
            .then((response) => {
                admissionByStudentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function admissionLetterPhrase(data) {
        return await api.post("main/admissions/templates/new",data)
            .then((response) => {
                admissionLetterPhraseResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
        admissionByFiltersResponse,
        fetchAdmissionByFilters,
        admitStudentResponse,
        admitStudent,
        admissionByStudentResponse,
        fetchAdmissionByStudentId  ,
        directAdmitStudentResponse,
        directAdmitStudent,
        admissionLetterPhrase,
        admissionLetterPhraseResponse
    }
})