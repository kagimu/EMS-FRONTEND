<template>
    <div>


            <div class="card-body" style="padding: 0;">
  
              <div>
  
                  <div v-if="selectedPage === 'assessments'">
                    <AssessmentList></AssessmentList>
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

                  <div v-if="selectedPage === 'assessment-scale'">
                   <AssessmentScale></AssessmentScale>
                  </div>

                <div v-if="selectedPage === 'assessment-area-grading-standard'">
                  <assessment-area-grading-standard></assessment-area-grading-standard>
                </div>
                  
              </div>
  
  
            </div>
<!--          </div>-->
<!--        </div>-->
  
<!--      </div>-->
  
    </div>
  </template>
  
  <script setup>
  
  import {reactive, ref} from "vue";
  import {useRouter} from "vue-router";
  import InterviewAssesmentAreas from "@/main/dashboard/assessment/assessmentComponents/AssesmentAreas.vue";
  import AssessmentList from "@/main/dashboard/assessment/assessmentComponents/AssessmentList.vue";
  import ExamType from "@/main/dashboard/assessment/assessmentComponents/ExamType.vue"
  import GradingScale from "@/main/dashboard/assessment/assessmentComponents/GradingScale.vue";
  import GradingStandards from "@/main/dashboard/assessment/assessmentComponents/GradingStandards.vue";
  import AssessmentScale from "@/main/dashboard/assessment/assessmentComponents/AssessmentScale.vue";
  import AssessmentAreaGradingStandard from "@/main/dashboard/assessment/AssessmentAreaGradingStandard.vue";

  const routerData = useRouter()
  
  const selectedPage = routerData.currentRoute.value.query.ass
/*
  const selectedPage = route ? route : "examtype"
  
  const assess = ref([
    {
      name:"Grade Standards",
      id:"grade-standards"
    },
    {
      name:"Aggregate Scale",
      id:"grade-scale"
    },
    {
      name:"Assessment Grades",
      id:"assessment-scale"
    },
    {
      name:"Assessment Area Grading Standard",
      id:"assessment-area-grading-standard"
    },
   
  ])
*/

  
  
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