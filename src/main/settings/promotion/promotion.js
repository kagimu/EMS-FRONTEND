import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const usePromotionStore = defineStore("promotion", () => {
    let newPromotionResponse = ref(null)
    let  promotionResponse= ref(null)
    let  deletePromotionResponse= ref(null)
    let updatePromotionResponse = ref(null)
    
    const errorMessage = ref(null)

    async function newPromotion(data) {
        return await api.post("main/promotion", data)
            .then((response) => {
                newPromotionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotionByCampusClass(campus_class_number) {
        return await api.get("main/promotions?campus_class_number="+campus_class_number)
            .then((response) => {
                promotionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function deletePromotion() {
        return await api.delete("main")
            .then((response) => {
                deletePromotionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function updatePromotion(promotionId,data) {
        return await api.put("main/"+promotionId,data)
            .then((response) => {
                updatePromotionResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        newPromotionResponse,
        errorMessage,
        updatePromotion,
        fetchPromotionByCampusClass,
        deletePromotion,
        promotionResponse,
        updatePromotionResponse,
        deletePromotionResponse,
        newPromotion
    }
} )