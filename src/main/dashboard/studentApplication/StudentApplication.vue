<template>
    <div>

    
      <div class="row">
        <div class="col-3">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Application</div>
  
  
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
  
                <router-link
                    v-for="(item, idx) in application" :key="idx"
                    v-show="can(item.action,'general')"
                    class="list-group-item list-group-item-action"
                    :class="item.id === selectedPage ? 'active' : ''"
                    :to="{name:'student-application', query:{s:item.id}}">
                  <small style="font-size:12px;">{{item.name}}</small>
                </router-link>
              </div>
  
  
  
            </div>
          </div>
        </div>
  
        <div class="col-9">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
  
              <div>
  
                  <div v-if="selectedPage === 'application-list'">
                    <application-list></application-list>
                  </div>
                  <div v-if="selectedPage === 'interviews'">
                    <interviews></interviews>
                  </div>
                  <!-- <div v-if="selectedPage === 'assessment-areas'">
                    <interview-assesment-areas></interview-assesment-areas>
                  </div> -->
                  <!-- <div v-if="selectedPage === 'assessment-metrics'">
                    <AssessmentMetrics></AssessmentMetrics>
                  </div> -->
                  <div v-if="selectedPage === 'interviewquestions'">
                    <interviews-questions></interviews-questions>
                  </div>
                  <div v-if="selectedPage === 'offer-admission'">
            <!-- <AdmitStudent></AdmitStudent> -->
                  </div>
              </div>
  
  
            </div>
          </div>
        </div>
  
      </div>
  
    </div>
  </template>
  
  <script setup>
  
  import {reactive, ref} from "vue";
  import {useRouter} from "vue-router";
  import ApplicationList from "./ApplicationList.vue";
  import Interviews from "./Interviews.vue";
  import InterviewsQuestions from "./InterviewsQuestions.vue";
  import GradeResults from "./GradeResults.vue";
  import InterviewAssesmentAreas from "../assessment/assessmentComponents/AssesmentAreas.vue";
  import { useAbility } from '@casl/vue'
  import AssessmentMetrics from '../assessment/assessmentComponents/AssessmentMetrics.vue'
  import StudentAdmission from '@/main/dashboard/studentAdmission/StudentAdmission.vue'
  import AdmissionList from "@/main/dashboard/studentAdmission/AdmissionList.vue";
  import AdmitStudent from "./AdmitStudent.vue";

  const { can } = useAbility()


  const routerData = useRouter()
  const buttonLoader = ref(false)
  
  const route = routerData.currentRoute.value.query.s
  const selectedPage = route ? route : "application-list"
  
  const application = ref([
    {
      name:"Applicants",
      id:"application-list",
      action:"view_application_list"
    },
    {
      name:"Interview Schedule",
      id:"interviews",
      action:"view_interviews"
    },
    // {
    //   name:"Assessment Areas",
    //   id:"assessment-areas",
    //   action:"view_assessment_areas"
    // },
    // {
    //   name:"Assessment Metrics",
    //   id:"assessment-metrics",
    //   action:"view_assessment_metrics"
    // },
    // {
    //   name:"Interview Questions",
    //   id:"interviewquestions",
    //   action:"view_interviewquestions"
    // },
    {
      name:"Interviews",
      id:"grade-results",
      action:"view_grade_results"
    },

    {
      name:"Admission Offer",
      id:"offer-admission",
      action:"view_admision-offer"
    },
   

  ])
  const form = reactive({
    name:null
  })
  
  
  </script>
  
  <style scoped>
  
  input:focus {
    box-shadow: none;
  }
  
  .textColor{
    color: #717375;
  }
  
  .navColor{
    color: black;
  }
  
  </style>