import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTeacherCommentStore = defineStore("teacherComment", () => {
    let newTeacherCommentResponse = ref(null)
    let  teacherCommentResponse= ref(null)
    const errorMessage = ref(null)

    async function newTeacherComment(data) {
        return await api.post("main/report-settings/add-head-teachers-comment/"+data.report_setting_number, data)
            .then((response) => {
                newTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchTeacherComments() {
        return await api.get("main/report-settings/head-teachers-comment")
            .then((response) => {
                teacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }
 


    return {
        errorMessage,
        fetchTeacherComments,
        newTeacherComment,
        teacherCommentResponse,
        newTeacherCommentResponse
      
    }
} )