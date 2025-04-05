<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import UpdateProduct from "./UpdateProduct.vue";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

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

const schoolStore = useSchoolStore()
const school_number = ref("")
const schoolList = ref([])

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
      await schoolStore.fetchSchools()

      let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
      if(defaultSchoolNo){
          school_number.value = defaultSchoolNo
        }
        filterProducts(school_number.value)

    } )


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    },
    {deep: true}
)

const filterProducts = (schoolN) =>{
  let data = {
    school_number:school_number.value
  }
   productStore.fetchProductsList(data)
}

watch(
    () => productStore.productListResponse,
    async (data) => {
      if(data){
        await schoolStore.fetchSchools()
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
    <div class="col-lg-6">
      <div class="mb-2 ">
        <label class="text-sm"><small>School</small> </label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="school_number"
            @change="filterProducts(school_number)"
        >
          <option disabled value=""> - filter By School -</option>
          <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
          </option>
        </select>
      </div>
    </div>

  </div>


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


       
    </template>
    

  
    <style scoped>
    
    </style>