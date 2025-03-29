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
        updateNarrativeSchedule
  
    }
})