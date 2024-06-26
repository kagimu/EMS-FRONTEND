import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useUserStore = defineStore("users", () => {
    let newUserResponse = ref(null)
    let errorMessage = ref(null)
    let userListResponse = ref(null)
    let deleteUserResponse = ref(null)
    let updateUserResponse = ref(null)
    let narrativeReportResponse = ref(null)
    let userResponse = ref(null)

        async function createNewUser(data) {
            return await api.post("main/users", data)
                .then((response) => {
                    newUserResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchNarrativeReport(data) {
            return await api.get("main/report-settings/narrative", data)
                .then((response) => {
                    narrativeReportResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchUsersList() {
            return await api.get("main/settings")
                .then((response) => {
                userListResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
    
        async function deleteUser(userId) {
            return await api.delete("main/"+userId)
                .then((response) => {
                    deleteUserResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }
        async function updateUsers(userid,data) {
            return await api.put("main/"+userid,data)
                .then((response) => {
                    updateUserResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }


    return {
     errorMessage,
     userListResponse,
     userResponse,
     newUserResponse,
     deleteUserResponse,
     updateUserResponse,
     narrativeReportResponse,
     fetchNarrativeReport,
     createNewUser,
     fetchUsersList,
     deleteUser,
     updateUsers
  
    }
})