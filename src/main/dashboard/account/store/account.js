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
    let userResponse = ref(null)
    let userAllResponse = ref(null)


        async function createNewAccount(data) {
            return await api.put("main/settings/roles/assign", data)
                .then((response) => {
                    newAccountResponse.value = response.data
                })
                .catch((response) => {
                    if(response && response.response){
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
                    if(response && response.response){
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
                    if(response && response.response){
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
                    if(response && response.response){
                        errorMessage.value = response.data
                    }
                })
        }


        async function removeAccountRole(data) {
            return await api.post("main/settings/roles/remove",data)
                .then((response) => {
                    removeRoleResponse.value = response.data
                })
                .catch((response) => {
                    if(response && response.response){
                        errorMessage.value = response.response.data
                    }
                })
        }

     
        async function fetchUsersToAssign(data) {
            return await api.get("main/users?page="+data?.page+
                    "&per_page="+ data?.per_page+
                    "&search="+data?.search+
                    "&entity_number="+data?.entity_number
                )
                .then((response) => {
                userResponse.value = response.data
                })
                .catch((response) => {
                    if(response && response.response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchAllUsers(data) {
            return await api.get("main/users/all")
                .then((response) => {
                userAllResponse.value = response.data
                })
                .catch((response) => {
                    if(response && response.response){
                        errorMessage.value = response.response.data
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
     removeAccountRole,
     userResponse,
     fetchUsersToAssign,
     fetchAllUsers,
     userAllResponse
    }
})