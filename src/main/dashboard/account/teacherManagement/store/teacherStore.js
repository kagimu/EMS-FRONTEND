import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useTeacherStore = defineStore("teacher", () => {
    const assignTeacherResponse = ref(null)
    const teacherOnboardingResponse = ref(null)
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


    async function fetchTeacherOnboarding(data) {
        let  school_number = data?.school_number ?? ""
        let  campus_number = data?.campus_number ?? ""
        let  curriculum_number = data?.curriculum_number ?? ""
        let campus_level_number = data?.campus_level_number ?? ""
        let class_number = data?.class_number ?? ""
        let streams = data?.streams ?? ""
        let assessment_area_number = data?.assessment_area_number ?? ""
        return await api.get("main/staff-management?page="+data?.page+
                "&per_page="+ data?.per_page+
                "&search="+data?.search+
                "&school_number="+school_number+
                "&campus_number="+campus_number+
                "&curriculum_number="+curriculum_number+
                "&campus_level_number="+campus_level_number+
                "&class_number="+class_number+
                "&streams="+streams+
                "&assessment_area_number="+assessment_area_number
            )
            .then((response) => {
                teacherOnboardingResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    return {
        assignTeacherResponse,
        teacherOnboardingResponse,
        errorMessage,
        assignTeacher,
        fetchTeacherOnboarding
    }
})