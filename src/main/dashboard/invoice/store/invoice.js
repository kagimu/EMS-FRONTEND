import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useInvoiceStore = defineStore("invoice", () => {
    const newInvoiceResponse = ref(null)
    const errorMessage = ref(null)
    const invoiceResponse = ref(null)
    const invoiceResponseById = ref(null)
    const newInvoicePaymentResponse = ref(null)
    const invoiceUpdateResponse = ref(null)

    async function createNewInvoice(data) {
        return await api.post("main/invoices", data)
            .then((response) => {
                newInvoiceResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    
    async function fetchInvoice(data) {
        return await api.get("main/invoices")
            .then((response) => {
                invoiceResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchInvoiceId(invoiceId) {
        return await api.get("main/admissions/admission-offers/"+invoiceId)
            .then((response) => {
                invoiceResponseById.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    
    async function createInvoicePayment(data) {
        return await api.post("main/invoice-payments", data)
            .then((response) => {
                newInvoicePaymentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateInvoice(studentId,data) {
        return await api.put("main/invoices/"+studentId + "?payment_reference=",data)
            .then((response) => {
                invoiceUpdateResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
       invoiceResponse,
       fetchInvoice,
       invoiceResponseById,
       fetchInvoiceId,
       newInvoiceResponse,
       createInvoicePayment,
       createNewInvoice,
       newInvoicePaymentResponse,
       updateInvoice,
       invoiceUpdateResponse,
       newInvoiceResponse,
       errorMessage
    }
})