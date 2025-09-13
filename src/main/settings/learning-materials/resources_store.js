import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useLearningMaterialStore = defineStore("learningMaterial", () => {
    const addMaterialResponse = ref(null)
    const curriculumSubtopicReferenceResponse = ref(null)
    const learningMaterialsResponse = ref(null)
    const materialsSubTypeResponse = ref(null)
    const deleteClassInfoResponse = ref(null)
    const errorMessage = ref(null)


    async function newLearningMaterial(data) {
        return await api.post("/main/learning-materials", data,{
            headers: {
                "Content-Type": "multipart/form-data"
            }})
            .then((response) => {
                addMaterialResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function editLearningMaterial(data) {
        return await api.put("/main/learning-materials", data,{
            headers: {
                "Content-Type": "multipart/form-data"
            }})
            .then((response) => {
                addMaterialResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function newLearningMaterialSubType(data) {
        return await api.post("/main/learning-materials/sub-type", data)
            .then((response) => {
                addMaterialResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function newCurriculumSubtopicReference(data) {
        return await api.post("main/learning-materials/new-curriculum-reference", data)
            .then((response) => {
                curriculumSubtopicReferenceResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function fetchLearningMaterials(){
        return await api.get("/main/learning-materials",).then((response)=>{
            learningMaterialsResponse.value = response.data
        }).catch((error) => {
            if(error && error.response){
                errorMessage.value = error.response.data
            }
        })
    }

    async function fetchLearningMaterialSubTypes(category){
        return await api.get("/main/learning-materials/sub-types/"+category,).then((response)=>{
            materialsSubTypeResponse.value = response.data
        }).catch((error) => {
            if(error && error.response){
                errorMessage.value = error.response.data
            }
        })
    }


    async function deleteClassInfo(data) {
        return await api.delete("main/learning-materials/"+data)
            .then((response) => {
                deleteClassInfoResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    return {
        addMaterialResponse,
        learningMaterialsResponse,
        curriculumSubtopicReferenceResponse,
        errorMessage,
        materialsSubTypeResponse,
        deleteClassInfoResponse,
        fetchLearningMaterials,
        newLearningMaterial,
        editLearningMaterial,
        newLearningMaterialSubType,
        newCurriculumSubtopicReference,
        fetchLearningMaterialSubTypes,
        deleteClassInfo
    }

});