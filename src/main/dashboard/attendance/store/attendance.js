import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useAttendanceStore = defineStore("attendance", () => {

    let attendanceStudentResponse = ref(null)
    let newStudentAttendanceResponse = ref(null)
    const errorMessage = ref(null)
    let attendanceStaffResponse = ref(null)
    let newStaffAttendanceResponse = ref(null)


    async function newStudentAttendance(data) {
        return await api.post("main/attendances", data)
            .then((response) => {
                newStudentAttendanceResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchStudentAttendance(data) {
        return await api.get("main/attendances?page="+data?.page+"&per_page="+ data?.per_page+"&school_number="+data?.school_number
            +"&campus_number="+data?.campus_number
            +"&campus_class_number="+data?.campus_class_number
            +"&study_period_number="+data?.study_period_number
            +"&stream_number="+data?.stream_number
            +"&date="+data.date
        )
            .then((response) => {
                attendanceStudentResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function newStaffAttendance(data) {
        return await api.post("main/attendance", data)
            .then((response) => {
                newStaffAttendanceResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchStaffAttendance() {
        return await api.get("main/attendance")
            .then((response) => {
                attendanceStaffResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }



    return {
        errorMessage,
        newStudentAttendanceResponse,
        attendanceStudentResponse,
        newStudentAttendance,
        fetchStudentAttendance,
        newStaffAttendance,
        fetchStaffAttendance,
        attendanceStaffResponse,
        newStaffAttendanceResponse
    }
})