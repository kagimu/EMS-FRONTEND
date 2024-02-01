<template>
        <form @submit.prevent="createNewService">
          <div class="mb-2">
            <label class="textColor"><small>Campus</small></label><br>
            <input  type="checkbox"  >Main Campus<br>
                <input  type="checkbox">Kampala Campus<br>
                <input  type="checkbox"  >Jinja Campus
          </div>

          <div class="mb-2">
            <label class="textColor"><small>Service Name</small></label>
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
                <button type="submit" class="btn btn-primary border-0"> <i class="bi bi-save"></i> SaveData
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

const formData = reactive({
    description: null,
    cost: null,
    name:null,
})

const createNewService = () =>{
// alert(JSON.stringify(formData))
serviceStore.createNewService(formData)
}
watch (
    () => serviceStore.newServiceResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => serviceStore.errorMessage,
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