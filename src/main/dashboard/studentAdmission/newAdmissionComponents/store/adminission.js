import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAdmissionStore = defineStore("admission", () => {
    let newStudentDetailsAdmissionResponse = ref(null)
    const errorMessage = ref(null)


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
    }
})