<script setup>
import {onMounted, reactive, ref, watch,computed} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import useCommonsStore from "@/composables/useCommons.js";

const commons = useCommonsStore()
const productStore= useServiceStore()
const  notificationStore  = useNotificationStore()

const buttonLoader = ref(false)
let errorMessage = ref(null)

const cost = ref(null)
const discount_amount = ref(null)




const discount_percentage = computed(() => {
  if (cost.value !== null && discount_amount.value !== null) {
    const actualPrice = parseFloat(cost.value);
    const discountPrice = parseFloat(discount_amount.value);
    if (actualPrice > 0 && discountPrice > 0 && discountPrice <= actualPrice) {
      return ((actualPrice - discountPrice) / actualPrice) * 100;
    }
  }
  return null;
})

const formData = reactive({
    description: null,
    name:null,
    prefix:null,
    cost:null
})





const createNewProduct = () =>{
// alert(JSON.stringify(formData))
// parseInt
let Data = reactive({
    description: formData.description,
    name:formData.name,
    prefix:formData.name,
    cost:parseInt(formData.cost)
})
buttonLoader.value=true
productStore.createNewProduct(Data)
}

watch (
    () => productStore.newProductResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        await productStore.fetchProductsList()
        formData.description = null,
        formData.name = null,
        formData.prefix = null,
        formData.cost = null,
        formData.discount_amount = null
        formData.discount_percentage = null
      }
    },
    {deep:true}
)


</script>

<template>
        <form @submit.prevent="createNewProduct">

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
      <input @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10" v-model="cost" @input="computediscount_percentage" style="outline: none 0 !important; box-shadow: none;" type="text" required class="form-control form-select-sm">
    </div>


            <div class="mb-2">
                <label class="textColor"><small>Description</small></label>
                <textarea v-model="formData.description" class="form-control "></textarea>
            </div>
            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button type="submit" class="btn btn-primary border-0 btn-sm">
                     <small><i class="bi bi-save"></i> submit</small>
                     <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                        </span>
                </button>
            </div>
        </form>
   
</template>


<style scoped>
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>