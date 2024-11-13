<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"

const notificationStore = useNotificationStore()
const errorMessage = ref(null)
const loader = ref(false)
const entityStore = useEntityStore()

const props = defineProps({
    entityData:{}
  })



  const formData = reactive({
    entity_number:null,
    name:null,
    phone:null,
    address:null,
    email:null,
    whatsapp:null,
    facebook:null,
    twitter:null,
    instagram:null,
    website:null
  })

  onMounted(() => {
    filterEntityDraft()
  })


  watch (
      () => props.entityData,
      async (data) => {
        if(data){
         filterEntityDraft()
        }
      }
  )

  const filterEntityDraft = () => {
    let draft = props.entityData

    formData.entity_number = draft?.number ?? ""
    formData.name = draft?.name ?? ""
    formData.phone = draft?.phone ?? ""
    formData.address = draft?.address ?? ""
    formData.email = draft?.email ?? ""
    formData.website = draft?.website
    formData.whatsapp = draft?.whatsapp
    formData.address = draft?.address
    formData.twitter = draft?.twitter
    formData.facebook = draft?.facebook
    formData.instagram = draft?.instagram
    formData.linkedin = draft?.linkedin
  }

  const addEntity = () =>{
    loader.value = true
    if(formData.entity_number){
      entityStore.editEntity(formData)
    }else {
      // formData.whatsapp = parseInt(formData.whatsapp)
      entityStore.newEntity(formData)
    }

  }


  watch (
      () => entityStore.editEntityResponse,
      async (data) => {
        if(data){
          loader.value = false
        }
      }
  )


  watch (
    () => entityStore.newEntityResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
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

    <form @submit.prevent="addEntity">
      <div class="row">
            <div class="col-lg-6">
          <h3 class="text-sm font-semibold mb-4 ">Contact Information</h3>
      <div class="mb-2">
        <label class="text-sm text-sm">Name</label>
        <input  
           v-model="formData.name"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required  class="form-input mt-1 block w-full border-gray-300 rounded-md">
      </div>

         
      <div class="mb-2">
        <label class="text-sm text-sm">Email</label>
        <input  
           v-model="formData.email"  style="outline: none 0 !important; box-shadow: none;"
             type="email" required  class="form-input mt-1 block w-full border-gray-300 rounded-md">
      </div>
         
      <div class="mb-2">
        <label class="text-sm text-sm">Phone</label>
        <input  
           v-model="formData.phone"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required  class="form-input mt-1 block w-full border-gray-300 rounded-md">
      </div>
         
      <div class="mb-2">
        <label class="text-sm text-sm">Address</label>
        <input  
           v-model="formData.address"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required  class="form-input mt-1 block w-full border-gray-300 rounded-md">
      </div>

      <div class="mb-2">
        <label class="text-sm text-sm">Website</label>
        <input  
           v-model="formData.website"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required  class="form-input mt-1 block w-full border-gray-300 rounded-md">
      </div>
      </div>
      <div class="col-lg-6">
        <h3 class="text-sm font-semibold mt-6 mb-4">Social Media Links</h3>
      <div class="mb-2">
            <label for="phone" class="block text-gray-700 text-sm">Whatsapp No.</label>
            <input  
           v-model="formData.whatsapp"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required   class="form-input mt-1 block w-full border-gray-300 rounded-md">
          </div>

                 <div class="mb-3">
            <label for="facebook" class="block text-gray-700 text-sm">Facebook</label>
            <input type="url" id="facebook" v-model="formData.facebook"
                    class="form-input mt-1 block w-full border-gray-300 rounded-md"/>
          </div>

          <div class="mb-3">
            <label for="twitter" class="block text-gray-700 text-sm">Twitter</label>
            <input type="url" id="twitter" v-model="formData.twitter"
                    class="form-input mt-1 block w-full border-gray-300 rounded-md"/>
          </div>

          <div class="mb-3">
            <label for="linkedin" class="block text-gray-700 text-sm">LinkedIn</label>
            <input type="url" id="linkedin" v-model="formData.linkedin"
                    class="form-input mt-1 block w-full border-gray-300 rounded-md"/>
          </div>

          <div class="mb-3">
            <label for="instagram" class="block text-gray-700 text-sm">Instagram</label>
            <input type="url" id="instagram" v-model="formData.instagram"
                    class="form-input mt-1 block w-full border-gray-300 rounded-md"/>
          </div>
        </div>

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
.form-input {
  padding: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
}

button {
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
</style>