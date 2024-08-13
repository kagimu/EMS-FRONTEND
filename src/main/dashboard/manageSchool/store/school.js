import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useSchoolStore = defineStore("school", () => {
    let newSchoolResponse = ref(null)
    let deleteSchoolResponse = ref(null)
    const errorMessage = ref(null)
    const schoolInfoResponse = ref(null)
    const schoolsResponse = ref(null)
    const editSchoolResponse = ref(null)


    async function newSchoolData(data) {
        return await api.post("main/school/new", data)
            .then((response) => {
                newSchoolResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteSchool(id) {
        return await api.delete("main/school/delete/"+id)
            .then((response) => {
                deleteSchoolResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function editSchoolData(data) {
        return await api.post("main/school/edit", data)
            .then((response) => {
                editSchoolResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchSchools(entityN) {
         let  entity_number = entityN ?? ""
        return await api.get("main/school/all?entity_number="+entity_number)
            .then((response) => {
                schoolsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }




    async function fetchSchoolData(data) {
        return await api.get("main/school/info?school_number="+data)
            .then((response) => {
                schoolInfoResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }




    return {
        newSchoolResponse,
        schoolInfoResponse,
        editSchoolResponse,
        schoolsResponse,
        deleteSchoolResponse,
        errorMessage,
        newSchoolData,
        fetchSchools,
        fetchSchoolData,
        editSchoolData,
        deleteSchool,
    }
})