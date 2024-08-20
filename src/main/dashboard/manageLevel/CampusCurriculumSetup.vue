<script setup>
import {computed, onMounted, ref, watch} from "vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import CampusCurriculumSettings from "@/main/dashboard/manageLevel/CampusCurriculumSettings.vue";
import Assessment from "@/main/dashboard/assessment/Assessment.vue";
import ReportSetup from "@/main/dashboard/manageLevel/report_setup/ReportSetup.vue";
import ScoreSetup from "@/main/dashboard/manageLevel/report_setup/ScoreSetup.vue";
import Grading from "@/main/dashboard/assessment/Grading.vue";
import AssessmentSchedulePage from "@/main/dashboard/assessment/AssessmentSchedulePage.vue";
import { useAbility } from '@casl/vue';
const { can } = useAbility()
const router = useRouter()
const levelStore = useLevelStore()
const campusCurriculumDataInfo = ref(null)

const routerData = useRouter()

const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr
let campusSetupQuery = routerData.currentRoute.value.query.type


const campusSetupMenu = ref([
  {
    name:"Campus Settings",
    router_name:"campus-settings",
     action:"view_campus_settings"

  },
  {
    name:"Aggregate",
    router_name:"aggregate",
    action:"view_aggregate"
  },
  {
    name:"Grading",
    router_name:"grading",
     action:"view_grading"
  },
  {
    name:"Assessment Schedule",
    router_name:"assessment-schedule",
     action:"view_assessment_schedule"
  },
  {
    name:"Report Card Settings",
    router_name:"report-card-settings",
    action:"view_report_card_settings"
  },
  {
    name:"Student Score",
    router_name:"student-score",
    action:"view_student_score"
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
      }
    },
    {deep:true}
)

const switchCurriculum = (curriculum) => {
  router.push({name: "campus-curriculum-setup", query:{id:campusNumber,sch:schoolNumber, crr:curriculum, cr:curriculumNumberParent}})
}


</script>
<template>
  <div>

    <div class="mt-3 ml-2 text-[#262626] text-[25px]" v-if="curriculumName">
      {{curriculumName}}
    </div>

    <div class="row">
      <div class="col-lg-3">
        <select
            style="outline: none 0 !important; box-shadow: none;"
            type="text"
            v-model="campusCurriculumNumber"
            @change="switchCurriculum(campusCurriculumNumber)"
            required
            class="form-control form-select-sm">
          <option disabled value="">--Switch Curriculum--</option>
          <option v-for="(lst, index) in campusCurriculumDataInfo" :key="index" :value="lst.number">{{ lst.name }}</option>
        </select>
      </div>
    </div>





      <div class="mt-3 border bg-white rounded-md px-2 py-2">
        <level-info></level-info>
      </div>


<div>
    <div class="row">

      <div :class="campusSetupQuery ? 'col-3' : 'col-12 mx-auto'">

        <div class="w-full mb-10">


          <div class="card mt-3">
            <div class="card-body p-0">
              <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
                <div class="ml-3 mb-2">Assessment</div>
              </div>

              <div class="list-group list-group-flush mb-1" >
                <router-link
                    v-for="(item, idx) in  campusSetupMenu" :key="idx"
                    class="list-group-item list-group-item-action"
                    :class="item.router_name === campusSetupQuery ? 'active' : ''"
                    :to="{name:'campus-curriculum-setup', query:{id:campusNumber,sch:schoolNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:item.router_name}}">
                  <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
              </div>

            </div>
          </div>



        </div>


      </div>


      <div class="col-9" v-if="campusSetupQuery === 'campus-settings'">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

              <div>
                <campus-curriculum-settings></campus-curriculum-settings>
              </div>

          </div>
        </div>

      </div>


      <div class="col-9" v-if="campusSetupQuery === 'aggregate'">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <assessment></assessment>
          </div>
        </div>
      </div>



      <div class="col-9" v-if="campusSetupQuery === 'grading'">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <grading></grading>
          </div>
        </div>
      </div>

      <div class="col-9" v-if="campusSetupQuery === 'assessment-schedule'">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <assessment-schedule-page></assessment-schedule-page>
          </div>
        </div>
      </div>



      <div class="col-9" v-if="campusSetupQuery === 'report-card-settings'" >

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <report-setup></report-setup>
          </div>
        </div>
      </div>

      <div class="col-9" v-if="campusSetupQuery === 'student-score'">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <score-setup></score-setup>
          </div>
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



