import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useManageClassStore = defineStore("classes", () => {
    const newClassAttendanceResponse = ref(null)
    const errorMessage = ref(null)
    const attendanceRocordByStudentResponse = ref(null)
    const attendanceRocordByClassResponse = ref(null)


    async function createClassAttendance(data) {
        return await api.post("main/attendances",data)
            .then((response) => {
                newClassAttendanceResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchAttendanceRecordByClass(studentid,class_number,study_period,campus_number,school_number) {
        return await api.get("main/attendances/student?student_number="+studentid+"&class_number="+class_number+"&study_period="+study_period+"&campus_number="+campus_number+"&school_number="+school_number)
            .then((response) => {
                attendanceRocordByClassResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
        }

    async function fetchAttendanceRecordByStudent(data) {
        return await api.get("main/attendances/student?student_number={{STUDENT_ID}}&class_number={{CLASS_ID}}&study_period={{STUDY_PERIOD}}&campus_number={{CAMPUS_ID}}&school_number={{SCHOOL_ID}}")
            .then((response) => {
                attendanceRocordByStudentResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
        }

    return {
        createClassAttendance,
        newClassAttendanceResponse,
        errorMessage,
        attendanceRocordByClassResponse,
        attendanceRocordByStudentResponse,
        fetchAttendanceRecordByClass,
        fetchAttendanceRecordByStudent
    }
})