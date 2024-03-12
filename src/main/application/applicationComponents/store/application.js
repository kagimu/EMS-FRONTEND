import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useApplicationStore = defineStore("application", () => {
    let newApplicationDetailsResponse = ref(null)
    let newApplicationDetailsLearnerResponse = ref(null)
    let newApplicationPreviousSchoolsResponse = ref(null)
    let applicationListResponse = ref(null)
    let interviewListResponse = ref(null)
    let applicationByIdResponse = ref(null)
    let newNnterview = ref(null)
    let newInterviewResponse = ref(null)
    const errorMessage = ref(null)
    let  newInterviewQuestionsResponse = ref(null)
    let  interviewQuestionsResponse = ref(null)
    let  StudentsOnInterviewResponse = ref(null)
    let createInterviewGradeResponse = ref(null)
    let getInterviewQuestionsForGradingResponse = ref(null)
    let addStudentToInterviewResponse = ref(null)
    let QuestionsOnInterviewResponse = ref(null)
    let interviewResultsResponse = ref(null)
    let interviewResultesponse  = ref(null)
    let interviewDetails  = ref(null)

    async function newApplicationDetails(data) {
        return await api.post("main/applications/new-parent", data)
            .then((response) => {
                newApplicationDetailsResponse.value = response.data.data

            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newApplicationLeanerDetails(data) {
        return await api.post("main/applications/new-student", data)
            .then((response) => {
                newApplicationDetailsLearnerResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newApplicationPrevSchoolDetails(applicationId,data) {
        return await api.post("main/applications/"+applicationId+"/previous-schools", data)
            .then((response) => {
                newApplicationPreviousSchoolsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchApplicationList() {
        return await api.get("main/applications/all?page=1&limit=10")
            .then((response) => {
                applicationListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchInterviewList() {
        return await api.get("main/interviews/all")
            .then((response) => {
                interviewListResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchApplicationById(applicationId){
    return await api.get("main/applications/"+applicationId)
    .then((response) => {
        applicationByIdResponse.value = response.data
    })
    .catch((error) => {
        if(error){
            errorMessage.value = error.data
        } 
    } )
    }

    async function createNewInterview(data) {
        return await api.post("main/interviews", data)
            .then((response) => {
                newInterviewResponse.value = response.data

            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function addStudentToInterview(data) {
        return await api.post("main/interviews/add-student-to-interview", data)
            .then((response) => {
                addStudentToInterviewResponse.value = response.data

            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function createNewInterviewQuestion(data) {
        return await api.post("main/interview-questions", data)
            .then((response) => {
                newInterviewQuestionsResponse.value = response.data

            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchApplicationInterviewQuestions(applicationId){
        return await api.get("main/interview-questions")
        .then((response) => {
            interviewQuestionsResponse.value = response.data
        })
        .catch((error) => {
            if(error){
                errorMessage.value = error.data
            } 
        } )
        }

        async function fetchStudentsOnInterview(data) {
            return await api.get("main/interviews/"+data+"/students")
                .then((response) => {
                    StudentsOnInterviewResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }


        async function createInterviewGrade(data) {
            return await api.post("main/interview-grades/"+data)
                .then((response) => {
                    gradeStudentResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function getInterviewQuestionForGrading(data) {
            return await api.post("main/interview-grades/"+data)
                .then((response) => {
                     getInterviewQuestionsForGradingResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
     
        async function fetchQuestionsOnInterview(data) {
            return await api.get("main/interviews/"+data+"/questions")
                .then((response) => {
                   QuestionsOnInterviewResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
           
        async function fetchInterviewResultsAll(data) {
            return await api.get("main/interview-results/all")
                .then((response) => {
                   interviewResultsResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function createInterviewResults(studentId,data) {
            return await api.post("main/interview-results/"+studentId, data)
                .then((response) => {
                    interviewResultesponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function  fetchInterviewDetails(interviewNumber) {
            return await api.get("main/interviews/"+interviewNumber)
                .then((response) => {
                    interviewDetails.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
    }

        // async function createInterviewAssessments(data) {
        //     return await api.post("main/assessment-areas",data)
        //         .then((response) => {
        //             InterviewAssesmentAreasResponse.value = response.data
        //         })
        //         .catch((response) => {
        //             if(response){
        //                 errorMessage.value = response.response.data
        //             }
        //         })
        // }


        // async function fetchInterviewAssesment(data) {
        //     return await api.get("main/assessment-areas")
        //         .then((response) => {
        //            interviewAssesmentResultsResponse.value = response.data
        //         })
        //         .catch((response) => {
        //             if(response){
        //                 errorMessage.value = response.response.data
        //             }
        //         })
        // }

              
        

    return {
        newApplicationDetailsResponse ,
        errorMessage,
        newApplicationDetails,
        newApplicationLeanerDetails,
        newApplicationDetailsLearnerResponse,
        fetchApplicationList,
        applicationListResponse,
        fetchInterviewList,
        interviewListResponse,
        fetchApplicationById,
        applicationByIdResponse,
        newApplicationPrevSchoolDetails,
        newApplicationPreviousSchoolsResponse,
        newInterviewResponse,
        createNewInterview,
        newInterviewQuestionsResponse,
        createNewInterviewQuestion,
        interviewQuestionsResponse,
        fetchApplicationInterviewQuestions,
        StudentsOnInterviewResponse,
        fetchStudentsOnInterview,
        createInterviewGrade,
        createInterviewGradeResponse,
        getInterviewQuestionsForGradingResponse,
        getInterviewQuestionForGrading,
        addStudentToInterviewResponse,
        addStudentToInterview,
        QuestionsOnInterviewResponse,
        fetchQuestionsOnInterview,
        fetchInterviewResultsAll,
        interviewResultsResponse,
        interviewResultesponse,
        createInterviewResults ,
        fetchInterviewDetails,
        interviewDetails,
    }
})