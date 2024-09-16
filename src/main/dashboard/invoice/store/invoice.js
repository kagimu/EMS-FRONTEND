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
    const editUpdateResponse = ref(null)
    const deleteInvoiceResponse = ref(null)
    const cancelInvoiceResponse = ref(null)
    const cancelInvoicePaymentResponse = ref(null)
    const deleteInvoicePaymentResponse = ref(null)
    const statementsResponse = ref(null)

    async function createNewInvoice(data) {
        return await api.post("main/invoices", data)
            .then((response) => {
                newInvoiceResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    
    async function fetchInvoice(data) {
        let  school_number =   data?.school_number ?? ""
        let  campus_number =   data?.campus_number ?? ""
        let  status =   data?.status ?? ""
        let  user_number =   data?.user_number ?? ""
        let  start_date =    data?.start_date ?? ""
        let  end_date =    data?.end_date ?? ""
        let  items =    data?.items ?? ""
        return await api.get("main/invoices" +
                "?school_number="+school_number+
                "&campus_number="+campus_number+
                "&user_number="+user_number+
                "&start_date="+start_date+
                "&end_date="+end_date+
                "&status="+status+
                "&items="+items
            )
            .then((response) => {
                invoiceResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

//     invoices/update [POST]
// invoices/cancel?invoice_number=xyz [POST]
// invoices/delete?invoice_number=xyz [POST] 

// invoices/payments/delete?payment_number=xyz [POST]
// invoices/payments/cancel?payment_number=xyz [POST]

    async function updateInvoiceDetails(data) {
        return await api.post("main/invoices/update",data)
            .then((response) => {
                editUpdateResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function deleteInvoice(invoice_number) {
        return await api.post("main/invoices/delete?invoice_number="+invoice_number)
            .then((response) => {
                deleteInvoiceResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function cancelInvoice(invoice_number) {
        return await api.post("main/invoices/cancel?invoice_number="+invoice_number)
            .then((response) => {
                cancelInvoiceResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function cancelInvoicePayment(payment_number) {
        return await api.post("main/invoices/payments/cancel?payment_number="+payment_number)
            .then((response) => {
                cancelInvoicePaymentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteInvoicePayment(payment_number) {
        return await api.post("main/invoices/payments/delete?payment_number="+payment_number)
            .then((response) => {
                deleteInvoicePaymentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchStatements(data) {
        return await api.get("main/invoices/payments/statements?user_number="+data?.user_number+"&start_date="+data.start_date+"&end_date="+data.end_date)
            .then((response) => {
                statementsResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
       fetchFinancialSummary,
       editUpdateResponse,
       updateInvoiceDetails,
       deleteInvoiceResponse,
       deleteInvoice,
       cancelInvoiceResponse,
       cancelInvoice,
       cancelInvoicePaymentResponse,
       cancelInvoicePayment,
       deleteInvoicePaymentResponse,
       deleteInvoicePayment,
       fetchStatements,
       statementsResponse
    }
})