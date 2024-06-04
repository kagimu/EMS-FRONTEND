import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useRolesStore = defineStore("roles", () => {
    const newRoleResponse = ref(null)
    const errorMessage = ref(null)
    const  roleResponse = ref(null)
    const permisionGroupsResponse = ref(null)
    const  roleByIdResponse = ref(null)
    const deleteRoleResponse = ref(null)
    const updateRoleResponse = ref(null)
    const editRoleResponse = ref(null)


    async function createNewRole(data) {
        return await api.post("main/settings/roles",data)
            .then((response) => {
             newRoleResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchRoles() {
        return await api.get("main/settings/roles")
            .then((response) => {
               roleResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchPermissionGroups() {
        return await api.get("main/settings/permissions/groups")
            .then((response) => {
               permisionGroupsResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function fetchRolesById(roleId,data) {
        return await api.get("main/settings/roles/"+roleId,data)
            .then((response) => {
                roleByIdResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }


    async function updateRole(data) {
        return await api.post("main/seetings/roles/update/",data)
            .then((response) => {
             updateRoleResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    async function deleteRole(roleN) {
        return await api.post("main/settings/roles/delete"+roleN)
            .then((response) => {
             deleteRoleResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }
    async function editRole(data) {
        return await api.post("main/settings/roles/update/"+data.role_number,data)
            .then((response) => {
             editRoleResponse.value = response.data
            })
            .catch((response) => {
                if(response){
                    errorMessage.value = response.response.data
                }
            })
    }

    return {
        errorMessage,
        newRoleResponse,
        createNewRole,
        fetchRoles,
        roleResponse,
        fetchPermissionGroups,
        permisionGroupsResponse,
        roleByIdResponse,
        fetchRolesById,
        deleteRoleResponse,
        deleteRole,
        updateRoleResponse,
        updateRole,
        editRoleResponse,
        editRole
    }
})