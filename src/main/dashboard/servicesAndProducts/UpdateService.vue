<template>
        <form @submit.prevent="updateService">
          <div class="mb-2">
            <label class="textColor"><small>Service Name</small></label>
            <input maxlength="10" type="text" style="outline: none 0 !important;box-shadow: none;"
                required class="form-control form-select-sm" v-model="formData.description">
          </div>
            <div class="mb-2">
                <label class="textColor"><small>Cost</small></label>
                <input v-model="formData.cost" style="outline: none 0 !important; box-shadow: none;" type="number"  required  class="form-control form-select-sm">
            </div>
            <div class="mb-2">
                <label class="textColor"><small>Addition Info</small></label>
                <textarea class="form-control "></textarea>
            </div>
            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button type="submit" class="btn btn-primary border-0"> <i class="bi bi-save"></i> Update
                    <!-- <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status"><span class="visually-hidden">Loading...</span> 
                        </span> -->
                </button>
            </div>
        </form>
   
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";

const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
let errorMessage = ref(null)

const props = defineProps({
    service:{}
})

const formData = reactive({
    description: null,
    cost: null,
})


watch (
    () => props.service,
    async (data) => {
      if(data){
        formData.description = props.service.description
        formData.cost = props.service.cost
      }
    },
    {deep:true}
)

const updateService = () =>{
alert(JSON.stringify(formData))
serviceStore.updateService(props.serviceid.serviceNumber,formData)
}


watch(
    () => serviceStore.updateServiceResponse,
    async (data) => {
      if(data){
         notificationStore.successToast("Success", data.message)
        await serviceStore.fetchServicesList()
      }
    },
    {deep:true}
)
watch (
    () => serviceStore.errorMessage,
    async (data) => {
      if(data){
   //error message

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