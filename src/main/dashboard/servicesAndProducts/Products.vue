<template>
    <div>
        <div class="modal fade" id="serviceModal" tabindex="-1"   aria-hidden="true" :class="{ show: showDialog }">
      <div class="modal-dialog">
        <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Product</h6>
                        <button aria-label="Close" class="btn-close btn-sm" data-bs-dismiss="modal"
                                style="margin-right: 5px;" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">           
                           <NewProduct></NewProduct>
                        </div>
                    </div>
                </div>
            </div>
        </div></div>
        </div>
        <div class="row">
      <div class="col-12">
        <div class="cad mt-3">
          <div class="card-body" style="padding: 0;">

    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Product
        <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
        data-bs-target="#serviceModal"  data-bs-toggle="modal" @click="openModal()">
        <i class="bi bi-plus"></i>&nbsp;<small>
          Add Product</small></button>
          
       </h6>
      <table
   
        class="table table-striped"
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
            <td>{{ productData.name}}</td>
            <td>{{ productData.cost}}</td>
            <td>{{ productData.description}}</td>
            <td>
              <button @click="setProductId(productData)" data-bs-target="#editServiceModal"  data-bs-toggle="modal" class="link-primary"><i class="bi bi-pencil"></i></button>&nbsp;&nbsp;   |
              &nbsp;&nbsp; 
              <button  @click="deleteProduct(productData.number)" class="link-danger"><i class="bi bi-trash"></i></button>        
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
                           <UpdateProduct :product="productId"></UpdateProduct>
                        </div>
                    </div>
                </div>
            </div>
        </div></div>
       
    </template>
    
    <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import NewProduct from "./NewProduct.vue";
  import UpdateProduct from "./UpdateProduct.vue";
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";

const productsList = ref( [])
let errorMessage = ref(null)
const productId = ref(null)
const productStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const showDialog = ref(false)

const openModal = () =>{
  showDialog.value=true
}

function setProductId(sId){
productId.value = sId
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
       showDialog.value = false
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
   
  const deleteProduct = (sid) => {
if(!confirm("Are you sure, you want to delete: " + sid)){
  return
}
productStore.deleteProduct(sid)
}


watch (
    () => productStore.deleteProductResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        await productStore.fetchProductsList()
      }
    },
    {deep:true}
)
  </script>
  
    <style scoped>
    
    </style>