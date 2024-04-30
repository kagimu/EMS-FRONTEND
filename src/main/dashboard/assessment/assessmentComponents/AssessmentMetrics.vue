<script setup>
import {onMounted,ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import AppModal from "@/components/AppModal.vue";
import NewAssessmentMetric from "@/main/dashboard/assessment/assessmentComponents/NewAssessmentMetric.vue"

const showingModal = ref(false)
const academicYearStore = useAcademicYearStore()

const showModal = () => {
  showingModal.value = true
  thisDialog.value=false
}

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const buttonLoader = ref(false)
const assessmentMetricsData = ref([])
ref(false);
let errorMessage = ref(null)

const assessmentStore= useAssessmentStore()
const  notificationStore  = useNotificationStore()
ref([]);
onMounted(
    async () => {
      await assessmentStore.fetchAssessmentMetrics()
    } )


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
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data){
        assessmentMetricsData.value = data.data
      }
    },
    {deep:true}
)
</script>
<template>
    <div>

   <AppModal v-model="showingModal" title="Add Assessment Metric" xl6>
      <NewAssessmentMetric></NewAssessmentMetric>
    </AppModal>

      <div class="col-12 mt-2" >
                <div class="">
                  <div class="">
             <div class="row">
              <div class="col-lg-6 "> 

              </div>
              <div class="col-lg-6">
                <button
                v-if="can('add_assessment_area','general')"
                 class="btn btn-primary btn-sm float-end mb-0 mr-4" style="float: right" type="button"  @click="showModal">
       <b><i class="bi bi-plus"></i></b> <small>
        Add Assessment Metrics</small></button>
              </div>
             </div>
                 </div>
                  <div class="card-body" >
          <div >

      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
             <th class="w-[10%]">#</th>
            <th>Name</th>
            <th>Decription</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(metricsData, index) in assessmentMetricsData " :key="index">
            <td>
               {{metricsData?.code ?? ""}}
            </td>
            <td>
              {{ metricsData.name + " - " + metricsData.CampusClass.class_name}}
            </td>
            <td>{{ metricsData.description }}</td>
            <td>
            <button  aria-controls="rolesDialog" data-bs-target="#updateRoleModel" data-bs-toggle="modal" type="button">
              <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
            </button>
            &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
            <button type="button">
              <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
            </button></td>
          </tr>  
  
        </tbody>
      </table>
    </div>
  

  
    </div>
    </div>
    </div>
    </div>
    </template>
    

  

    <style scoped>
    .textColor{
      font-size: 11px;
    }
    
    </style>