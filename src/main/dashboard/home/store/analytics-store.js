import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAnalyticsStore = defineStore("Analytics", () => {
    const analyticsSummaryResponse = ref(null)
    const errorMessage = ref(null)



    async function fetchAnalyticsSummary(data) {
        return await api.get("main/statistics/summary")
            .then((response) => {
                if(response && response.data) {
                    analyticsSummaryResponse.value = response.data
                }
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    return {
        analyticsSummaryResponse,
        errorMessage,
        fetchAnalyticsSummary,
    }
})