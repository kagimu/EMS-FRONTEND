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
    let promotedStudentsResponse = ref(null)
    let promotionSettingDetailsResponse = ref(null)
    let promotionSettingGradesResponse = ref(null)
    

    async function newPromotionSetting(data) {
        return await api.post("main/promotions/settings", data)
            .then((response) => {
                newPromotionSettingResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    //  async function updatePromotionSetting(data) {
    //     return await api.put("main/promotions/settings", data)
    //         .then((response) => {
    //             updatePromotionSettingResponse.value = response.data
    //         })
    //         .catch((response) => {
    //             if(response && response.response){
    //                 errorMessage.value = response.response.data
    //             }
    //         })
    // }

    async function fetchPromotionSetting(data) {
        return await api.get("main/promotions/settings?study_period_number="+data?.study_period_number)
            .then((response) => {
                PromotionSettingResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function updatePromotionSetting(data) {
        return await api.put("main/promotions/settings/"+data.promotion_settings_number, data)    
            .then((response) => {
                updatePromotionSettingResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotionSettingValue(promotion_setting_number) {
        return await api.get("main/promotions/settings-values?promotion_setting_number=" + (promotion_setting_number ?  promotion_setting_number : ""))
            .then((response) => {
                promotionSettingValueResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotionSettingDetails(promotion_setting_number) {
        return await api.get("main/promotions/settings/details?promotion_setting_number="+promotion_setting_number)
            .then((response) => {
                promotionSettingDetailsResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotionSettingGrades(promotion_setting_number) {
        return await api.get("main/promotions/settings/grades?promotion_setting_number="+promotion_setting_number)
            .then((response) => {
                promotionSettingGradesResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchPromotedStudents() {
        return await api.get("main/promotions/promotedStudents")
            .then((response) => {
                promotedStudentsResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        newPromotionSettingResponse,
        errorMessage,
        PromotionSettingResponse,
        updatePromotionSettingResponse,
        deletePromotionSettingResponse,
        promotionSettingValueResponse,
        newPromotionSettingValueResponse,
        promotionByCampusClassNumberResponse,
        newPromotionsResponse,
        promotionsResponse,
        promotedStudentsResponse,
        promotionSettingDetailsResponse,
        promotionSettingGradesResponse,
        newPromotionSetting,
        fetchPromotionSetting,
        fetchPromotionSettingValue,
        newPromotionSettingValue,
        newPromotion,
        fetchPromotionByCampusClassNumber,
        fetchPromotions,
        fetchPromotedStudents,
        fetchPromotionSettingDetails,
        fetchPromotionSettingGrades,
        updatePromotionSettingResponse,
        updatePromotionSetting
    }
} )