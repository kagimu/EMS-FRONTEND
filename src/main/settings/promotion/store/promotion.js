import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const usePromotionStore = defineStore("promotion", () => {
    let newPromotionSettingResponse = ref(null)
    let  PromotionSettingResponse= ref(null)
    let  deletePromotionSettingResponse= ref(null)
    let updatePromotionSettingResponse = ref(null)
    
    const errorMessage = ref(null)

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

    async function fetchPromotionSettingByCampusClass() {
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

    return {
        newPromotionSettingResponse,
        errorMessage,
        updatePromotionSetting,
        fetchPromotionSettingByCampusClass,
        deletePromotionSetting,
        PromotionSettingResponse,
        updatePromotionSettingResponse,
        deletePromotionSettingResponse,
        newPromotionSetting
    }
} )