import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTransactionStore = defineStore("transaction", () => {
    let  transactionResponse= ref(null)
    const errorMessage = ref(null)

    async function fetchTransactions(data) {
            let school_number = data?.school_number ?? ""
            let campus_number = data?.campus_number ?? ""
            let userNumber = data?.userNumber ?? ""
        return await api.get("main/invoices/payments?school_number="+school_number+"&campus_number="+campus_number+"&user_number="+userNumber)
            .then((response) => {
                transactionResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        transactionResponse,
        errorMessage,
        fetchTransactions
      
    }
} )