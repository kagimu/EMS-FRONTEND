import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAccountStore = defineStore("account", () => {
    let newAccountResponse = ref(null)
    let errorMessage = ref(null)
    let accountListResponse = ref(null)
    let deleteAccountResponse = ref(null)
    let updateAccountResponse = ref(null)
    let removeRoleResponse = ref(null)


        async function createNewAccount(data) {
            return await api.post("main/settings/roles/assign", data)
                .then((response) => {
                    newAccountResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchAccountList() {
            return await api.get("main/settings")
                .then((response) => {
                accountListResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
    
        async function deleteAccount(accountid) {
            return await api.delete("main/settings"+accountid)
                .then((response) => {
                    deleteAccountResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }
        async function updateAccount(accountid,data) {
            return await api.put("main/settings/"+accountid,data)
                .then((response) => {
                    updateAccountResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }


        async function removeAccountRole(accountid) {
            return await api.delete("main/settings"+accountid)
                .then((response) => {
                    removeRoleResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }

     

    return {
     errorMessage,
     createNewAccount,
     accountListResponse,
     newAccountResponse,
     removeRoleResponse,
     deleteAccountResponse,
     updateAccountResponse,
     fetchAccountList,
     deleteAccount,
     updateAccount,
     removeAccountRole
    }
})