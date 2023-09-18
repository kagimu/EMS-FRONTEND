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
        return await api.post("main/new-school", data)
            .then((response) => {
                newSchoolResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteSchool(data) {
        return await api.post("main/delete-school", data)
            .then((response) => {
                deleteSchoolResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function editSchoolData(data) {
        return await api.post("main/edit-school", data)
            .then((response) => {
                editSchoolResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSchools() {
        return await api.get("main/schools")
            .then((response) => {
                schoolsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchSchoolData(data) {
        return await api.get("main/school-info?school_number="+data)
            .then((response) => {
                schoolInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
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