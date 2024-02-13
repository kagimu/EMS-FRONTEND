<template>
        <form @submit.prevent="createNewProduct">

          <div class="mb-2">
            <label class="textColor"><small>Product Name</small></label>
            <input  type="text" style="outline: none 0 !important;box-shadow: none;"
                required class="form-control form-select-sm" v-model="formData.name">
          </div>
            <div class="mb-2">
                <label class="textColor"><small>Cost</small></label>
                <input v-model="formData.cost" style="outline: none 0 !important; box-shadow: none;" type="number"  required  class="form-control form-select-sm">
            </div>

        

            <div class="mb-2">
                <label class="textColor"><small>Addition Info</small></label>
                <textarea v-model="formData.description" class="form-control "></textarea>
            </div>
            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button type="submit" class="btn btn-primary border-0 btn-sm">
                     <small><i class="bi bi-save"></i> submit</small>
             
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

const formData = reactive({
    description: null,
    cost: null,
    name:null,
    mandatory:false,
    campus_numbers:[],
    payment_mode:null

})





const createNewProduct = () =>{
// alert(JSON.stringify(formData))
productStore.createNewProduct(formData)
}
watch (
    () => productStore.newProductResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => productStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
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