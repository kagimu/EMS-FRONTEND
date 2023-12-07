import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLevelStore = defineStore("level", () => {
    const levelInfoResponse = ref(null)
    const levelResponse = ref(null)
    const curriculumLevelResponse = ref(null)
    const curriculumLevelInfoResponse = ref(null)
    const campusLevelResponse = ref(null)
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




    async function fetchLevelInfo(data) {
        return await api.get("main/level?campus_number="+data)
            .then((response) => {
                levelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampusLevelList(data) {
        return await api.get("main/fetch-campus-level?campus_number="+data)
            .then((response) => {
                campusLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    async function fetchLevelsByCampusNumber(campusNumber) {
        return await api.get("main/timetable/fetch-levels-by-campus-number/"+campusNumber)
            .then((response) => {
                levelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        campusLevelResponse,
        levelInfoResponse,
        levelResponse,
        curriculumLevelResponse,
        curriculumLevelInfoResponse,
        errorMessage,
        newLevelData,
        fetchLevels,
        newCurriculumLevel,
        fetchCurriculumLevels,
        fetchLevelInfo,
        fetchCampusLevelList,
        fetchLevelsByCampusNumber,
    }
})