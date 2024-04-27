<template>
    <div>

   <AppModal title="Add Assessment Metric" v-model="showingModal" lg>
    <NewAssessmentMetric></NewAssessmentMetric>
    </AppModal>
      <div class="col-12 mt-2" >
                <div class="">
                  <div class="">
             <div class="row">
              <div class="col-lg-6 "> 
                    <!-- <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">   -->
              </div>
              <div class="col-lg-6">
                <button
                v-if="can('add_assessment_area','general')"
                 style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-0 mr-4"  @click="showModal">
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
            <!-- <th>Interview</th> -->
            <th>Name</th>
            <th>Decription</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(metricsData, index) in assessmentMetricsData " :key="index">
            <td>
              {{ metricsData.name + " - " + metricsData.CampusClass.class_name}}
            </td>
            <td>{{ metricsData.description }}</td>
            <td>
            <button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
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
    
    <script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import useNotificationStore from "@/composables/useNotification.js";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
    import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
    import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useStudyPeriodStore } from "../../manageLevel/studyPeriod/store/studyPeriod";
   import AppModal from "@/components/AppModal.vue";
   import {useRouter} from "vue-router";
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
    const interviewDialog= ref(false)
    let errorMessage = ref(null)
  
    const assessmentStore= useAssessmentStore()
    const  notificationStore  = useNotificationStore()
    const assessmentMetricsList = ref([])
    

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
  
  
    
    <style scoped>
    .textColor{
      font-size: 11px;
    }
    
    </style>