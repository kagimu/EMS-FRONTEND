import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const usePromotionStore = defineStore("promotion", () => {
    let newPromotionSettingResponse = ref(null)
    let  PromotionSettingResponse= ref(null)
    let  deletePromotionSettingResponse= ref(null)
    let updatePromotionSettingResponse = ref(null)
    let promotionSettingValueResponse = ref(null)
    let  newPromotionSettingValueResponse = ref(null)  
    let newPromotionsResponse = ref(null)
    let promotionByCampusClassNumberResponse = ref(null)
    const errorMessage = ref(null)
    let promotionsResponse = ref(null)

    async function newPromotionSetting(data) {
        return await api.post("main/promotions/settings", data)
            .then((response) => {
                newPromotionSettingResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotionSetting() {
        return await api.get("main/promotions/settings")
            .then((response) => {
                PromotionSettingResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function deletePromotionSetting() {
        return await api.delete("main")
            .then((response) => {
                deletePromotionSettingResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function updatePromotionSetting(PromotionSettingId,data) {
        return await api.put("main/"+PromotionSettingId,data)
            .then((response) => {
                updatePromotionSettingResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    // promotions/settings-values
    async function newPromotionSettingValue(data) {
        return await api.post("main/promotions/settings-values", data)
            .then((response) => {
                newPromotionSettingValueResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotionSettingValue() {
        return await api.get("main/promotions/settings-values")
            .then((response) => {
                promotionSettingValueResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newPromotion(data) {
        return await api.post("main/promotions", data)
            .then((response) => {
                newPromotionsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotionByCampusClassNumber(campus_class_number) {
        return await api.get("main/promotions?campus_class_number="+campus_class_number)
            .then((response) => {
                promotionByCampusClassNumberResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotions() {
        return await api.get("main/promotions")
            .then((response) => {
                promotionsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        newPromotionSettingResponse,
        errorMessage,
        updatePromotionSetting,
        deletePromotionSetting,
        PromotionSettingResponse,
        updatePromotionSettingResponse,
        deletePromotionSettingResponse,
        newPromotionSetting,
        promotionSettingValueResponse,
        PromotionSettingResponse,
        fetchPromotionSetting,
        fetchPromotionSettingValue,
        newPromotionSettingValue,
        newPromotionSettingValueResponse,
        newPromotionSettingResponse,
        newPromotion,
        promotionByCampusClassNumberResponse,
        fetchPromotionByCampusClassNumber,
        newPromotionsResponse,
        promotionsResponse,
        fetchPromotions
    }
} )