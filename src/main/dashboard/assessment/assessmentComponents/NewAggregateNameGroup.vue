<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)
const assessmentStore= useAssessmentStore()
const schoolList = ref([])
const schoolStore = useSchoolStore()

const form = reactive({
  name:"",
  code:"",
  school_number:""
})

const props = defineProps({
  aggregateGroupDataInfo:{}
})

onMounted(() => {
      schoolStore.fetchSchools()
      getAssessmentGroupInfo()
      
    }
)



const getAssessmentGroupInfo = () => {
  
  if(props.aggregateGroupDataInfo){
    form.name = props.aggregateGroupDataInfo.name
    form.code = props.aggregateGroupDataInfo.code
  }
 
  
}


const createAggregateGroupName = () =>{
  let formData = {
    code:parseInt(form.code),
    school_number:form.school_number,
    name:form.name
  }
  buttonLoader.value = true
  assessmentStore.createAggregateGroupName(formData)
}

watch (
  () => assessmentStore.newAggregateNameGroupResponse,
  async (data) => {
    if(data){
      buttonLoader.value = false
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

      <!-- {{ aggregateGroupDataInfo }} -->
        <div class="modal-content">
      <div class="modal-body">
        <form @submit.prevent="createAggregateGroupName()">

          <div class="mb-2">
          <label class="textColor"><small>School</small> </label>
          <select
              v-model="form.school_number"
              class="form-select form-select-sm"
              style="box-shadow: none;"
          >
            <option disabled value="">--Select School--</option>
            <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
      </div>

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
                 <small><i class="bi bi-save"></i> submit</small>
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