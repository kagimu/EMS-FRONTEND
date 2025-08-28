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
    const newSubjectTeacherCommentResponse = ref(null)
    const newClassTeacherCommentResponse = ref(null)
    const classTeacherCommentResponse = ref(null)
    const subjectTeacherCommentResponse = ref(null)
    const deleteSubjectTeacherCommentResponse = ref(null)
    const deleteClassTeacherCommentResponse = ref(null)
    const updateSubjectTeacherCommentResponse = ref(null)
    const updateClassTeacherCommentResponse = ref(null)
    const newSubjectRemarksFromTeacherResponse = ref(null)

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
        return await api.post("main/report-settings/learning-area-comments", data)
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

    async function newSubjectTeacherComment(data) {
        return await api.post("main/report-settings/subject-teacher-comment", data)
            .then((response) => {
                newSubjectTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newClassTeacherComment(data) {
        return await api.post("main/report-settings/class-teacher-comment", data)
            .then((response) => {
                newClassTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchClassTeacherComment() {
        return await api.get("main/report-settings/class-teacher-comment")
            .then((response) => {
                classTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchSubjectTeacherComment(data) {
        let campus_class_number = data.campus_class_number ?? ""
        return await api.get("main/report-settings/subject-teacher-comment?campus_class_number="+campus_class_number)
            .then((response) => {
                subjectTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteSubjectTeacherComment(data) {
        return await api.delete("main/report-settings/subject-teacher-comment/"+data.number)
            .then((response) => {
                deleteSubjectTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteClassTeacherComment(data) {
        return await api.delete("main/report-settings/class-teacher-comment/"+data.number)
            .then((response) => {
                deleteClassTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function updateSubjectTeacherComment(data) {
        return await api.post("main/report-settings/subject-teacher-comment/"+data.class_teacher_comment_number,data)
            .then((response) => {
                updateSubjectTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }
    async function updateClassTeacherComment(data) {
        return await api.post("main/report-settings/class-teacher-comment/"+data.class_teacher_comment_number,data)
            .then((response) => {
                updateClassTeacherCommentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newSubjectsRemarkFromTeacher(data) {
        return await api.post("main/report-settings/report-score-summary/update-comments", data)
            .then((response) => {
                newSubjectRemarksFromTeacherResponse.value = response.data
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
        newOverallRemarkFromTeacher,
        newSubjectTeacherCommentResponse,
        newSubjectTeacherComment,
        newClassTeacherComment,
        newClassTeacherCommentResponse,
        fetchClassTeacherComment,
        classTeacherCommentResponse,
        fetchSubjectTeacherComment,
        subjectTeacherCommentResponse,
        deleteSubjectTeacherComment,
        deleteSubjectTeacherCommentResponse,
        deleteClassTeacherCommentResponse,
        deleteClassTeacherComment,
        updateSubjectTeacherCommentResponse,
        updateSubjectTeacherComment,
        updateClassTeacherCommentResponse,
        updateClassTeacherComment,
        newSubjectRemarksFromTeacherResponse,
        newSubjectsRemarkFromTeacher,

    }
} )