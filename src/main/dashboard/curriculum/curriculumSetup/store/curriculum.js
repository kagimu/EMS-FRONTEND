import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useCurriculumStore = defineStore("curriculum", () => {

    let importResponse = ref(null)
    let curriculumExcelResponse = ref(null)
    const errorMessage = ref(null)



    async function uploadExcelFile(data) {
        return await api.post("main/upload-curriculum", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                importResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchUploadedExcel() {
        return await api.get("main/uploaded-curriculum")
            .then((response) => {
                curriculumExcelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        importResponse,
        curriculumExcelResponse,
        errorMessage,
        uploadExcelFile,
        fetchUploadedExcel
    }
})