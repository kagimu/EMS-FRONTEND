import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useClassesStore = defineStore("classes", () => {
    let classResponse = ref(null)
    let classLevelResponse = ref(null)
    let classInfoResponse = ref(null)
    let classLevelInfoResponse = ref(null)
    let classSubjectsInfoResponse = ref(null)
    let classSubjectResponse = ref(null)
    let classStreams = ref(null)
    let classCurriculumResponse = ref(null)
    let newStreamSuccess = ref(null)
    let classesToAddResponse = ref(null)
    const errorMessage = ref(null)





    async function newClassData(data) {
        return await api.post("main/new-class", data)
            .then((response) => {
                classResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newClassLevelData(data) {
        return await api.post("main/new-class-level", data)
            .then((response) => {
                classLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    async function addClassSubjectData(data) {
        return await api.post("main/subject-to-class", data)
            .then((response) => {
                classSubjectResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClasses(data) {
        data = data ? data : ""
        return await api.get("main/classes?level="+data)
            .then((response) => {
                classInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassesCurriculum() {
        return await api.get("main/classes-curriculum")
            .then((response) => {
                classCurriculumResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchClassLevelToAdd(data) {
        data = data ? data : ""
        return await api.get("main/classes-to-add?level="+data)
            .then((response) => {
                classesToAddResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassLevel(data) {
        data = data ? data : ""
        return await api.get("main/class-level?level_number="+data.levelNumber+"&campus_number="+data.campusNumber)
            .then((response) => {
                classLevelInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassSubjects(data) {
        return await api.get("main/class-subjects?level_number="+data.level+"&class_number="+data.class)
            .then((response) => {
                classSubjectsInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassesByLevelAndCampus(data) {
        return await api.get("main/timetable/get-classes-by-campus-number-and-level-number?level_number="+data.level_number+"&campus_number="+data.campus_number)
            .then((response) => {
                classInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassStreams(data) {
        return await api.get("main/stream/fetch?class_level_number="+data)
            .then((response) => {
                classStreams.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function addStream(data) {
        return await api.post("main/stream/new",data)
            .then((response) => {
                newStreamSuccess.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }




    return {
        classResponse,
        classStreams,
        classInfoResponse,
        classSubjectsInfoResponse,
        classSubjectResponse,
        classLevelResponse,
        classLevelInfoResponse,
        classesToAddResponse,
        newStreamSuccess,
        classCurriculumResponse,
        errorMessage,
        newClassData,
        fetchClasses,
        fetchClassSubjects,
        addClassSubjectData,
        newClassLevelData,
        fetchClassLevel,
        fetchClassLevelToAdd,
        fetchClassStreams,
        addStream,
        fetchClassesByLevelAndCampus,
        fetchClassesCurriculum
    }
})