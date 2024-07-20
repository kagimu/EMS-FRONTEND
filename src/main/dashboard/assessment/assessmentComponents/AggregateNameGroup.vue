<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import NewAggregateNameGroup from "@/main/dashboard/assessment/assessmentComponents/NewAggregateNameGroup.vue"
import { useAssessmentStore } from "../store/assessment";
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import useNotificationStore from "@/composables/useNotification.js";

const  notificationStore  = useNotificationStore()
const assessmentStore = useAssessmentStore()


const { can } = useAbility()
const aggregateGroupData = ref([])
const showAggregateGroupModal = ref(false)


onMounted(() => {
  fetchAggregateGroup()
    }
)

const addAggregateNameGroup = () => {
  showAggregateGroupModal.value = true
}

const fetchAggregateGroup = () =>{

}


// watch(
//     () => assessmentStore.aggregateScaleResponse,
//     async (data) => {
//       if(data){
//         aggregateData.value = data.data
//       }
//     },
//     {deep:true}
// )



// watch (
//     () => assessmentStore.newAggregateScaleResponse,
//     async (data) => {
//       if(data){
//         showAggregateGroupModal.value = false
//          fetchGradeScale()
//         notificationStore.successToast("Success", data.message)
//       }
//     }
// )

// watch (
//     () => assessmentStore.updateAggregateScaleResponse,
//     async (data) => {
//       if(data){
//         notificationStore.successToast("Success", data.message)
//         fetchGradeScale()
//         showAggregateGroupModal.value = false
//       }
//     }
//   )



// watch (
//     () => assessmentStore.deleteAggregateScaleResponse,
//     async (data) => {
//       if(data){
//         notificationStore.successToast("Success", data.message)
//         fetchGradeScale()
//         deletionLoader.value = false

//       }
//     }
//   )
//   watch (
//     () => assessmentStore.errorMessage,
//     async (data) => {
//       if(data){
//         errorMessage.value = data.message
//         notificationStore.errorToast("Error",data.message)
//       }
//     },
//     {deep:true}
// )


</script>
<template>
    <div>

      <AppModal title="Add Aggregate NameGroup" v-model="showAggregateGroupModal" xs>
<NewAggregateNameGroup></NewAggregateNameGroup>
      </AppModal>



      <div class="row">
            <div class="col-12">
              <div class="">

           <div class="flex flex-grow justify-between">
            <div>
               <p class="mt-3 ml-4 text-gray-600">Aggregate NameGroups</p>
            </div>
            <div>
                <button
                    @click="addAggregateNameGroup"
                      style="float: right; margin-right: 5px;"
                      type="button"
                      class="btn btn-primary btn-sm m-4">
                    <i class="bi bi-plus"></i>
                    New Aggregate NameGroup
                </button>

            </div>
    
           </div>
              
                <div class="card-body" >
        <div >
          <div class="row">
      <div class="col-12">


      </div>
    </div>   
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
          <tr>
            <td>1</td>
            <td>Kindergatten</td>
            <td>  <i
                 
                  class="bi-pencil ml-2 cursor-pointer"
                  style="font-size: 14px;"
               ></i>
              <i
              style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"></i></td>
          </tr>
          <tr>
            <td>2</td>
            <td>Primary</td>
            <td>
              <i
                 
                  class="bi-pencil ml-2 cursor-pointer"
                  style="font-size: 14px;"
               ></i>
              <i
              style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"></i>
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