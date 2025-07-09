<script setup>
import {onMounted,ref, watch} from "vue";
import NewGrade from "@/main/dashboard/assessment/assessmentComponents/NewGrade.vue"
import { useAssessmentStore } from "../store/assessment";
import { useAbility } from '@casl/vue';
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useRouter} from "vue-router";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

const routerData = useRouter()
const { can } = useAbility()
const assessmentStore = useAssessmentStore()
const notificationStore = useNotificationStore()


let schoolNumber = routerData.currentRoute.value.query.sch

const gradeData = ref([])
const errorMessage = ref(null)
const showGradeModal = ref(false)
const gradeDataInfo = ref([])
const editModel = ref(false)
const deletionLoader = ref(undefined)
const aggregateGroupData = ref([])


const addGrade  = () => {
    showGradeModal.value = true
    editModel.value = false
    gradeDataInfo.value = []
}

onMounted(
    async () => {
      await assessmentStore.fetchAggregateGroupName(schoolNumber)
       doFetchGrades()
    } )

const doFetchGrades = () => {
  let data = {
    school_number:schoolNumber
  }
  assessmentStore.fetchGrades(data)
}

const showEditModal = (gradeD) => {
    gradeDataInfo.value = gradeD
    showGradeModal.value = true
    editModel.value = true
    
}


watch (
    () => assessmentStore.gradeResponse,
    async (data) => {
      if(data){
        gradeData.value = data
      }
    }
)
watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
      }
    }
)

watch(
    () => assessmentStore.newGradeResponse,
    async (data) => {
      if(data){
        // showGradeModal.value = false
         doFetchGrades()
        notificationStore.successToast("Success", data.message)
      }
    }
)
watch(
    () => assessmentStore.updateGradeResponse,
    async (data) => {
      if(data){
        showGradeModal.value = false
         doFetchGrades()
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => assessmentStore.deleteGradeResponse,
    async (data) => {
      if(data){
         deletionLoader.value = false
         doFetchGrades()
         notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => assessmentStore.aggregateNameGroupResponse,
    async (data) => {
      if(data){
        aggregateGroupData.value = data.gradeGroups
      }
    }
)



const deleteGrade = async (data, index) => {

  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + data.name);
  if (agreed) {
    deletionLoader.value = index

    await assessmentStore.deleteGrade(data.number)
  }
  
}

const closeGradeModal = () => {
  showGradeModal.value = false
  gradeDataInfo.value = []
  editModel.value = false
}

</script>
<template>
    <div>

 <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

      <AppModal :title="editModel ? 'Edit Name Of Aggregates ' : 'Add Name Of Aggregates'  " v-model="showGradeModal" lg>
        <NewGrade :gradeDataInfo="gradeDataInfo" @closeGrade="closeGradeModal"></NewGrade>
      </AppModal>

     <div class="px-2 py-2 border-b">
           <div class="grid grid-cols-3 gap-2">
             <div>
              <div class="text-gray-600 text-sm mt-2"> Name Of Aggregates</div>
             </div>
             <div></div>
            <div>
                <button
                    @click="addGrade"
                    v-if="can('create_names_of_aggregate','general')"
                    style="float: right; margin-right: 5px;"
                    type="button"
                    class="btn btn-primary btn-sm">
                  <i class="bi bi-plus"></i>
                  New Name Of Aggregate
                </button>
            </div>
           </div>
     </div>



      <div class="mt-1">
        <table
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th class="w-[5%]">#</th>
          <!-- <th class="w-[15%]">Group</th> -->
          <th scope="col">Name</th>
          <th scope="col">Short Name</th>
          <th scope="col">Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(gradeList, index) in gradeData " :key="index">
          <td>{{ gradeList?.code }}</td>
          <!-- <td>{{ gradeList?.grade_group }}</td> -->
          <td>{{ gradeList?.name }}</td>
          <td>{{ gradeList?.short_name }}</td>
          <td><span class="border px-2 rounded-md">{{ gradeList.status }}</span></td>
          <td>
            <button @click="showEditModal(gradeList)"   type="button">
              <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
            </button>
            &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
            <button type="button" @click="deleteGrade(gradeList, index)">
              <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
              <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
          </td>
        </tr>


        </tbody>
      </table>
      </div>
    </div>
    
    
    
    </template>
    

    
    <style scoped>
    
    </style>