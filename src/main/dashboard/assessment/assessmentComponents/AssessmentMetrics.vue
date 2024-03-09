<template>
    <div>
  
      <div class="col-12">
                <div class="card">
                  <div class="card-header">
             <div class="row">
              <div class="col-lg-6 "> 
                    <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
              </div>
              <div class="col-lg-6">
                <button
                v-if="can('add_assessment_area','general')"
                 style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
        data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showDialog">
       <b><i class="bi bi-plus"></i></b> <small>
        Add Assessment Metric</small></button>
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
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(metricsData, index) in AsessmentMetricsData " :key="index">
            <td>{{ metricsData.name}}</td>
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
  
    <!-- schedule interview -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show: interviewDialog }" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Assessment Metrics</small></h5>
              <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeDialog"></button>
            </div>
            <div class="offcanvas-body">
              <form @submit.prevent="addInterviewAssesmentMetrics">
                
                <div class="mb-2">
                  <label class="textColor"><small>Name</small></label>
                  <input v-model="form.name"  type="text" required class="form-control">
                </div>

                <div class="mb-2">
                <label class="textColor"><small>Assessment Area</small> <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.assessment_area_number"
                >
                    <option disabled value="">Select</option>
                    <option v-for="(list, index) in AsessmentListData" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>
                
            <div class="mb-2">
                <div class="row">
                <div class="col-lg-6">           
                  <label class="textColor"><small>Weight</small></label>
                  <input v-model="form.weight"  type="number" required class="form-control">
                </div>
                <div class="col-lg-6">
                  <label class="textColor"><small>Max_Score</small></label>
                  <input v-model="form.max_score"  type="number" required class="form-control">
                </div>
            </div>
            </div>

            <div class="mb-2">
                <label class="textColor"><small>Description</small></label>
                <textarea class="form-control" v-model="form.description">

                </textarea>
            </div>

            <div class="mb-2">
                <label class="textColor"><small>Scheduled On</small></label>
                <textarea class="form-control" v-model="form.scheduled_on">

                </textarea>
            </div>


                <div class="text-right mt-4">
                  <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                      <span class="visually-hidden">Loading...</span>
                    </div></button>
                </div>
              </form>
            </div>
          </div>
  <!-- wnd  -->
  
  
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
  
    import { useAbility } from '@casl/vue';
  
  const { can } = useAbility()
  
    const buttonLoader = ref(false)
    const AsessmentMetricsData = ref([])
    const interviewDialog= ref(false)
    let errorMessage = ref(null)
  
    const assessmentStore= useAssessmentStore()
    const  notificationStore  = useNotificationStore()
    const campusList = ref([])
    const assessmentMetricsList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const school_number = ref(null)
    const AsessmentListData = ref([])
  
    const preferred_campus_number = ref(null)
  
      const form = reactive({ 
        name:null,
        class_number:[],
        assessment_area_number:null,
        weight:null,
        description:null,
        assessment_area_number:null,
        scheduled_on:null,
        max_score:null
      })
  
      onMounted(
      async () => {
        await assessmentStore.fetchAssessmentMetrics()
      } )
      watch(
    () => assessmentStore.assesmentAreaResponse,
    async (data) => {
      if(data){
        AsessmentListData.value = data.data
      }
    },
    {deep:true}
)
  

      onMounted(
    async () => {
      await assessmentStore.fetchAssesmentArea()
    } )

   //working on dialog
  const closeDialog = () => {
    interviewDialog.value = false;
  };
  const showDialog = () => {
    interviewDialog.value = true;
  }
      const addInterviewAssesmentMetrics = () => {
       alert(JSON.stringify(form))
       interviewDialog.value = true;
       buttonLoader.value = true
       assessmentStore.createAssessmentMetrics(form)
      }
    
      watch (
      () => assessmentStore.newAssessmentMetricResponse,
      async (data) => {
        if(data){
          buttonLoader.value = false
           assessmentStore.fetchAssessmentMetrics()
          notificationStore.successToast("Success", data.message)
         form.name= ""
         form.class_number=""
        }
      },
      {deep:true}
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
      () => assessmentStore.assessmentMetricsResponse,
      async (data) => {
        if(data){
          AsessmentMetricsData.value = data.data
         // notificationStore.successToast("Success", data.message)
        }
      },
      {deep:true}
  )
  
  
  const fetchCampuses = (school_number) => {
        campusStore.fetchCampuses(school_number)
    }
  
    const fetchClasses = (campus_number) => {
        campusStore.fetchClassesByCampus(campus_number)
    }
  
    onMounted(() => {
            schoolStore.fetchSchools()
        }
    )
  
    watch(
        () => schoolStore.schoolsResponse,
        async (data) => {
            if (data) {
                assessmentMetricsList.value = data.data
            }
        },
        {deep: true}
    )
  
    watch(
        () => campusStore.campusListResponse,
        async (data) => {
            if (data) {
                campusList.value = data.data
            }
        },
        {deep: true}
    )
  
    watch(
        () => campusStore.campusClassesResponse,
        async (data) => {
            if (data) {
                classList.value = data.data
            }
        },
        {deep: true}
    )
  
    watch(
        () => campusStore.errorMessage,
        async (data) => {
              if (data) {
                  notificationStore.errorToast("Error", data.message)
              }
        },
        {deep: true}
    )
  
    </script>
  
  
    
    <style scoped>
    .textColor{
      font-size: 11px;
    }
    
    </style>