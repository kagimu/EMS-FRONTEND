import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLevelStore = defineStore("level", () => {
    let levelInfoResponse = ref(null)
    let levelResponse = ref(null)
    let curriculumLevelResponse = ref(null)
    const curriculumLevelInfoResponse = ref(null)
    const errorMessage = ref(null)



    async function newLevelData(data) {
        return await api.post("main/new-level", data)
            .then((response) => {
                levelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function newCurriculumLevel(data) {
        return await api.post("main/new-curriculum-level", data)
            .then((response) => {
                curriculumLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function fetchLevels() {
        return await api.get("main/fetch-level")
            .then((response) => {
                levelInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCurriculumLevels(data) {
        return await api.get("main/fetch-curriculum-level?curriculum_number="+data)
            .then((response) => {
                curriculumLevelInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    return {
        levelInfoResponse,
        levelResponse,
        curriculumLevelResponse,
        curriculumLevelInfoResponse,
        errorMessage,
        newLevelData,
        fetchLevels,
        newCurriculumLevel,
        fetchCurriculumLevels
    }
})