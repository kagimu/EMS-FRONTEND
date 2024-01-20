import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSchemeOfWorkStore = defineStore("schemeOfWork", () => {
    let newSchemeOfWorkResponse = ref(null)
    let updateSchemeOfWorkResponse = ref(null)
    let schemeOfWorkByClassResponse = ref(null)
    let exportSchemeOfWorkPdfByClassResponse = ref(null)
    let newLessonPlanResponse = ref(null)
    let conceptsBySubtopicResponse = ref(null)
    let references = ref([])
    let addReferenceResponse = ref(null)
    const errorMessage = ref(null)
    const lessonPlanResponse = ref(null)


    async function newSchemeOfWorkData(data) {
        return await api.post("main/new-scheme-of-work", data)
            .then((response) => {
                newSchemeOfWorkResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateSchemeOfWorkData(data) {
        return await api.post("main/update-scheme-of-work", data)
            .then((response) => {
                updateSchemeOfWorkResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function saveLessonPlan(data) {
        return await api.post("main/lesson-plan/new-lesson-Plan", data)
            .then((response) => {
                newLessonPlanResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function saveLessonPlanReference(data) {
        return await api.post("main/lesson-plan/add-reference", data)
            .then((response) => {
                addReferenceResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchLessonPlanReferences(lessonPlanNumber) {
        return await api.get("main/lesson-plan/references/"+lessonPlanNumber)
            .then((response) => {
                references.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    async function fetchSchemeOfWorkByClass(data) {
        return await api.get("main/scheme-of-work/fetch-scheme-of-work-by-class-and-subject?class_number="+data.class_number+"&subject_number="+data.subject_number+"&academic_year_number="+data.academic_year_number)
            .then((response) => {
                schemeOfWorkByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function exportSchemeOfWorkPdfByClass(data) {
        let fileName = data.fileName;
        data = {"html":data.html,"options":data.options};
        return await api.post("https://pdfgenerator.ursb.go.ug/html-pdf", data)
            .then((response) => {
                    if(response) {
                        exportSchemeOfWorkPdfByClassResponse.value = response
                    }
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchConceptsBySubTopic(data) {
        return await api.get("main/fetch-concepts-by-subtopic?sub_topic_number="+data)
            .then((response) => {
                conceptsBySubtopicResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchLessonPlanDetails(data) {
        return await api.get("main/lesson-plan/fetch-lesson-plan?sub_topic_number="+data)
            .then((response) => {
                lessonPlanResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        newSchemeOfWorkResponse,
        updateSchemeOfWorkResponse,
        schemeOfWorkByClassResponse,
        conceptsBySubtopicResponse,
        newLessonPlanResponse,
        exportSchemeOfWorkPdfByClassResponse,
        errorMessage,
        lessonPlanResponse,
        addReferenceResponse,
        newSchemeOfWorkData,
        fetchSchemeOfWorkByClass,
        updateSchemeOfWorkData,
        fetchConceptsBySubTopic,
        saveLessonPlan,
        saveLessonPlanReference,
        fetchLessonPlanDetails,
        exportSchemeOfWorkPdfByClass,
    }
})