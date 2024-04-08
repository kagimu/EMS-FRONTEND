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
    const errorMessage = ref(null)

    async function newUnitOfMeasureInfo(data) {
        return await api.post("main/catering/units-of-measure", data)
            .then((response) => {
                newUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
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
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function deleteUnitOfMeasure() {
        return await api.delete("main/")
            .then((response) => {
                deleteUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function updateUnitOfMeasure() {
        return await api.put("main/")
            .then((response) => {
                updateUnitOfMeasureInfoResponse.value = response.data
            })
            .catch((response) => {
                if(response){
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
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchMenuItem() {
        return await api.get("main/catering/menu-items")
            .then((response) => {
                menuItemResponse.value = response.data
            })
            .catch((response) => {
                if(response){
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
            if(response){
                errorMessage.value = response.response.data
            }
        })
}
async function fetchFeedingGroup() {
    return await api.get("main/catering/feeding-groups")
        .then((response) => {
            feedingGroupInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response){
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
            if(response){
                errorMessage.value = response.response.data
            }
        })
}
async function fetchFeedingGroupSessions() {
    return await api.get("main/catering/feeding-sessions")
        .then((response) => {
            feedingGroupSessionsInfoResponse.value = response.data
        })
        .catch((response) => {
            if(response){
                errorMessage.value = response.response.data
            }
        })
}
    return {
        newUnitOfMeasureInfoResponse,
        errorMessage,
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
        fetchFeedingGroupSessions

    }
} )