<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"
  import api from "@/config/api.js";
  import VictoriousLogo from "@/assets/images/victorious-logo.png";

const notificationStore = useNotificationStore()
const errorMessage = ref(null)
const loader = ref(false)
const entityStore = useEntityStore()

  const title = ref(null)
  const logoNumber = ref(null)
  const logo = ref(null)
  const logoUrl = ref(null)

  onMounted(() => {
    fetchConfig()
  })

  const fetchConfig = () =>{
     entityStore.fetchConfigureLanding()
  }

  const dashboardConfig = () =>{
    loader.value = true
    const formData = new FormData();
    formData.set("logo", logo.value.files[0]);
    formData.set("title", title.value);

    entityStore.configureLanding(formData)

  }

  watch (
    () => entityStore.newLandingPageResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
        fetchConfig()
      }
    }
)

  watch (
    () => entityStore.landingPageResponse,
    async (data) => {
      if(data){
          let path = api.defaults.baseURL + "/attachments/download/"
            title.value = data?.title
           logoNumber.value = data?.logo_attachment_number
        logoUrl.value = path+logoNumber.value
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
    }
)

</script>
<template>
    <div>

    <form @submit.prevent="dashboardConfig">
      
      <div class="mb-2">
        <label class="text-sm">Landing Page Name</label>
        <input  
           v-model="title"
           style="outline: none 0 !important; box-shadow: none;"
           type="text"
           required
           class="form-control form-control-sm">
      </div>

<!--      <div class="mb-2">
        <label class="text-sm">Landing Page Description</label>
             <textarea
              v-model="formData.description"  style="outline: none 0 !important; box-shadow: none;"
             class="form-control" ></textarea>
      </div>-->


         
      <div class="mb-2">
        <label class="text-sm">Logo</label>
        <input
            ref="logo"
            style="outline: none 0 !important; box-shadow: none;"
             type="file"
              accept="image/*"
            required
            class="form-control
            form-control-sm">
      </div>

      <div class="border p-2 rounded-md w-[20%] mt-3">
        <img v-if="logoNumber" alt="logo" style="width: 200px;" :src="logoUrl"/>
      </div>
        
      <div class="flex justify-content-end mt-3" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
           <small>{{logoNumber ? 'Change' : 'Submit'}}  </small>
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