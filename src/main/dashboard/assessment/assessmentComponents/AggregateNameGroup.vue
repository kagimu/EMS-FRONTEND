<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import NewAggregateNameGroup from "@/main/dashboard/assessment/assessmentComponents/NewAggregateNameGroup.vue"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const  notificationStore  = useNotificationStore()
const assessmentStore = useAssessmentStore()
const errorMessage  = ref(null)
const schoolList = ref([])
const schoolStore = useSchoolStore()
const { can } = useAbility()
const aggregateGroupData = ref([])
const showAggregateGroupModal = ref(false)

const form = reactive({
  school_number:""
})

onMounted(() => {
  schoolStore.fetchSchools()
    }
)

const addAggregateNameGroup = () => {
  showAggregateGroupModal.value = true
}

const fetchAggregateGroup = () =>{
  assessmentStore.fetchAggregateGroupName(form)
}

watch (
  () => assessmentStore.newAggregateNameGroupResponse,
  async (data) => {
    if(data){
      showAggregateGroupModal.value = false
      notificationStore.successToast("Success", data.message)
      fetchAggregateGroup()

    }
  }
)

watch(
    () => assessmentStore.aggregateNameGroupResponse,
    async (data) => {
      if(data){
        aggregateGroupData.value = data.data
      }
    },
    {deep:true}
)



  watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
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

      <AppModal title="Add Aggregate Group Name" v-model="showAggregateGroupModal" xs>
<NewAggregateNameGroup></NewAggregateNameGroup>
      </AppModal>



      <div class="row">
            <div class="col-12">
              <div class="">
           <div class="flex flex-grow justify-between">
            <div>
               <p class="mt-3 ml-4 text-gray-600">Aggregate Group Name</p>

               <div class="mb-2 ml-4">
          <select
              v-model="form.school_number"
              class="form-select form-select-sm" required
              style="box-shadow: none;"
              @change="fetchAggregateGroup(form.school_number)"
          >
            <option disabled value="">--Select School--</option>
            <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
      </div>
            </div>

            <div>
                <button
                    @click="addAggregateNameGroup"
                      style="float: right; margin-right: 5px;"
                      type="button"
                      class="btn btn-primary btn-sm m-4">
                    <i class="bi bi-plus"></i>
                    New Aggregate Group Name
                </button>

            </div>
    
           </div>
              
                <div class="card-body" >
        <div >
          <div class="row">
      <div class="col-12">


      </div>
    </div>  
    {{ aggregateGroupData }} 
      <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th>#</th>
          <th scope="col">Name</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(list,index) in aggregateGroupData" :key="index">
            {{ list }}
            <td>{{ index+1 }}</td>
            <td>{{ list.name }}</td>
            <td>  <i
                  class="bi-pencil ml-2 cursor-pointer"
                  style="font-size: 14px;"
               ></i>
              <i
              style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"></i></td>
          </tr>
      
    
      
        </tbody>
      </table>
        </div>
        </div>
        </div>
        </div>
        </div>
    </div>
    
    
    
    </template>
    

    
    <style scoped>
    
    </style>