import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useBillStore = defineStore("billStore", () => {
    let newBillableResponse = ref(null)
    let deleteBillableResponse = ref(null)
    const errorMessage = ref(null)
    const billableResponse = ref(null)
    const updateBillableResponse = ref(null)
    const billableDetailsResponse = ref(null)
    const billableDeterminateResponse = ref(null)

    async function newBillable(data) {
        return await api.post("main/invoices/billable", data)
            .then((response) => {
                newBillableResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

 

    async function deleteBillable(id) {
        return await api.delete("main/invoices/billable"+id)
            .then((response) => {
                deleteBillableResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function editBillable(data) {
        return await api.put("main/invoices/billable", data)
            .then((response) => {
                updateBillableResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchBillable(data) {
         let  school_number = data.school_number ?? ""
        return await api.get("main/invoices/billable?school_number="+school_number)
            .then((response) => {
                billableResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    // main/invoices/billable/details?billable_number=cd

    
    async function fetchBillableDetails(data) {
        let  billable_number = data.billable_number ?? ""
       return await api.get("main/invoices/billable/details?billable_number="+billable_number)
           .then((response) => {
               billableDetailsResponse.value = response.data
           })
           .catch((error) => {
               if(error && error.response){
                   errorMessage.value = error.response.data
               }
           })
   }

   async function fetchDeterminateBillables(data) {
    let  student_number = data.student_number ?? ""
    let  study_period_number = data.study_period_number ?? ""
    let  class_number = data.class_number ?? ""
    let  mode_of_study_number = data.mode_of_study_number ?? ""
    let curriculum_number = data.curriculum_number ?? ""
      let campus_curriculum_number = data.campus_curriculum_number ?? ""
    let campus_number = data.campus_number ?? ""
   return await api.get("main/invoices/billable/determine?student_number="+student_number+"&study_period_number="+study_period_number+"&class_number="+class_number+"&mode_of_study_number="+mode_of_study_number+"&curriculum_number="+curriculum_number+"&campus_number="+campus_number+"&campus_curriculum_number="+campus_curriculum_number)
       .then((response) => {
           billableDeterminateResponse.value = response.data
       })
       .catch((error) => {
           if(error && error.response){
               errorMessage.value = error.response.data
           }
       })
}

    return {
        newBillableResponse,
        updateBillableResponse,
        billableResponse,
        deleteBillableResponse,
        billableDetailsResponse,
        billableDeterminateResponse,
        errorMessage,
        newBillable,
        fetchBillable,
        editBillable,
        deleteBillable,
        fetchBillableDetails,
        fetchDeterminateBillables
    }
})