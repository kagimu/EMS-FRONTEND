import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useEntityStore = defineStore("entity", () => {
    let newEntityResponse = ref(null)
    let  entityResponse= ref(null)
    let entityToUserResponse = ref(null)
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

    return {
        newEntityResponse,
        errorMessage,
        entityResponse,
        entityToUserResponse,
        newEntity,
        addEntityToUser,
        fetchEntity
      
    }
} )