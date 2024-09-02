import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const usePrintStore = defineStore("print", () => {
    let printResponse = ref(null)
    let errorMessage = ref(null)

    async function printReport(data) {
        return await api.post("main/statistics/print",data)
            .then((response) => {
                printResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    return {
        printReport,
        printResponse,
        errorMessage
    }
})