import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTransactionStore = defineStore("transaction", () => {
    let  transactionResponse= ref(null)
    const errorMessage = ref(null)

    async function fetchTransactions(schoolN,userN) {
        return await api.get("main/invoices/payments?school_number="+schoolN+"&user_number="+userN)
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