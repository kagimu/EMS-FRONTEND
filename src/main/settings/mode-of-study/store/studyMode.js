import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useStudyModeStore = defineStore("studyMode", () => {
    let newModeOfStudyResponse = ref(null)
    let deleteModeOfStudyResponse = ref(null)
    const errorMessage = ref(null)
    const modeOfStudyInfoResponse = ref(null)
    const updateModeOfStudyInfoResponse = ref(null)


    async function newModeOfStudy(data) {
        return await api.post("main/school/mode-of-study", data)
            .then((response) => {
                newModeOfStudyResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteModeOfStudyData(id) {
        return await api.delete("main/school/mode-of-study/"+id)
            .then((response) => {
                deleteModeOfStudyResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function editModeOfStudy(data) {
        return await api.put("main/school/mode-of-study", data)
            .then((response) => {
                updateModeOfStudyInfoResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchModeOfStudy(data) {
         let  school_number = data.school_number ?? ""
        return await api.get("main/school/mode-of-study?school_number="+school_number)
            .then((response) => {
                modeOfStudyInfoResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }



    return {
        newModeOfStudyResponse,
        updateModeOfStudyInfoResponse,
        modeOfStudyInfoResponse,
        deleteModeOfStudyResponse,
        errorMessage,
        newModeOfStudy,
        fetchModeOfStudy,
        editModeOfStudy,
        deleteModeOfStudyData,
    }
})