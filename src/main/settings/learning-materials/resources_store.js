import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLearningMaterialStore = defineStore("learningMaterial", () => {
    const addMaterialResponse = ref(null)
    const learningMaterialsResponse = ref(null)
    const errorMessage = ref(null)


    async function newLearningMaterial(data) {
        return await api.post("/main/learning-materials", data,{
            headers: {
                "Content-Type": "multipart/form-data"
            }})
            .then((response) => {
                addMaterialResponse.value = response.data
            })
            .catch((response) => {
                if (response) {
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newCurriculumSubtopicReference(data) {
        return await api.post("/main/learning-materials", data,{
            headers: {
                "Content-Type": "multipart/form-data"
            }})
            .then((response) => {
                addMaterialResponse.value = response.data
            })
            .catch((response) => {
                if (response) {
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchLearningMaterials(){
        return await api.get("/main/learning-materials",).then((response)=>{
            learningMaterialsResponse.value = response.data
        }).catch((error)=>{

            errorMessage.value = error.response.data
        });
    }



    return {
        addMaterialResponse,
        learningMaterialsResponse,
        errorMessage,
        fetchLearningMaterials,
        newLearningMaterial,
        newCurriculumSubtopicReference
    }

});