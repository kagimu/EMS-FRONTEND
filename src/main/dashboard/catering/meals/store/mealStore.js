import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useMealStore = defineStore("Meal", () => {
    const mealDataResponse = ref(null)
    const newMealResponse = ref(null)
    const errorMessage = ref(null)
    const newMealCoursesResponse = ref(null)
    const mealCoursesResponse = ref(null)
    const mealCalendarResponse = ref(null)



    async function createNewMeal(data) {
        return await api.post("main/catering/meals", data)
            .then((response) => {
                newMealResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    
    async function fetchMealData() {
        return await api.get("main/catering/meals")
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

    async function fetchMealCalendar() {
        return await api.get("main/catering/meal-calendar")
            .then((response) => {
                mealCalendarResponse.value = response.data
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
       newMealResponse,
       mealCalendarResponse,
       errorMessage,
       createNewMeal,
       fetchMealData,
       createNewMealCourse,
       fetchMealCourses,
       fetchMealCalendar
    }
})