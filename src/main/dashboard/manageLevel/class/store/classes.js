import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useClassesStore = defineStore("classes", () => {
    let classResponse = ref(null)
    let classEditResponse = ref(null)
    let classLevelResponse = ref(null)
    let classDataInfoResponse = ref(null)
    let classInfoResponse = ref(null)
    let deleteClassSetUpResponse = ref(null)
    let schemeClassInfoResponse = ref(null)
    let curriculumClassSetResponse = ref(null)
    let classLevelInfoResponse = ref(null)
    let classSubjectsInfoResponse = ref(null)
    let classSubjectResponse = ref(null)
    let classStreams = ref(null)
    let classCurriculumResponse = ref(null)
    let newStreamSuccess = ref(null)
    let newCampusLevelResponse = ref(null)
    let classesToAddResponse = ref(null)
    let curriculumClassInfoResponse = ref(null)
    let curriculumClassResponse = ref(null)
    let campusLevelResponse = ref(null)
    const errorMessage = ref(null)
    const curriculumClassByIdResponse = ref(null)
    const classLevelByLevelResponse = ref(null)





    async function newClassData(data) {
        return await api.post("main/new-class", data)
            .then((response) => {
                classResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function editClassData(data) {
        return await api.post("main/class/edit", data)
            .then((response) => {
                classEditResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newCurriculumClassData(data) {
        return await api.post("main/new-curriculum-class", data)
            .then((response) => {
                curriculumClassResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newCampusClass(data) {
        return await api.post("main/campus/new-class", data)
            .then((response) => {
                classLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClasses(data) {
        data = data ? data : ""
        return await api.get("main/classes?level="+data.level)
            .then((response) => {
                classInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function deleteClassSetUp(data) {
        return await api.post("main/class/delete", data)
            .then((response) => {
                deleteClassSetUpResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchCurriculumClasses(data) {
        return await api.get("main/fetch-curriculum-classes?level="+data.level+"&curriculum_number="+data.curriculum_number)
            .then((response) => {
                curriculumClassInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchSchemeOfWorkClasses(data) {
        return await api.get("main/scheme-of-work-classes?level="+data.level+"&campus_number="+data.campus_number)
            .then((response) => {
                schemeClassInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function filterCurriculumClassesData(data) {
        data = data ? data : ""
        return await api.get("main/filter-curriculum-classes?level="+data)
            .then((response) => {
                curriculumClassSetResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassesCurriculum(data) {
        return await api.get("main/classes-curriculum?curriculum_number="+data)
            .then((response) => {
                classCurriculumResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchClassLevelToAdd(data) {
        data = data ? data : ""
        return await api.get("main/class/curriculum-class?level_number="+data)
            .then((response) => {
                classesToAddResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassLevel(data) {
        data = data ? data : ""
        return await api.get("main/campus/class-list?campus_curriculum_number="+data.campusCurriculumNumber+"&campus_level_number="+data.campusLevelNumber)
            .then((response) => {
                classLevelInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassStreams(data) {
        let class_level_number =  data?.class_level_number ?? ""
          let campus_number =  data?.campus_number ?? ""
        let campus_curriculum_number =  data?.campus_curriculum_number ?? ""
        let class_number = data?.class_number ?? ""
        return await api.get("main/stream/fetch?class_level_number="+class_level_number+"&class_number="+class_number+"&campus_curriculum_number="+campus_curriculum_number+"&campus_number="+campus_number)
            .then((response) => {
                classStreams.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function newCampusLevel(data) {
        return await api.post("main/campus/new-level",data)
            .then((response) => {
                newCampusLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }



    async function classData(data) {
        return await api.get("main/class/info?class_number="+data)
            .then((response) => {
                classDataInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchCampusLevel(data) {
        return await api.get("main/campus/level-list?campus_curriculum_number="+data)
            .then((response) => {
                campusLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    // subject/by-curriculum-class?curriculum_class_number=be32281c-c03e-4f51-86fe-3c754b0aa170

    async function fetchCurriculumClassesByID(data) {
        return await api.get("main/subject/by-curriculum-class?curriculum_class_number="+data)
            .then((response) => {
                curriculumClassByIdResponse.value = response.data 
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchClassByLevel(campusCurriculumNumber,campusLevelNumber) {
        return await api.get("main/campus/class-list?campus_curriculum_number="+campusCurriculumNumber+"&campus_level_number="+campusLevelNumber)
            .then((response) => {
                classLevelByLevelResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
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
        schemeClassInfoResponse,
        classCurriculumResponse,
        curriculumClassInfoResponse,
        curriculumClassResponse,
        curriculumClassSetResponse,
        classEditResponse,
        deleteClassSetUpResponse,
        classDataInfoResponse,
        newCampusLevelResponse,
        campusLevelResponse,
        errorMessage,
        classLevelByLevelResponse,
        curriculumClassByIdResponse,
        newClassData,
        editClassData,
        fetchClasses,
        fetchSchemeOfWorkClasses,
        fetchClassSubjects,
        addClassSubjectData,
        newCampusClass,
        fetchClassLevel,
        fetchClassLevelToAdd,
        fetchClassStreams,
        addStream,
        fetchClassesByLevelAndCampus,
        fetchClassesCurriculum,
        filterCurriculumClassesData,
        newCurriculumClassData,
        fetchCurriculumClasses,
        deleteClassSetUp,
        classData,
        newCampusLevel,
        fetchCampusLevel,
        fetchClassByLevel,
        fetchCurriculumClassesByID
    }
})