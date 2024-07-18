<script setup>
import {onMounted,ref, watch} from "vue";
import NewGrade from "@/main/dashboard/assessment/assessmentComponents/NewGrade.vue"
import { useAssessmentStore } from "../store/assessment";
import { useAbility } from '@casl/vue';
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";

const { can } = useAbility()
const assessmentStore = useAssessmentStore()
const notificationStore = useNotificationStore()

const gradeData = ref([])
const errorMessage = ref(null)
const showGradeModal = ref(false)
const gradeDataInfo = ref([])
const editModel = ref(false)
const deletionLoader = ref(undefined)
const namee = ref(null)

const addGrade  = () => {
    showGradeModal.value = true
    editModel.value = false
    gradeDataInfo.value = []
}

onMounted(
    async () => {
       doFetchGrades()
    } )

const doFetchGrades = () => {
  assessmentStore.fetchGrades()
}

const showEditModal = (gradeD) => {
    gradeDataInfo.value = gradeD
    showGradeModal.value = true
    namee.value = gradeD.name
    editModel.value = true
    
}

const deleteGrade = (data, index) => {
  if(!confirm("Are you sure, you want to delete: " + data.name)){
    return
  }

  deletionLoader.value = index

  assessmentStore.deleteGrade(data.number)
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
        showGradeModal.value = false
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

</script>
<template>
    <div>

      <AppModal :title="editModel ? 'Edit Name Of Aggregates ' : 'Add Name Of Aggregates'  " v-model="showGradeModal" lg>
        <NewGrade :gradeDataInfo="gradeDataInfo"></NewGrade>
      </AppModal>

     <div class="px-2 py-2 border-b">
           <div class="row">
            <div class="col-lg-6 ">
            </div>
            <div class="col-lg-6">
                <button
                    @click="addGrade"
                    v-if="can('add_grade_standard','general')"
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
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Short Name</th>
          <th scope="col">Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(gradeList, index) in gradeData " :key="index">
          <td>{{ gradeList.code }}</td>
          <td>{{ gradeList.name }}</td>
          <td>{{ gradeList.short_name }}</td>
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