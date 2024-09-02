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
            let start_date = data?.start_date ?? ""
            let end_date = data?.end_date ?? ""

        return await api.get("main/invoices/payments" +
                "?school_number="+school_number+
                "&campus_number="+campus_number+
                "&user_number="+userNumber+
                "&start_date="+start_date+
                "&end_date="+end_date
            )
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