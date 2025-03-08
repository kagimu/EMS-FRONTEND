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
                    if(response && response.response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchNarrativeReport(data) {
                    let student_number = data?.student_number ?? ""
                    let assessment_area_number = data?.assessment_area_number ?? ""
                    let study_period_number = data?.study_period_number ?? ""
                    let campus_class_number = data?.campus_class_number ?? ""
                    let academic_year_number = data?.academic_year_number ?? ""
                    let start_date = data?.start_date ?? ""
                    let end_date = data?.end_date ?? ""

            return await api.get("main/report-settings/narrative?student_number="+student_number+
                    "&assessment_area_number="+assessment_area_number+
                    "&study_period_number="+study_period_number+
                    "&campus_class_number="+campus_class_number+
                    "&academic_year_number="+academic_year_number+
                    "&start_date="+start_date+
                    "&end_date="+end_date
                )
                .then((response) => {
                    narrativeReportResponse.value = response.data
                })
                .catch((response) => {
                    if(response && response.response){
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
                    if(response && response.response){
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
                    if(response && response.response){
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
                    if(response && response.response){
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