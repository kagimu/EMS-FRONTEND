<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import NewAggregateNameGroup from "@/main/dashboard/assessment/assessmentComponents/NewAggregateNameGroup.vue"
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useRouter} from "vue-router";

const  notificationStore  = useNotificationStore()
const assessmentStore = useAssessmentStore()
const errorMessage  = ref(null)
const schoolList = ref([])
const schoolStore = useSchoolStore()
const { can } = useAbility()
const aggregateGroupData = ref([])
const showAggregateGroupModal = ref(false)
const aggregateGroupDataInfo = ref([])
const editMode = ref(false)

const routerData = useRouter()
let schoolNumber = routerData.currentRoute.value.query.sch

const form = reactive({
  school_number:schoolNumber
})


onMounted(() => {
  schoolStore.fetchSchools()
  fetchAggregateGroup()
    }
)



const addAggregateNameGroup = () => {
  aggregateGroupDataInfo.value = ""
  showAggregateGroupModal.value = true
  editMode.value = false;
}

const fetchAggregateGroup = () =>{
  assessmentStore.fetchAggregateGroupName(schoolNumber)
}

import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);


const deleteGrade = async (data) => {

  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete " + data.name);
  if (agreed) {
    let formD = {
      grade_group_number : data.number
    }
    assessmentStore.deleteAggregateGroupName(formD)
  }
  

}

const showEditModal = (data) =>{
  aggregateGroupDataInfo.value = data
  showAggregateGroupModal.value = true
  editMode.value = true
}

watch (
  () => assessmentStore.newAggregateNameGroupResponse,
  async (data) => {
    if(data){
      showAggregateGroupModal.value = false
      fetchAggregateGroup()

    }
  }
)

watch (
  () => assessmentStore.updateAggregateNameGroupResponse,
  async (data) => {
    if(data){
      showAggregateGroupModal.value = 
      editMode.value = false
      fetchAggregateGroup()

    }
  }
)

watch (
  () => assessmentStore.deleteAggregateNameGroupResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
      fetchAggregateGroup()
    }
  }
)


watch(
    () => assessmentStore.aggregateNameGroupResponse,
    async (data) => {
      if(data){
        aggregateGroupData.value = data.gradeGroups
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


 <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

      <AppModal :title= "editMode?'Edit Aggregate Group Name':'Add Aggregate Group Name' " v-model="showAggregateGroupModal" lg>
          <NewAggregateNameGroup :aggregateGroupDataInfo="aggregateGroupDataInfo"></NewAggregateNameGroup>
      </AppModal>



      <div class="row">
            <div class="col-12">
              <div class="">
           <div class="flex flex-grow justify-between">
            <div>
               <p class="mt-3 ml-4 text-gray-600">Aggregate Group Name</p>
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
    <!-- {{ aggregateGroupData }}  -->
      <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th>#</th>
          <th scope="col">Names</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(list,index) in aggregateGroupData" :key="index">
            <td>{{ index+1 }}</td>
            <td>{{ list.name }}</td>
            <td>
              <button @click="showEditModal(list)"   type="button">
                  <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                </button>
                &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
                <button type="button" @click="deleteGrade(list)">
                  <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
                </button>
            </td>
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