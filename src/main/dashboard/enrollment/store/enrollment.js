import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useEnrolmentStore = defineStore("enrolment", () => {
    let newsEnrolmentResponse = ref(null)
    let  enrolmentResponse= ref(null)
    let checkListItemsResponse = ref(null)
    
    const errorMessage = ref(null)

    async function newEnrolment(data) {
        return await api.post("main/enrollment", data)
            .then((response) => {
                newsEnrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchEnrolment(school_number,campus_class_number,stream_number,campus_number,study_period_number) {
        return await api.get("main/enrollment?school_number="+school_number+"&campus_number="+campus_number+"&campus_class_number="+campus_class_number+"&stream_number="+stream_number+"&study_period_number="+study_period_number)
            .then((response) => {
                enrolmentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
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
                if(response){
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
        fetchCheckListItems
    }
} )