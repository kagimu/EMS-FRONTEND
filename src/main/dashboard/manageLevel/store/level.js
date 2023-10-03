import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLevelStore = defineStore("level", () => {
    let levelResponse = ref(null)
    const errorMessage = ref(null)



/*
    async function newSchoolData(data) {
        return await api.post("main/new-school", data)
            .then((response) => {
                newSchoolResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }*/

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
        levelResponse,
        errorMessage,
        fetchLevelInfo,
        fetchLevelsByCampusNumber
    }
})