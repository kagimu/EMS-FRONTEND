<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useRouter} from "vue-router";

const routerData = useRouter()
let schoolNumber = routerData.currentRoute.value.query.sch
const schoolStore = useSchoolStore()
const assessmentStore= useAssessmentStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()


const buttonLoader = ref(false)
const errorMessage = ref(null)

const schoolList = ref([])
const number = ref("")


const form = reactive({
  name:"",
  code:"",
  school_number:schoolNumber
})

const props = defineProps({
  aggregateGroupDataInfo:{}
})

onMounted(() => {
      schoolStore.fetchSchools()
      getAssessmentGroupInfo()
      
    }
)

watch (
    () => props.aggregateGroupDataInfo,
    async (data) => {
      if(data){
        getAssessmentGroupInfo()
      }
    }
)


const getAssessmentGroupInfo = () => {
  let draft  = props.aggregateGroupDataInfo
  if(draft?.number){
    form.name = draft?.name
    form.code = draft?.code
    number.value = draft?.number
  }
 
  
}


const createAggregateGroupName = () =>{

  form.code = parseInt(form.code)


  buttonLoader.value = true
  if(number.value){
    form.number = number.value
    assessmentStore.updateAggregateGroupName(form)
  }
  else{
    assessmentStore.createAggregateGroupName(form)
  }
  
}

watch (
  () => assessmentStore.newAggregateNameGroupResponse,
  async (data) => {
    if(data){
      buttonLoader.value = false
      notificationStore.successToast("Success", data.message)
    }
  }
)

watch (
  () => assessmentStore.updateAggregateNameGroupResponse,
  async (data) => {
    if(data){
      buttonLoader.value = false
      notificationStore.successToast("Success", data.message)
    }
  }
)


watch (
  () => assessmentStore.errorMessage,
  async (data) => {
    if(data){
      errorMessage.value = data.message
      buttonLoader.value = false
      notificationStore.errorToast("Error",data.message)
    }
  },
  {deep:true}
)


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)

</script>
<template>
    <div>

        <div class="modal-content">
      <div class="modal-body">
        <form @submit.prevent="createAggregateGroupName()">


          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Code</div>
            <input
                @keypress="commons.codeValidator($event)"
                maxlength="10"
                v-model="form.code"
                required
                @paste.prevent
                class="form-control form-select-sm shadow-none">
          </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Name</div>
            <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="e.g Kindergatten">
          </div>

     <div class="flex justify-content-end mt-4" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small>
                   <i class="bi bi-save"></i>
                    {{number ? "Edit" : "Submit"}}
                 </small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
    </div>
    </div>
    </div>

</template>



<style scoped>

</style>