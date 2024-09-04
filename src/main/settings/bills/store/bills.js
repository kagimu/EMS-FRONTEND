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
        return await api.post("main/invoices/billable", data)
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

    return {
        newBillableResponse,
        updateBillableResponse,
        billableResponse,
        deleteBillableResponse,
        billableDetailsResponse,
        errorMessage,
        newBillable,
        fetchBillable,
        editBillable,
        deleteBillable,
        fetchBillableDetails
    }
})