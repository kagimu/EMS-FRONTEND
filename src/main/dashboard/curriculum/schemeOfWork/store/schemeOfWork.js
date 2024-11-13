import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSchemeOfWorkStore = defineStore("schemeOfWork", () => {
    let newSchemeOfWorkResponse = ref(null)
    let updateSchemeOfWorkResponse = ref(null)
    let schemeOfWorkByClassResponse = ref(null)
    let exportPdfResponse = ref(null)
    let newLessonPlanResponse = ref(null)
    let conceptsBySubtopicResponse = ref(null)
    let references = ref([])
    let addReferenceResponse = ref(null)
    const errorMessage = ref(null)
    const lessonPlanResponse = ref(null)
    const importLessonPlanResponse = ref(null)
    const exportLessonPlanResponse = ref(null)
    const curriculumDeliveryResponse = ref(null)
    const classSessionResponse = ref(null)
    const classSessionStudentsResponse = ref(null)


    async function newSchemeOfWorkData(data) {
        return await api.post("main/new-scheme-of-work", data)
            .then((response) => {
                newSchemeOfWorkResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function updateSchemeOfWorkData(data) {
        return await api.post("main/update-scheme-of-work", data)
            .then((response) => {
                updateSchemeOfWorkResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function saveLessonPlan(data) {
        return await api.post("main/lesson-plan/new-lesson-Plan", data)
            .then((response) => {
                newLessonPlanResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function saveLessonPlanReference(data) {
        return await api.post("main/lesson-plan/add-reference", data)
            .then((response) => {
                addReferenceResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function fetchLessonPlanReferences(lessonPlanNumber) {
        return await api.get("main/lesson-plan/references/"+lessonPlanNumber)
            .then((response) => {
                references.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }




    async function fetchSchemeOfWorkByClass(data) {
        return await api.get("main/scheme-of-work/fetch-scheme-of-work-by-class-and-subject?class_number="+data.class_number+"&subject_number="+data.subject_number+"&academic_year_number="+data.academic_year_number)
            .then((response) => {
                schemeOfWorkByClassResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function exportPdf(data) {
        let fileName = data.fileName;
        data = {"html":data.html,"options":data.options};
        return await api.post("https://pdfgenerator.ursb.go.ug/html-pdf", data)
            .then((response) => {
                    if(response) {

                        if (navigator.userAgent.indexOf("Firefox") !== -1) {
                            // Firefox
                            window.open(response.data.pdf_b64, '_target')
                        } else {
                            let a = document.createElement("a");
                            a.href = response.data.pdf_b64;
                            a.setAttribute('download', fileName)
                            a.target = "_blank";
                            document.body.appendChild(a)
                            a.click();
                        }


                        exportPdfResponse.value = response
                    }
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }



    async function fetchConceptsBySubTopic(data) {
        return await api.get("main/fetch-concepts-by-subtopic?sub_topic_number="+data)
            .then((response) => {
                conceptsBySubtopicResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchLessonPlanDetails(data) {
        return await api.get("main/lesson-plan/fetch-lesson-plan?sub_topic_number="+data)
            .then((response) => {
                lessonPlanResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function importLessonPlan(data) {
        return await api.post("main/lesson-plan/import", data,{
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        )
            .then((response) => {
                importLessonPlanResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function exportLessonPlan(data) {
        return await api.get("main/lesson-plan/export-template/"+data.scheme_sub_topic_number+"?token="+data.token)
            .then((response) => {
                exportLessonPlanResponse.value = response.data
               
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newCurriculumDelivery(data) {
        return await api.post("main/curriculum-delivery/add-session", data)
            .then((response) => {
                curriculumDeliveryResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchClassSessions(data) {
        return await api.get("main/curriculum-delivery/sessions?page="+data?.page+"&per_page="+ data?.per_page+"&stream_number="+data.stream_number)
            .then((response) => {
                classSessionResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchStudentsInSession(data) {
        return await api.get("main/curriculum-delivery/students/"+data)
            .then((response) => {
                classSessionStudentsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    return {
        newSchemeOfWorkResponse,
        updateSchemeOfWorkResponse,
        schemeOfWorkByClassResponse,
        conceptsBySubtopicResponse,
        newLessonPlanResponse,
        exportPdfResponse,
        errorMessage,
        lessonPlanResponse,
        addReferenceResponse,
        importLessonPlanResponse,
        exportLessonPlan,
        newSchemeOfWorkData,
        fetchSchemeOfWorkByClass,
        updateSchemeOfWorkData,
        fetchConceptsBySubTopic,
        saveLessonPlan,
        saveLessonPlanReference,
        fetchLessonPlanDetails,
        exportPdf,
        importLessonPlan,
        newCurriculumDelivery,
        fetchClassSessions,
        curriculumDeliveryResponse,
        exportLessonPlanResponse,
        classSessionResponse,
        classSessionStudentsResponse,
        fetchStudentsInSession
    }
})