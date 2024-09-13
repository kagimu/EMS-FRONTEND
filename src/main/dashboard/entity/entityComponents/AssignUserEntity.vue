<script setup>
  import {onMounted,reactive, ref, watch,computed,defineEmits} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"

const notificationStore = useNotificationStore()
const errorMessage = ref(null)
const loader = ref(false)
const entityStore = useEntityStore()
const entityList = ref([])

const props = defineProps({
  userNumber:String
})

  const form = reactive({ 
    entity_number:null,
    user_number:props.userNumber
  })


  const addEntity = () =>{
  //  alert(JSON.stringify(form))
   entityStore.addEntityToUser(form)
  }

  onMounted(() => {
    entityStore.fetchEntity()
   }
  )

  watch (
  () => entityStore.entityResponse,
  async (data) => {
    if (data) {
  entityList.value = data
    }
  },
  { deep: true }
)

  watch (
    () => entityStore.entityToUserResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
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
        <label class="text-sm text-sm">Entity</label>
        <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.entity_number" >
              <option disabled value="">Select Entity</option>
              <option v-for="(list, index) in entityList" :key="index" :value="list.number">{{ list.name }}</option>
            </select>
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