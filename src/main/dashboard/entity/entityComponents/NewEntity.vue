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
    email:null
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

  }

  const addEntity = () =>{
    loader.value = true
    if(formData.entity_number){
      entityStore.editEntity(formData)
    }else {
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
      
      <div class="mb-2">
        <label class="text-sm text-sm">Name</label>
        <input  
           v-model="formData.name"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required class="form-control form-control-sm">
      </div>

         
      <div class="mb-2">
        <label class="text-sm text-sm">Email</label>
        <input  
           v-model="formData.email"  style="outline: none 0 !important; box-shadow: none;"
             type="email" required class="form-control form-control-sm">
      </div>
         
      <div class="mb-2">
        <label class="text-sm text-sm">Phone</label>
        <input  
           v-model="formData.phone"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required class="form-control form-control-sm">
      </div>
         
      <div class="mb-2">
        <label class="text-sm text-sm">Address</label>
        <input  
           v-model="formData.address"  style="outline: none 0 !important; box-shadow: none;"
             type="text" required class="form-control form-control-sm">
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