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
    let previousSchoolResultresponse = ref(null)
    let updateParentPersonalDetailsresponse = ref(null)
    let updateLearnerPersonalDetailsresponse = ref(null)
    let updatePreviousSchoolresponse = ref(null)
    let previousSchoolResultsByStudentResponse = ref(null)
    let previousSchoolResultsAllResponse = ref(null)
    let studentDataResponse = ref(null)
    let submitApplicationResponse = ref(null)
    let interviewListByIdResponse = ref(null)
    let updateInterviewResponse = ref(null)
    let interviewDeleteByIdResponse = ref(null)
    let deleteApplicationResponse = ref(null)

    async function newApplicationDetails(data) {
        return await api.post("main/applications/new-parent", data)
            .then((response) => {
                if(response?.data?.data){
                    let draft = response.data.data
                    localStorage.setItem("application-id", draft.application_number)
                    newApplicationDetailsResponse.value = draft
                }


            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function updateParentDetails(applicationId,data) {
        return await api.put("main/applications/parents/"+applicationId, data)
            .then((response) => {
                updateParentPersonalDetailsresponse.value = response.data.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    // {{baseUrl}}/applications/students/{{STUDENT_APN}}
    async function updateLearnerDetails(student_id,data) {
        return await api.put("main/applications/students/"+student_id, data)
            .then((response) => {
                updateLearnerPersonalDetailsresponse.value = response.data.data

            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updatePreviousSchools(applicationId,data) {
        return await api.put("main/applications/"+applicationId+"/previous-schools", data)
            .then((response) => {
                updatePreviousSchoolresponse.value = response.data.data

            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchApplicationList(data) {
        let page = data?.page ?? "1"
        let per_page = data?.per_page ?? "15"
        let status = data?.status ?? ""
        let school_number = data?.school_number ?? ""
        let campus_number = data?.campus_number ?? ""
        let curriculum_number = data?.curriculum_number ?? ""
        let campus_class_number = data?.campus_class_number ?? ""
        let level_number = data?.level_number ?? ""
        return await api.get("main/applications/all?page="+page+"&per_page="+per_page+"&status="+status+
            "&school_number="+school_number+"&campus_number="+campus_number+"&curriculum_number="+curriculum_number+
            "&campus_class_number="+campus_class_number+"&level_number="+level_number)
            .then((response) => {
                applicationListResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchInterviewList(data) {
        let campus_class_number = data?.campus_class_number ?? ""
        return await api.get("main/interviews/all?campus_class_number="+campus_class_number)
            .then((response) => {
                interviewListResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

     async function fetchInterviewListById(data) {
        let interview_number = data?.interview_number ?? ""
        let campus_class_number = data?.campus_class_number ?? ""
        return await api.get("main/interviews/details?interview_number="+interview_number+"&campus_class_number="+campus_class_number)
            .then((response) => {
                interviewListByIdResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateInterview(data) {
        return await api.put("main/interviews", data)
            .then((response) => {
                updateInterviewResponse.value = response.data

            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteInterviewList(data) {
        let interview_number = data?.interview_number ?? ""
        return await api.delete("main/interviews/delete/"+interview_number)
            .then((response) => {
                interviewDeleteByIdResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
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

        // main/interviews/"+interview_number+"/students?assessment_metric_number="+assessment_metric_number
        // https://wholesome-api.noregrets.ug/main/interviews/students-by-interview/?interview_number=7f7ab8ff-dc31-40e8-9b85-e73f6bae9f9d&assessment_metric_number=0f1a614d-171a-4fbf-8943-2d1db3a3c416
        async function fetchStudentsOnInterview(data) {
            let  interview_number =   data?.interview_number ?? ""
            let assessment_metric_number = data?.assessment_metric_number ?? ""
          
            return await api.get("main/interviews/students-by-interview?interview_number="+interview_number+"&assessment_metric_number="+assessment_metric_number)
                .then((response) => {
                    StudentsOnInterviewResponse.value = response.data
                })
                .catch((response) => {
                    if(response && response.response){
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
                    if(response && response.response){
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

              

         async function createPreviousSchoolResults(data) {
            return await api.post("main/previous-school-results", data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        
                .then((response) => {
                    previousSchoolResultresponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

     
    async function fetchPreviousSchoolResultsByStudent(studentNumber) {
        return await api.get("main/previous-school-results?student_number="+studentNumber)
            .then((response) => {
                previousSchoolResultsByStudentResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    // previous-school-results/all
    async function fetchPreviousSchoolResultsAll() {
        return await api.get("main/previous-school-results/all")
            .then((response) => {
                previousSchoolResultsAllResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    // main/applications/students/:student_number
    async function fetchStudent(studentN) {
        return await api.get("main/applications/students/"+studentN) 
            .then((response) => {
                studentDataResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function submitApplicationData(applicationNumber) {
        return await api.post("main/applications/submit-application/"+applicationNumber)
            .then((response) => {
                submitApplicationResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteApplication(data) {
        return await api.delete("main/applications/"+data.application_number)
            .then((response) => {
                deleteApplicationResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



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
        previousSchoolResultresponse,
        createPreviousSchoolResults,
        updateParentDetails,
        updateParentPersonalDetailsresponse,
        updateLearnerPersonalDetailsresponse,
        updateLearnerDetails,
        updatePreviousSchoolresponse,
        updatePreviousSchools,
        previousSchoolResultsByStudentResponse,
        fetchPreviousSchoolResultsByStudent,
        previousSchoolResultsAllResponse,
        fetchPreviousSchoolResultsAll,
        studentDataResponse,
        fetchStudent,
        submitApplicationData,
        submitApplicationResponse,
        fetchInterviewListById,
        interviewListByIdResponse,
        updateInterview,
        updateInterviewResponse,
        deleteInterviewList,
        interviewDeleteByIdResponse,
        deleteApplicationResponse,
        deleteApplication
    }
})