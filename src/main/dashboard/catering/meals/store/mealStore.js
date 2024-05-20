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

    async function fetchMealCourses(school_number) {
        return await api.get("main/catering/meal-courses?school_number="+school_number)
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
        return await api.get("main/catering/meal-calendar?school_number="+data.school_number+"&campus_number="+data.campus_number)
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
       newMealCoursesPerDayResponse

    }
})