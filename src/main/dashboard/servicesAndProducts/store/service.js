import { defineStore } from "pinia"
import { ref } from "vue"
import api from "@/config/api.js";

export const useServiceStore = defineStore("service", () => {
    let newServiceResponse = ref(null)
    let errorMessage = ref(null)
    let servicesListResponse = ref(null)
    let deleteServiceResponse = ref(null)
    let updateServiceResponse = ref(null)

    let newProductResponse = ref(null)
    let productListResponse = ref(null)
    let deleteProductResponse = ref(null)
    let updateProductResponse = ref(null)

        async function createNewService(data) {
            return await api.post("main/services", data)
                .then((response) => {
                    newServiceResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchServicesList() {
            return await api.get("main/services")
                .then((response) => {
                    servicesListResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchAllItems() {
            return await api.get("main/items")
                .then((response) => {
                    servicesListResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
    

        async function deleteService(serviceid) {
            return await api.delete("main/services/"+serviceid)
                .then((response) => {
                    deleteServiceResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }
        async function updateService(serviceid,data) {
            return await api.put("main/services/"+serviceid,data)
                .then((response) => {
                    updateServiceResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }



        async function createNewProduct(data) {
            return await api.post("main/products", data)
                .then((response) => {
                    newProductResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }

        async function fetchProductsList() {
            return await api.get("main/products")
                .then((response) => {
                    productListResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.response.data
                    }
                })
        }
    

        async function deleteProduct(productid) {
            return await api.delete("main/products/"+productid)
                .then((response) => {
                    deleteProductResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }
        async function updateProduct(productid,data) {
            return await api.put("main/products/"+productid,data)
                .then((response) => {
                    updateProductResponse.value = response.data
                })
                .catch((response) => {
                    if(response){
                        errorMessage.value = response.data
                    }
                })
        }


    return {
        newServiceResponse,
        errorMessage,      
        createNewService,
        servicesListResponse,
        fetchServicesList,
        deleteServiceResponse,
        deleteService,
        updateServiceResponse,
        updateService,
        newProductResponse,   
        createNewProduct,
        productListResponse,
        fetchProductsList,
        deleteServiceResponse,
        deleteProduct,
        updateProductResponse,
        updateProduct

    }
})