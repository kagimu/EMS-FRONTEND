import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useScopeStore = defineStore("scope", () => {
    let errorMessage = ref(null)
    let newScopeResponse = ref(null)
    let scopeResponse = ref(null)

        async function createNewScope(data) {
            return await api.post("main/settings/scopes", data)
                .then((response) => {
                    newScopeResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchScope() {
            return await api.get("main/settings/scopes")
                .then((response) => {
                    scopeResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }


    return {
     errorMessage,
     createNewScope,
     newScopeResponse,
     scopeResponse,
     fetchScope
    }
})