import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useCateringStore = defineStore("catering", () => {
    let newUnitOfMeasureInfoResponse = ref(null)
    let  UnitOfMeasureInfoResponse= ref(null)
    let  deleteUnitOfMeasureInfoResponse= ref(null)
    let updateUnitOfMeasureInfoResponse = ref(null)
    let newMenuItemInfoResponse = ref(null)
    let menuItemResponse = ref(null)
    let feedingGroupInfoResponse = ref(null)
    let newFeedingGroupInfoResponse = ref(null)
    let feedingGroupSessionsInfoResponse = ref(null)
    let newFeedingGroupSessionsInfoResponse = ref(null)
    let newFeedingGroupSessionsItemsInfoResponse = ref(null)
    let feedingSessionsItemsInfoResponse = ref(null)
    let newAssemblyItemResponse = ref(null)
    let assemblyItemResponse = ref(null)
    let newDailySessionResponse = ref(null)
    let dailySessionResponse = ref(null)
    let newStockResponse = ref(null)
    let stockResponse = ref(null)
    let feedingGroupUsersResponse = ref(null)
    let newFeedingGroupResponse = ref(null)
    let menuItemDetailsResponse = ref(null)
    let updateMenuItemResponse = ref(null)
    let updateItemAssemblyResponse = ref(null)
    let filterMenuResponse = ref(null)
    let newGroupSessionResponse = ref(null)
    let feedGroupSessionsInfoResponse = ref(null)
    let newFeedingGroupsPerDayResponse = ref(null)
    let feedGroupPerDayInfoResponse = ref(null) 
    let newMealsResponse = ref(null)
    let mealsCostProjectionResponse = ref(null)
    let mealsResponse = ref(null)
    let editFeedingGroupInfoResponse = ref(null)
    let menuItemPaginatedResponse = ref(null)
    let feedingGroupUsersListResponse = ref(null)
    let feedingGroupUsersAvailableResponse = ref(null)
    let updateFeedingSessionResponse = ref(null)
    let deleteFeedingSessionResponse = ref(null)
    let deleteFeedingGroupResponse = ref(null)
    const errorMessage = ref(null)

    async function newUnitOfMeasureInfo(data) {
        return await api.post("main/catering/units-of-measure", data)
            .then((response) => {
                newUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function fetchUnitOfMeasureInfo() {
        return await api.get("main/catering/units-of-measure")
            .then((response) => {
                UnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function deleteUnitOfMeasure(id) {
        return await api.delete("main/catering/units-of-measure/"+id)
            .then((response) => {
                deleteUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    // Main/catering/units-of-measure/3434
    async function updateUnitOfMeasure(data) {
        return await api.put("main/catering/units-of-measure/"+data.menu_number)
            .then((response) => {
                updateUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

    //==MenuItem catering/menu-items
    async function newMenuItemInfo(data) {
        return await api.post("main/catering/menu-items", data)
            .then((response) => {
                newMenuItemInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchMenuItemPaginated(data) {
        let  page = data?.page ?? ""
        let  per_page =  data?.per_page ?? ""
        let  school_number =   data?.school_number ?? ""
        let  campus_number =   data?.campus_number ?? ""
        let  type =   data?.type ?? ""

        return await api.get("main/catering/menu-items-paginated?page="+page+"&per_page="+per_page+"&school_number="+school_number+"&campus_number="+campus_number+"&type="+type)
            .then((response) => {
                menuItemPaginatedResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function fetchMenuItem(data) {
        return await api.get("main/catering/menu-items?school_number="+data)
            .then((response) => {
                menuItemResponse.value = response.data
            })
            .catch((response) => {
                if(response && response.response){
                    errorMessage.value = response.response.data
                }
            })
    }

//feeding Group
async function newFeedingGroupInfo(data) {
    return await api.post("main/catering/feeding-groups", data)
        .then((response) => {
            newFeedingGroupInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function editFeedingGroupInfo(data) {
    return await api.post("main/catering/feeding-groups/update", data)
        .then((response) => {
            editFeedingGroupInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchFeedingGroup(school) {
    return await api.get("main/catering/feeding-groups?school_number="+school)
        .then((response) => {
            feedingGroupInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
//feedingSessions
async function newFeedingGroupSessionsInfo(data) {
    return await api.post("main/catering/feeding-sessions", data)
        .then((response) => {
            newFeedingGroupSessionsInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
async function fetchFeedingGroupSessions(data) {
    let school_number = data?.school_number ?? ""
    return await api.get("main/catering/feeding-sessions?school_number="+school_number)
        .then((response) => {
            feedingGroupSessionsInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
//session Items
async function newFeedingGroupSessionsItemsInfo(data) {
    return await api.post("main/catering/feeding-sessions-items", data)
        .then((response) => {
            newFeedingGroupSessionsItemsInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchFeedingSessionsItems() {
    return await api.get("main/catering/feeding-sessions-items")
        .then((response) => {
            feedingSessionsItemsInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

//assembly Items
async function newAssemblyItem(data) {
    return await api.post("main/catering/item-assembly", data)
        .then((response) => {
            newAssemblyItemResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}



async function newDailySession(data) {
    return await api.post("main/catering/feeding-sessions-per-day", data)
        .then((response) => {
            newDailySessionResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchDailySession() {
    return await api.get("main/catering/feeding-sessions-per-day")
        .then((response) => {
            dailySessionResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

//Stocking
async function newStock(data) {
    return await api.post("main/catering/stocking", data)
        .then((response) => {
            newStockResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchStock() {
    return await api.get("main/catering/stocking")
        .then((response) => {
            stockResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
//feedingGroupUsers
async function newFeedingGroupUsers(data) {
    return await api.post("main/catering/feeding-group-users", data)
        .then((response) => {
            newFeedingGroupResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
async function fetchFeedingGroupUserById(userId) {
    return await api.get("main/catering/feeding-group-users?User-Number="+userId)
        .then((response) => {
            feedingGroupUsersResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchMenuItemDetails(menuNumber) {
    return await api.get("main/catering/menu-items/"+menuNumber)
        .then((response) => {
            menuItemDetailsResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
async function updateMenuItem(data,menuItemNumber) {
    return await api.put("main/catering/menu-items/"+menuItemNumber,data)
        .then((response) => {
            updateMenuItemResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function updateAssemblyItem(data,menuItemNumber) {
    return await api.put("main/catering/menu-items/"+menuItemNumber,data)
        .then((response) => {
            updateItemAssemblyResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
// {{baseUrl}}/catering/menu-items/filter/{{CAMPUS_ID}}
async function filterMenuItem(campusN) {
    return await api.get("main/catering/menu-items/filter/"+campusN)
        .then((response) => {
            filterMenuResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

//feedingGroupUsers
async function newGroupSession(data) {
    return await api.post("main/catering/feeding-group-sessions", data)
        .then((response) => {
            newGroupSessionResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchFeedGroupSessions() {
    return await api.get("main/catering/feeding-group-sessions")
        .then((response) => {
            feedGroupSessionsInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function newGroupGroupsPerDay(data) {
    return await api.post("main/catering/feeding-groups-per-day", data)
        .then((response) => {
            newFeedingGroupsPerDayResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchFeedGroupsPerDay() {
    return await api.get("main/catering/feeding-groups-per-day")
        .then((response) => {
            feedGroupPerDayInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function newMeal(data) {
    return await api.post("main/catering/meals", data)
        .then((response) => {
            newMealsResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchMealsCostProjection(data) {
      let start_date =  data?.start_date ?? ""
      let end_date =  data?.end_date ?? ""
      let campus_number =   data?.campus_number ?? ""
    return await api.get("main/catering/meal-projections?start_date="+start_date+"&end_date="+end_date+"&campus_number="+campus_number)
        .then((response) => {
            mealsCostProjectionResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchMeals(campusNumber,meal_courseNumber) {
    return await api.get("main/catering/meals?campus_number="+campusNumber+"&meal_course_number="+meal_courseNumber)
        .then((response) => {
            mealsResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}


async function fetchGroupUsersList(data) {
    // let  page = data?.page ?? ""
    // let  per_page =  data?.per_page ?? ""
    let  feeding_group_number =   data?.feeding_group_number ?? ""
    let  school_number =   data?.school_number ?? ""
    let  campus_number =   data?.campus_number ?? ""

    return await api.get("main/catering/feeding-group-users?school_number="+school_number+"&campus_number="+campus_number+"&feeding-group_number="+feeding_group_number)
        .then((response) => {
            feedingGroupUsersListResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function fetchUsersToAssign() {

    return await api.get("main/catering/feeding-group-users/available")
        .then((response) => {
            feedingGroupUsersAvailableResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function updateFeedingSession(data) {
    return await api.post("main/catering/feeding-sessions/update", data)
        .then((response) => {
            updateFeedingSessionResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}


async function deleteFeedingSession(data) {
    return await api.post("main/catering/feeding-sessions/delete?feeding_session_number="+data.feeding_session_number)
        .then((response) => {
            deleteFeedingSessionResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}

async function deleteFeedingGroup(data) {
    return await api.post("main/catering/feeding-groups/delete?feeding_group_number="+data.feeding_group_number)
        .then((response) => {
            deleteFeedingGroupResponse.value = response.data
        })
        .catch((response) => {
            if(response && response.response){
                errorMessage.value = response.response.data
            }
        })
}
    return {
        newUnitOfMeasureInfoResponse,
        errorMessage,
        mealsCostProjectionResponse,
        newUnitOfMeasureInfo,
        fetchUnitOfMeasureInfo,
        deleteUnitOfMeasure,
        UnitOfMeasureInfoResponse,
        deleteUnitOfMeasureInfoResponse,
        updateUnitOfMeasureInfoResponse,
        updateUnitOfMeasure,
        newMenuItemInfo,
        newMenuItemInfoResponse,
        menuItemResponse,
        fetchMenuItem,
        newFeedingGroupInfo,
        fetchFeedingGroup,
        feedingGroupInfoResponse,
        newFeedingGroupInfoResponse,
        feedingGroupSessionsInfoResponse,
        newFeedingGroupSessionsInfo,
        newFeedingGroupSessionsInfoResponse,
        fetchFeedingGroupSessions,
        feedingSessionsItemsInfoResponse,
        fetchFeedingSessionsItems,
        newFeedingGroupSessionsItemsInfoResponse,
        newFeedingGroupSessionsItemsInfo,
        // assemblyItemResponse,
        newAssemblyItem,
        // fetchAssemblyItem,
        newAssemblyItemResponse,
        newDailySession,
        fetchDailySession,
        newDailySessionResponse,
        dailySessionResponse,
        newStock,
        fetchStock,
        newStockResponse,
        stockResponse,
        newFeedingGroupResponse, 
        newFeedingGroupUsers,
        feedingGroupUsersResponse,
        fetchFeedingGroupUserById,
        menuItemDetailsResponse,
        fetchMenuItemDetails,
        updateMenuItemResponse,
        updateMenuItem,
        updateItemAssemblyResponse,
        updateAssemblyItem,
        filterMenuResponse, 
        filterMenuItem,
        newGroupSessionResponse,
        newGroupSession,
        fetchFeedGroupSessions,
        feedGroupSessionsInfoResponse,
        newGroupGroupsPerDay,
        newFeedingGroupsPerDayResponse,
        fetchFeedGroupsPerDay,
        feedGroupPerDayInfoResponse,
        newMealsResponse,
        newMeal,
        mealsResponse,
        fetchMeals,
        fetchMealsCostProjection,
        editFeedingGroupInfoResponse,
        editFeedingGroupInfo,
        menuItemPaginatedResponse,
        fetchMenuItemPaginated,
        feedingGroupUsersListResponse,
        fetchGroupUsersList,
        feedingGroupUsersAvailableResponse,
        fetchUsersToAssign,
        updateFeedingSession,
        deleteFeedingSessionResponse,
        deleteFeedingSession,
        deleteFeedingGroupResponse,
        deleteFeedingGroup,
        updateFeedingSessionResponse
    }
} )