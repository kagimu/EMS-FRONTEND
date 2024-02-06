import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLevelStore = defineStore("level", () => {
    const levelInfoResponse = ref(null)
    const levelResponse = ref(null)
    const deleteLevelSetUpResponse = ref(null)
    const curriculumLevelResponse = ref(null)
    const curriculumLevelInfoResponse = ref(null)
    const campusLevelResponse = ref(null)
    const levelDataInfoResponse = ref(null)
    const levelEditResponse = ref(null)
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

    async function editLevelData(data) {
        return await api.post("main/level/edit", data)
            .then((response) => {
                levelEditResponse.value = response.data
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


    async function deleteLevelSetUp(data) {
        return await api.post("main/level/delete", data)
            .then((response) => {
                deleteLevelSetUpResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function LevelData(data) {
        return await api.get("main/level/info?level_number="+data)
            .then((response) => {
                levelDataInfoResponse.value = response.data
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
        deleteLevelSetUpResponse,
        levelDataInfoResponse,
        levelEditResponse,
        errorMessage,
        newLevelData,
        editLevelData,
        fetchLevels,
        newCurriculumLevel,
        fetchCurriculumLevels,
        fetchLevelInfo,
        fetchCampusLevelList,
        fetchLevelsByCampusNumber,
        deleteLevelSetUp,
        LevelData,
    }
})