import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api"

export const useSubjectsStore = defineStore("subjects", () => {
    let subjects = ref(null)
    let list = ref([])
    const success = ref(null)
    const error = ref(null)

    async function fetchSubjects(query = "?page=1") {
        return await api
            .get("api/admin/subjects" + query)
            .then((response) => {
                subjects.value = response.data
            })
            .catch((response) => {
                error.value = response.response.data
            })
    }

    /*async function fetchSubjectsList() {
        return await api
            .get("api/subjects/list")
            .then((response) => {
                list.value = response.data
            })
            .catch((response) => {
                error.value = response.response.data
            })
    }

    async function storeSubject(payload) {
        return await api
            .post("api/admin/subjects", payload)
            .then((response) => {
                success.value = response.data
            })
            .catch((response) => {
                error.value = response.response.data
            })
    }

    async function updateSubject(payload) {
        return await api
            .put("api/admin/subjects/" + payload.id, payload)
            .then((response) => {
                success.value = response.data
            })
            .catch((response) => {
                error.value = response.response.data
            })
    }

    async function deleteSubject(ussdAppId) {
        return await api
            .delete("api/admin/subjects/" + ussdAppId)
            .then((response) => {
                success.value = response.data
            })
            .catch((response) => {
                error.value = response.response.data
            })
    }*/

    return {
        subjects,
        list,
        error,
        success,
        fetchSubjectsList,
        fetchSubjects,
        storeSubject,
        updateSubject,
        deleteSubject,
    }
})