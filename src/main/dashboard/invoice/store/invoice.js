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
    const financialSummaryResponseById = ref(null)

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
        let  school_number =   data?.school_number ?? ""
        let  campus_number =   data?.campus_number ?? ""
        let  status =   data?.status ?? ""
        let  user_number =   data?.user_number ?? ""
        return await api.get("main/invoices?school_number="+school_number+"&campus_number="+campus_number+"&user_number="+user_number+"&status="+status)
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
        return await api.get("main/invoices/details?ref_number="+invoiceId)
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
        return await api.post("main/invoices/pay", data)
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

    async function fetchFinancialSummary(userN) {
        return await api.get("main/invoices/financial-summary?user_number="+userN)
            .then((response) => {
                financialSummaryResponseById.value = response.data
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
       errorMessage,
       financialSummaryResponseById,
       fetchFinancialSummary
    }
})