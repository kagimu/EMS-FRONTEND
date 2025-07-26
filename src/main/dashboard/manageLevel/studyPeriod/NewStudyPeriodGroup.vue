<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";

const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const errorMessage = ref(null)
const loader = ref(false)
const studyPeriodStore = useStudyPeriodStore()
const schoolNumber = routerData.currentRoute.value.query.sch
const study_group_number = ref(false)

const props = defineProps({
    studyPeriodGroupNameData:{}
})


const form = reactive({
  school_number:schoolNumber,
 name:null,
})


onMounted(
    () =>{
        getStudyPeriodGroupNameInfo()
    }
)

const getStudyPeriodGroupNameInfo = () => {
let draft = props.studyPeriodGroupNameData
if(draft.study_period_name_number){
form.name = draft.name
study_group_number.value = true
}
}

const addStudyPeriodGroupName = () => {
  loader.value = true
  if(props.studyPeriodGroupNameData.study_period_name_number){
    form.study_period_name_number = props.studyPeriodGroupNameData.study_period_name_number
    studyPeriodStore.editStudyPeriodGroupName(form)
  }else {
    studyPeriodStore.newStudyPeriodGroupName(form)
  }
  
}



watch(
    () => studyPeriodStore.newStudyPeriodGroupNameResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.name = ""
        notificationStore.successToast("Success", data.message)
        studyPeriodStore.fetchStudyPeriodGroupName(schoolNumber)
      }
    }
)


watch(
    () => studyPeriodStore.editStudyPeriodGroupNameResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Success", data.message)
        studyPeriodStore.fetchStudyPeriodGroupName(schoolNumber)
      }
    }
)



watch(
    () => studyPeriodStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)


</script> 

<template>
  <div>

    <form @submit.prevent="addStudyPeriodGroupName">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="mb-2">
        <label class="mb-1"><small> Study Period Group Name</small></label>
        <input type="text" v-model.trim="form.name" class="form-control shadow-none" required>
      </div>


      <div class="flex justify-content-end mt-4" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
              {{ study_group_number ?'Edit Data':' Save' }}
              <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </span>
        </button>
      </div>

    </form>


  </div>

</template>


<style scoped>

</style>