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


/*    async function fetchSchemeOfWorkByClass(data) {
        return await api.get("main/fetch-scheme-of-work-by-class-and-subject?class_number="+data.class_number+"&subject_number="+data.subject_number)
            .then((response) => {
                schemeOfWorkByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }*/



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
        fetchAdmissionOfferByAdmissionId
        
    }
})