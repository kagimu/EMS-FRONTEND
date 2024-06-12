import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useEntityStore = defineStore("entity", () => {
    let newEntityResponse = ref(null)
    let editEntityResponse = ref(null)
    let  entityResponse= ref(null)
    let entityToUserResponse = ref(null)
    let currentEntityResponse = ref(null)
    let currentSelectedEntityResponse = ref(null)
    let deleteEntityResponse = ref(null)
    const errorMessage = ref(null)

    async function newEntity(data) {
        return await api.post("main/eos/entity/add", data)
            .then((response) => {
                newEntityResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function editEntity(data) {
        return await api.post("main/eos/entity/update", data)
            .then((response) => {
                editEntityResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function deleteEntity(data) {
        return await api.post("main/eos/entity/delete", data)
            .then((response) => {
                deleteEntityResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function fetchEntity() {
        return await api.get("main/eos/my-entities")
            .then((response) => {
                entityResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }
 
    async function addEntityToUser(data) {
        return await api.post("main/eos/add-user-to-entity",data)
            .then((response) => {
                entityToUserResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function switchEntity(number) {
        return await api.post("main/eos/entity/current?entity_number="+number)
            .then((response) => {
                currentEntityResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    async function currentSelectedEntity(number) {
        return await api.get("main/eos/entity/current")
            .then((response) => {
                currentSelectedEntityResponse.value = response.data
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    return {
        newEntityResponse,
        errorMessage,
        entityResponse,
        entityToUserResponse,
        currentEntityResponse,
        editEntityResponse,
        currentSelectedEntityResponse,
        deleteEntityResponse,
        newEntity,
        editEntity,
        addEntityToUser,
        fetchEntity,
        switchEntity,
        currentSelectedEntity,
        deleteEntity

    }
} )