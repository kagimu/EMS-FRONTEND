<script setup>

import {computed, onMounted, ref, watch} from "vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import CampusCurriculumSettings from "@/main/dashboard/manageLevel/CampusCurriculumSettings.vue";
import Assessment from "@/main/dashboard/assessment/Assessment.vue";
import ReportSetup from "@/main/dashboard/manageLevel/report_setup/ReportSetup.vue";
import ScoreSetup from "@/main/dashboard/manageLevel/report_setup/ScoreSetup.vue";

const levelStore = useLevelStore()
const campusCurriculumDataInfo = ref(null)

const routerData = useRouter()

const school = ref( "")


const campusNumber = routerData.currentRoute.value.query.id
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr
let campusSetupQuery = routerData.currentRoute.value.query.type

let studentScoreQuery = routerData.currentRoute.value.query.ss
let assessmentSettingsQuery = routerData.currentRoute.value.query.ass
let reportSettingsQuery = routerData.currentRoute.value.query.rp

const campusSettingsMenu = ref([
  {
    name:"Campus Level",
    router_name:"campus-level"
  },
  {
    name:"Class",
    router_name:"class-data"
  },
  {
    name:"Academic Year",
    router_name:"academic-year"
  },
  {
    name:"Study Period",
    router_name:"study-period"
  },
  {
    name:"Assessment Metrics",
    router_name:"assessment-metrics"
  },
])



const reportSettingsMenu = ref([
  {
    name:"Report Setting",
    router_name:"report-setting"
  },
  {
    name:"Report Columns",
    router_name:"report-columns"
  },
  {
    name:"Report Columns Assessment",
    router_name:"report-columns-assessment"
  },
])


const studentScoreMenu = ref([
  {
    name:"Add Score",
    router_name:"student-score"
  },
  {
    name:"Generate Report",
    router_name:"generate-report"
  },
  {
    name:"Report Summary",
    router_name:"report-card"
  },
])

const assess = ref([
  {
    name:"Grade Standards",
    router_name:"grade-standards"
  },
  {
    name:"Aggregate Scale",
    router_name:"grade-scale"
  },
  {
    name:"Assessment Grades",
    router_name:"assessment-scale"
  },
  {
    name:"Assessment Area Grading Standard",
    router_name:"assessment-area-grading-standard"
  },

])



onMounted(
    () => {
      levelStore.fetchCampusCurriculum(campusNumber)
    }
)

const curriculumName =  computed(()=>{
  let c = ""
  if(campusCurriculumDataInfo.value && campusCurriculumNumber) {
    c = campusCurriculumDataInfo.value.find(curriculum => {
      return curriculum.number === campusCurriculumNumber;
    }).name;
  }
  return c
})

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
        if(!campusCurriculumNumber){
        }
      }
    },
    {deep:true}
)


</script>
<template>
  <div>

    <div style="font-size: 25px; color: #262626;" class="mt-3 ml-2" v-if="curriculumName">
      {{curriculumName}}
    </div>

    <div class="card mt-3">
      <div class="card-body" style="padding: 0;">
        <level-info></level-info>
      </div>
    </div>


    <div class="row">
      <div :class="campusSetupQuery || studentScoreQuery  || assessmentSettingsQuery || reportSettingsQuery ? 'col-3' : 'col-12 mx-auto'">

        <div class="w-full h-[80vh] overflow-y-scroll scrollbar-thin">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
              <div class="ml-3 mb-2">Setup</div>
            </div>

            <div class="list-group list-group-flush mb-1 rounded-0" >
              <router-link
                  v-for="(item, idx) in  campusSettingsMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.router_name === campusSetupQuery ? 'active' : ''"
                  :to="{name:'campus-curriculum-setup', query:{id:campusNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:item.router_name}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>



        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
              <div class="ml-3 mb-2">Assessments</div>
            </div>
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link
                  v-for="(item, idx) in  assess" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.router_name === assessmentSettingsQuery ? 'active' : ''"
                  :to="{name:'campus-curriculum-setup', query:{id:campusNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent, ass:item.router_name}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" >
            <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
              <div class="ml-3 mb-2">Report Card Settings</div>
            </div>
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link
                  v-for="(item, idx) in  reportSettingsMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.router_name === reportSettingsQuery ? 'active' : ''"
                  :to="{name:'campus-curriculum-setup', query:{id:campusNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent, rp:item.router_name}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" >
            <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
              <div class="ml-3 mb-2">Student Score</div>
            </div>

            <div class="list-group list-group-flush mb-1 rounded-0" >
              <router-link
                  v-for="(item, idx) in  studentScoreMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.router_name === studentScoreQuery ? 'active' : ''"
                  :to="{name:'campus-curriculum-setup', query:{id:campusNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent, ss:item.router_name}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

        </div>


      </div>





      <div class="col-9" v-if="campusSetupQuery">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mt-4">

              <div>
                <campus-curriculum-settings></campus-curriculum-settings>
              </div>

            </div>

          </div>
        </div>

      </div>



      <div class="col-9" v-if="assessmentSettingsQuery">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <assessment></assessment>
          </div>
        </div>
      </div>

      <div class="col-9" v-if="studentScoreQuery">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <score-setup></score-setup>
          </div>
        </div>
      </div>

      <div class="col-9" v-if="reportSettingsQuery">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <report-setup></report-setup>
          </div>
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



