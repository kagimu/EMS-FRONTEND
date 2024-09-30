import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTeacherStore = defineStore("teacher", () => {
    const assignTeacherResponse = ref(null)
    const errorMessage = ref(null)


    async function assignTeacher(data) {
        return await api.post("main/staff-management/attach-staff-to-stream",data)
            .then((response) => {
                assignTeacherResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        assignTeacherResponse,
        errorMessage,
        assignTeacher,
    }
})