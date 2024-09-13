<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"

const notificationStore = useNotificationStore()
const errorMessage = ref(null)
const loader = ref(false)
const entityStore = useEntityStore()

  const formData = reactive({
    title:null,
    description:null
  })

  const dashboardConfig = () =>{
    loader.value = true
    alert(JSON.stringify(formData))
    entityStore.configureLanding(formData)
  }

  watch (
    () => entityStore.newLandingPageResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
        entityStore.fetchConfigureLanding()
      }
    }
)

watch (
    () => entityStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

</script>
<template>
    <div>
    <form @submit.prevent="dashboardConfig">
      
      <div class="mb-2">
        <label class="text-sm text-sm">Landing Page Name</label>
        <input  
           v-model="formData.title"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required class="form-control form-control-sm">
      </div>

      <div class="mb-2">
        <label class="text-sm text-sm">Landing Page Description</label>
             <textarea
              v-model="formData.description"  style="outline: none 0 !important; box-shadow: none;"
             class="form-control" ></textarea>
      </div>
         
      <div class="mb-2">
        <label class="text-sm text-sm">Logo</label>
        <input  
            style="outline: none 0 !important; box-shadow: none;"
             type="file" required class="form-control form-control-sm">
      </div>
      
        
      <div class="flex justify-content-end mt-3" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
           <small> Submit </small>
              <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
        </button>
      </div>

    </form>
</div>
</template>


<style>
</style>