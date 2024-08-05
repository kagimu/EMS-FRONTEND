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
import AggregateNameGroup from "@/main/dashboard/assessment/assessmentComponents/AggregateNameGroup.vue";
import router from "@/config/router.js";


const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr



const selectedPage = routerData.currentRoute.value.query.type
const selectedTab = routerData.currentRoute.value.query.tab ?? 'grade-standards'

const switchTabs = (tab) => {
  router.push({name: "campus-curriculum-setup", query: {id:campusNumber,sch:schoolNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:selectedPage,tab:tab}});
}

</script>
<template>
    <div>

      <div class="flex border-b mt-1">


        <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'grade-standards' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('grade-standards')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Grade Standards
          </div>
        </div>

        <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'assessment-area-grading-standard' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('assessment-area-grading-standard')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Assessment Area Grading Standard
          </div>
        </div>



      </div>

            <div class="card-body" style="padding: 0;">
  
              <div>

                <div v-if="selectedTab === 'aggregate-name-group'">
                  <AggregateNameGroup></AggregateNameGroup>
                </div>


  
                  <div v-if="selectedTab === 'assessments'">
                    <AssessmentList></AssessmentList>
                  </div>
          

                  <div v-if="selectedTab === 'examtype'">
                    <ExamType></ExamType>
                  </div>
                  <div v-if="selectedTab === 'grade-standards'">
                      <GradingStandards></GradingStandards>
                  </div>

                <div v-if="selectedTab === 'assessment-metrics'">
                  <assessment-metrics></assessment-metrics>
                </div>

                  <div v-if="selectedTab === 'grade-scale'">
                    <GradingScale></GradingScale>
                  </div>

                  <div v-if="selectedTab === 'grades'">
                    <Grades></Grades>
                  </div>

                  <div v-if="selectedTab === 'assessment-scale'">
                   <AssessmentScale></AssessmentScale>
                  </div>

                <div v-if="selectedTab === 'assessment-area-grading-standard'">
                  <assessment-area-grading-standard></assessment-area-grading-standard>
                </div>
                  

                  
              </div>
  
  
            </div>

  
    </div>
  </template>
  

  
  <style scoped>
  
  input:focus {
    box-shadow: none;
  }
  

  </style>