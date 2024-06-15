<script setup>

import {useRouter} from "vue-router";
import AssessmentList from "@/main/dashboard/assessment/assessmentComponents/AssessmentList.vue";
import ExamType from "@/main/dashboard/assessment/assessmentComponents/ExamType.vue"
import GradingScale from "@/main/dashboard/assessment/assessmentComponents/GradingScale.vue";
import GradingStandards from "@/main/dashboard/assessment/assessmentComponents/GradingStandards.vue";
import AssessmentScale from "@/main/dashboard/assessment/assessmentComponents/AssessmentGrade.vue";
import AssessmentAreaGradingStandard from "@/main/dashboard/assessment/AssessmentAreaGradingStandard.vue";
import AssessmentMetrics from "@/main/dashboard/assessment/assessmentComponents/AssessmentMetrics.vue";
import Grades from "@/main/dashboard/assessment/assessmentComponents/Grades.vue";

const routerData = useRouter()
const selectedPage = routerData.currentRoute.value.query.ass


</script>
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

                <div v-if="selectedPage === 'assessment-metrics'">
                  <assessment-metrics></assessment-metrics>
                </div>

                  <div v-if="selectedPage === 'grade-scale'">
                    <GradingScale></GradingScale>
                  </div>

                  <div v-if="selectedPage === 'grades'">
                    <Grades></Grades>
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
  

  
  <style scoped>
  
  input:focus {
    box-shadow: none;
  }
  

  </style>