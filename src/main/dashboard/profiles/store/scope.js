import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useScopeStore = defineStore("scope", () => {
    let newCurriculumScopeResponse = ref(null)
    let errorMessage = ref(null)
    let scopeCurriculumresponse = ref(null)
    let newLevelScopeResponse = ref(null)
    let newLevelSchoolResponse= ref(null)
    let newCampusScopeResponse= ref(null)
    let newClassScopeResponse= ref(null)
    let newAcademicYearScopeResponse= ref(null)
   

        async function createNewCurriculumScope(data) {
            return await api.post("main/settings/scopes/curriculum", data)
                .then((response) => {
                    newCurriculumScopeResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function createNewLevelScope(data) {
            return await api.post("main/settings/scopes/level", data)
                .then((response) => {
                    newLevelScopeResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function createNewSchoolScope(data) {
            return await api.post("main/settings/scopes/school", data)
                .then((response) => {
                    newLevelSchoolResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function createNewCampusScope(data) {
            return await api.post("main/settings/scopes/campus", data)
                .then((response) => {
                    newCampusScopeResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
        async function createNewClassScope(data) {
            return await api.post("main/settings/scopes/class", data)
                .then((response) => {
                    newClassScopeResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
        async function createNewAcademicYearScope(data) {
            return await api.post("main/settings/scopes/learning-area", data)
                .then((response) => {
                    newAcademicYearScopeResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

    


    return {
     errorMessage,
     createNewCurriculumScope,
     newCurriculumScopeResponse,
     scopeCurriculumresponse,
     createNewLevelScope,
     newLevelScopeResponse,
     newLevelSchoolResponse,
     createNewSchoolScope,
     newCampusScopeResponse,
     createNewCampusScope,
     newClassScopeResponse,
     createNewClassScope,
     newAcademicYearScopeResponse,
     createNewAcademicYearScope
  
    }
})