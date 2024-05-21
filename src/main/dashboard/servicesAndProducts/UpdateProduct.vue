<template>
          <form @submit.prevent="updateProduct">

<div class="mb-2">
  <label class="textColor"><small>Name</small></label>
  <input  type="text" style="outline: none 0 !important;box-shadow: none;"
      required class="form-control form-select-sm" v-model="formData.name">
</div>
<div class="mb-2">
  <label class="textColor"><small>Prefix</small></label>
  <input  type="text" style="outline: none 0 !important;box-shadow: none;"
      required class="form-control form-select-sm" v-model="formData.prefix">
</div>
  <div class="mb-2">
      <label class="textColor"><small>Actual Price</small></label>
      <input v-model="formData.cost" style="outline: none 0 !important; box-shadow: none;" type="number"  required  class="form-control form-select-sm">
  </div>


  <div class="mb-2">
      <label class="textColor"><small>Description</small></label>
      <textarea v-model="formData.description" class="form-control "></textarea>
  </div>
  <div class="flex justify-content-end mt-2" style="width: 100%;">
      <button type="submit" class="btn btn-primary border-0 btn-sm">
           <small><i class="bi bi-save"></i> Update</small>
           <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
              </span>
      </button>
  </div>
</form>
   
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";

const productStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
let errorMessage = ref(null)

const props = defineProps({
    product:{}
})


const formData = reactive({
    description: null,
    cost: null,
    name:null,
    discount_amount:null,
    discount_percentage:0,
    prefix:null
})

watch (
    () => props.product,
    async (data) => {
      if(data){
        formData.description = props.product.description
        formData.cost = props.product.cost
        formData.name = props.product.name
        formData.discount_amount = props.product.discount_amount
        formData.discount_percentage = props.product.discount_percentage
        formData.prefix = props.product.prefix
      }
    },
    {deep:true}
)

const updateProduct = () =>{
// alert(JSON.stringify(formData))
productStore.updateProduct(props.product.number,formData)
}

onMounted(
    () => {
      productStore.fetchProductsList()
      buttonLoader.value = false
    }
)

watch(
    () => productStore.updateProductResponse,
    async (data) => {
      if(data){
       notificationStore.successToast("Success", data.message)
       buttonLoader.value=false
       await productStore.fetchProductsList()
      }
    },
    {deep:true}
)


</script>

<style scoped>
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>