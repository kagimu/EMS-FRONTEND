import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTeacherCommentStore = defineStore("teacherComment", () => {
    let newTeacherCommentResponse = ref(null)
    let  teacherCommentResponse= ref(null)
    const errorMessage = ref(null)
    const newCommentFromTeacherResponse = ref(null)
    const newOverallRemarkFromTeacherResponse = ref(null)
    const commentFromTeachersResponse = ref(null)
    let deleteHeadTeacherCommentResponse = ref(null);

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
        return await api.get("main/report-settings/head-teachers-comments")
            .then((response) => {
                teacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }
 
    async function newCommentFromTeacher(data) {
        return await api.post("main/report-settings/add-teacher-comment", data)
            .then((response) => {
                newCommentFromTeacherResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newOverallRemarkFromTeacher(data) {
        return await api.post("main/report-settings/add-teacher-overall-remark", data)
            .then((response) => {
                newOverallRemarkFromTeacherResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchCommentsFromTeachers() {
        return await api.get("main/report-settings/teachers-comments")
            .then((response) => {
                commentFromTeachersResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteHeadTeacherComment(data) {
        return await api.delete("main/report-settings/head-teacher-comment/"+data.id)
            .then((response) => {
            deleteHeadTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    return {
        errorMessage,
        teacherCommentResponse,
        newTeacherCommentResponse,
        newCommentFromTeacherResponse,
        commentFromTeachersResponse,
        newOverallRemarkFromTeacherResponse,
        deleteHeadTeacherCommentResponse,
        fetchTeacherComments,
        newTeacherComment,
        newCommentFromTeacher,
        deleteHeadTeacherComment,
        newOverallRemarkFromTeacher

    }
} )