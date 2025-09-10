import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useNarrativeStore = defineStore("narrative", () => {
    let newNarrativeResponse = ref(null)
    let errorMessage = ref(null)
    let narrativeResponse = ref(null)
    let updateNarrativeReportResponse = ref(null)
    let updateNarrativeResponse = ref(null)
    let deleteNarrativeResponse = ref(null)
    let printNarrativeResponse = ref(null)
    let studentsOnNarrativeResponse = ref(null)
    let addNarrativeReportResponse = ref(null)

    async function newNarrativeSchedule(data) {
        return await api.post("main/report-settings/narrative/scheduled", data)
            .then((response) => {
                newNarrativeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function updateNarrativeSchedule(data) {
        return await api.patch("main/report-settings/narrative/scheduled/"+data.narrative_schedule_number, data)
            .then((response) => {
                updateNarrativeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    
    async function deleteNarrativeSchedule(data) {
        return await api.delete("main/report-settings/narrative/scheduled/"+data.narrative_schedule_number)
            .then((response) => {
                deleteNarrativeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchNarrativeSchedules(data) {
        let  page = data?.page ?? ""
        let  per_page =  data?.per_page ?? ""
        let  class_number =   data?.class_number ?? ""
        let  campus_number =   data?.campus_number ?? ""
        let  academic_year_number  =  data?.academic_year_number ?? ""
        let  study_period_number =  data?.study_period_number ?? ""
        let  metric_number =  data?.metric_number ?? ""
        let  assessment_area_number  =  data?.assessment_area_number ?? ""
            let  curriculum_number  =  data?.curriculum_number ?? ""
        let  paginated  =  data?.paginated ?? "no"

        return await api.get("main/report-settings/narrative/scheduled?study_period_number="+study_period_number+
                "&assessment_area_number="+assessment_area_number+
                "&class_number="+class_number+
                "&academic_year_number="+academic_year_number+
                "&metric_number="+metric_number+
                "&campus_number="+campus_number+
                "&curriculum_number="+curriculum_number
            )
            .then((response) => {
                narrativeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function updateNarrativeReport(data) {
        return await api.patch("main/report-settings/narrative/"+data?.narrativeNumber, data)
            .then((response) => {
                updateNarrativeReportResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function printPreviewNarrativeReport(data) {
        let student_number = data?.student_number ?? ""
        let assessment_area_number = data?.assessment_area_number ?? ""
        let study_period_number = data?.study_period_number ?? ""
        let campus_class_number = data?.campus_class_number ?? ""
        let academic_year_number = data?.academic_year_number ?? ""

        return await api.get("main/report-settings/narrative/print-preview?student_number="+student_number+
            "&assessment_area_number="+assessment_area_number+
            "&study_period_number="+study_period_number+
            "&campus_class_number="+campus_class_number+
            "&academic_year_number="+academic_year_number
           )
            .then((response) => {
                printNarrativeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchStudentsOnNarrativeSchedules(data) {
        let  class_number =   data?.class_number ?? ""
        let  campus_number =   data?.campus_number ?? ""
        let  academic_year_number  =  data?.academic_year_number ?? ""
        let  study_period_number =  data?.study_period_number ?? ""
        let  narrative_schedule_number  =  data?.narrative_schedule_number ?? ""
        let  curriculum_number  =  data?.curriculum_number ?? ""

        return await api.get("main/report-settings/narrative/students?study_period_number="+study_period_number+
            "&narrative_schedule_number="+narrative_schedule_number+
            "&class_number="+class_number+
            "&academic_year_number="+academic_year_number+
            "&campus_number="+campus_number+
            "&curriculum_number="+curriculum_number
        )
            .then((response) => {
                studentsOnNarrativeResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function addNarrativeReport(data) {
        return await api.put("https://wholesome-api.noregrets.ug/main/report-settings/narrative/"+data.narrative_number)
            .then((response) => {
                addNarrativeReportResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        errorMessage,
        newNarrativeResponse,
        narrativeResponse,
        updateNarrativeReportResponse,
        deleteNarrativeResponse,
        newNarrativeSchedule,
        fetchNarrativeSchedules,
        updateNarrativeReport,
        updateNarrativeResponse,
        deleteNarrativeSchedule,
        updateNarrativeSchedule,
        printNarrativeResponse,
        printPreviewNarrativeReport,
        fetchStudentsOnNarrativeSchedules,
        studentsOnNarrativeResponse,
        addNarrativeReportResponse,
        addNarrativeReport
  
    }
})