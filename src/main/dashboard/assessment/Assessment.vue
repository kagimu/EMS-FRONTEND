<template>
    <div>

    
      <div class="row">
        <div class="col-3">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Assessment</div>
  
  
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
  
                <router-link
                    v-for="(item, idx) in assess" :key="idx"
                    class="list-group-item list-group-item-action"
                    :class="item.id === selectedPage ? 'active' : ''"
                    :to="{name:'assessment', query:{s:item.id}}">
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
  
                  <div v-if="selectedPage === 'assessments'">
                    <AssessmentList></AssessmentList>
                  </div>
          
                  <div v-if="selectedPage === 'assessment-areas'">
                    <interview-assesment-areas></interview-assesment-areas>
                  </div>
                  <div v-if="selectedPage === 'examtype'">
                    <ExamType></ExamType>
                  </div>
                  <div v-if="selectedPage === 'grade-standards'">
                 <GradingStandards></GradingStandards>
                  </div>
                  <div v-if="selectedPage === 'grade-scale'">
                    <GradingScale></GradingScale>
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
  import InterviewAssesmentAreas from "../assessment/assessmentComponents/AssesmentAreas.vue";
  import AssessmentList from "./assessmentComponents/AssessmentList.vue";
  import ExamType from "./assessmentComponents/ExamType.vue"
  import GradingScale from "./assessmentComponents/GradingScale.vue";
  import GradingStandards from "./assessmentComponents/GradingStandards.vue";

  const routerData = useRouter()
  
  const route = routerData.currentRoute.value.query.s
  const selectedPage = route ? route : "assessments"
  
  const assess = ref([
    {
      name:"Assessment List",
      id:"assessments"
    },
   
    {
      name:"Assessment Areas",
      id:"assessment-areas"
    },
    {
      name:"Exam Type",
      id:"examtype"
    },
    {
      name:"Grade Standards",
      id:"grade-standards"
    },
    {
      name:"Grade Scale",
      id:"grade-scale"
    },
   
  ])

  
  
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