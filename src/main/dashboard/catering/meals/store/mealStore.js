import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useMealStore = defineStore("Meal", () => {
    const mealDataResponse = ref(null)
    const newMealCourseFeedingSessionsResponse = ref(null)
    const errorMessage = ref(null)
    const newMealCoursesResponse = ref(null)
    const mealCoursesResponse = ref(null)
    const mealCalendarResponse = ref(null)
    const activateMealCourseResponse = ref(null)
    const mealCoursesPerDayResponse  = ref(null)
    const newMealCoursesPerDayResponse = ref(null)
    const updateMealCoursesResponse = ref(null)
    const updateMealCourseItemResponse = ref(null)
    const calendarsEventsResponse =  ref(null)
    const activateGroupOnCalendarResponse = ref(null)
    const groupOnCalendarResponse = ref(null)
    const updateMealCourseFeedingSessionsResponse = ref(null)
    const deleteMealCourseFeedingSessionsResponse = ref(null)


    async function createMealCourseFeedingSessions(data) {
        return await api.post("main/catering/meal-course-feeding-sessions", data)
            .then((response) => {
                newMealCourseFeedingSessionsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    
    async function fetchMealCourseFeedingSessions(data) {
        return await api.get("main/catering/meal-course-feeding-sessions?meal_course_number="+data.meal_course_number)
            .then((response) => {
                mealDataResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }


    async function createNewMealCourse(data) {
        return await api.post("main/catering/meal-courses", data)
            .then((response) => {
                newMealCoursesResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchMealCourses(data) {
            let school_number =     data?.school_number ?? ""
            let status =    data?.status  ?? ""
        return await api.get("main/catering/meal-courses?school_number="+school_number+"&status="+status)
            .then((response) => {
                mealCoursesResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchMealCalendar(data) {
          let  school_number = data?.school_number ?? ""
          let  campus_number = data?.campus_number ?? ""
        return await api.get("main/catering/meal-calendar?school_number="+school_number+"&campus_number="+campus_number)
            .then((response) => {
                mealCalendarResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function activateMealCourse(data) {
        return await api.post("main/catering/activate-meal-course", data)
            .then((response) => {
                activateMealCourseResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchMealCoursesPerDay(school_number) {
        return await api.get("main/catering/meal-courses-per-group?school_number="+school_number)
            .then((response) => {
                mealCoursesPerDayResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function createMealCoursesPerDay(data) {
        return await api.post("main/catering/meal-courses-per-group", data)
            .then((response) => {
                newMealCoursesPerDayResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }
    
    async function updateMealCourse(data) {
        return await api.post("main/catering/meal-courses/update", data)
            .then((response) => {
                updateMealCoursesResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }
    async function updateMealCourseItem(data) {
        return await api.post("main/catering/meal-courses/update/item", data)
            .then((response) => {
                updateMealCourseItemResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchCalendarsEvents() {
        return await api.get("main/eos/calendars/events")
            .then((response) => {
                calendarsEventsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function activateGroupOnCalendar(data) {
        return await api.post("main/catering/feeding-group-calendar", data)
            .then((response) => {
                activateGroupOnCalendarResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchGroupOnCalendar(data) {
          let school = data?.school_number ?? ""
        return await api.get("main/catering/feeding-group-calendar?school_number="+school)
            .then((response) => {
                groupOnCalendarResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function updateMealCourseFeedingSessions(data) {
        return await api.post("main/catering/updatiiiiiiiiiiiiiing", data)
            .then((response) => {
                updateMealCourseFeedingSessionsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteMealCourseFeedingSessions(data) {
        return await api.post("main/catering/deletiiiiiiiiiiing", data)
            .then((response) => {
                deleteMealCourseFeedingSessionsResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    return {
       newMealCoursesResponse,
       mealCoursesResponse,
       mealDataResponse,
       newMealCourseFeedingSessionsResponse,
       mealCalendarResponse,
       activateMealCourseResponse,
       errorMessage,
       createMealCourseFeedingSessions,
       fetchMealCourseFeedingSessions,
       createNewMealCourse,
       fetchMealCourses,
       fetchMealCalendar,
       activateMealCourse,
       mealCoursesPerDayResponse,
       fetchMealCoursesPerDay,
       createMealCoursesPerDay,
       newMealCoursesPerDayResponse,
       updateMealCoursesResponse,
       updateMealCourse,
       updateMealCourseItemResponse,
       updateMealCourseItem,
       calendarsEventsResponse,
       fetchCalendarsEvents,
       activateGroupOnCalendarResponse,
       activateGroupOnCalendar,
       fetchGroupOnCalendar,
       groupOnCalendarResponse,
       updateMealCourseFeedingSessionsResponse,
       updateMealCourseFeedingSessions,
       deleteMealCourseFeedingSessionsResponse,
       deleteMealCourseFeedingSessions
    }
})