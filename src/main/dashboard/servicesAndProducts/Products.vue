<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import UpdateProduct from "./UpdateProduct.vue";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);


import { useAbility } from '@casl/vue';
import NewService from "@/main/dashboard/servicesAndProducts/NewService.vue";
const showActionDialog = ref(false)
const serviceStore = useServiceStore()

const { can } = useAbility()


const productsList = ref( [])
let errorMessage = ref(null)
const productListData = ref(null)
const productStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const showDialog = ref(false)


const openProductModal = () =>{
  productListData.value = ""
  showActionDialog.value=true
}

function showEditModal(product){
  productListData.value = product
  showActionDialog.value = true
}

onMounted(
    async () => {
      await productStore.fetchProductsList()
    } )

watch(
    () => productStore.productListResponse,
    async (data) => {
      if(data){
        productsList.value = data
      }
    },
    {deep:true}
)

watch (
    () => productStore.newProductResponse,
    async (data) => {
      if(data){
        showActionDialog.value = false
        await productStore.fetchProductsList()
      }
    },
    {deep:true}
)

watch (
    () => productStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)




const deleteProduct = async (sid) => {

  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + sid.Item.name);
  if (agreed) {
    await productStore.deleteProduct(sid.item_number	)
  }


}


watch (
    () => productStore.deleteProductResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        await productStore.fetchProductsList()
      }
    }
)



watch (
    () => serviceStore.updateProductResponse,
    async (data) => {
      if(data){
       await productStore.fetchProductsList()
        showActionDialog.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => serviceStore.newProductResponse,
    async (data) => {
      if(data){
       await productStore.fetchProductsList()
        showActionDialog.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)


</script>
<template>
 

      <AppModal title="New Product" v-model="showActionDialog" xl4>
        <NewService :serviceDetails="productListData" productType="product"></NewService>
      </AppModal>

  <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

        <div class="row">
      <div class="col-12">
        <div class="cad mt-3">
          <div class="card-body" style="padding: 0;">

    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Product
          <button 
        v-if="can('create_product','general')"
        style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
        @click="openProductModal()">
        <i class="bi bi-plus"></i>&nbsp;<small>
          Add Product</small></button>
          
       </h6>
      <table

        class="table table-striped table-hover"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Cost</th>
            <th>Addition Info</th>
            <th>#</th>
          </tr> 
        </thead>
        <tbody>
          <tr v-for="(productData, index) in productsList" :key="index" >
            <td>{{ productData.item.name}}</td>
            <td>{{ productData.item.cost}}</td>
            <td>{{ productData.item.description}}</td>
            <td>
              <div class="flex">
                <button
                    class="mr-2"
                    v-if="can('edit_product','general')"
                    @click="showEditModal(productData)"><i class="bi bi-pencil"></i></button>

                <button
                    v-if="can('delete_product','general')"
                    @click="deleteProduct(productData)" class="link-danger"><i class="bi bi-trash"></i>
                </button>
              </div>
              </td>
          </tr>      
        </tbody>
      </table>
      </div>
    </div>
  </div>
  </div>
    </div>
    <!-- //editing modal  -->    
    <div class="modal fade" id="editServiceModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">UpdateService/Product</h6>
                        <button aria-label="Close" class="btn-close btn-sm" data-bs-dismiss="modal"
                                style="margin-right: 5px;" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">           
                           <UpdateProduct :product="productListData"></UpdateProduct>
                        </div>
                    </div>
                </div>
            </div>
        </div>



      </div>
       
    </template>
    

  
    <style scoped>
    
    </style>