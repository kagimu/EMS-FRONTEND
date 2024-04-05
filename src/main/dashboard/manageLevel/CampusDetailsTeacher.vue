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
      <div :class="campusCurriculumNumber || reportSettingsQuery ? 'col-3' : 'col-12 mx-auto'">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="campusCurriculumDataInfo">
            <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
              <div class="ml-3 mb-2">Campus Curriculum</div>
            </div>

            <div class="list-group list-group-flush mb-1 rounded-0">
              <router-link
                  v-for="(item, idx) in  campusCurriculumDataInfo" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.number === campusCurriculumNumber ? 'active' : ''"
                  :to="{name:'campus-details-teacher', query:{id:campusNumber, crr:item.number}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="campusCurriculumDataInfo">
            <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
              <div class="ml-3 mb-2">Student Score</div>
            </div>

            <div class="list-group list-group-flush mb-1 rounded-0" >
              <router-link
                  v-for="(item, idx) in  reportSettingsMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.router_name === reportSettingsQuery ? 'active' : ''"
                  :to="{name:'campus-details-teacher', query:{id:campusNumber, rp:item.router_name}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

      </div>


      <div class="col-9" v-if="campusCurriculumNumber">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mt-4">

              <div>
                <campus-settings></campus-settings>
              </div>

            </div>

          </div>
        </div>

      </div>


      <div class="col-9" v-if="reportSettingsQuery">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
           <score-setup></score-setup>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>

import {computed, onMounted, ref, watch} from "vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import CampusSettings from "@/main/dashboard/manageLevel/CampusSettings.vue";
import ScoreSetup from "@/main/dashboard/manageLevel/report_setup/ScoreSetup.vue";

const levelStore = useLevelStore()
const campusCurriculumDataInfo = ref(null)

const routerData = useRouter()

const school = ref( "")


const campusNumber = routerData.currentRoute.value.query.id
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let reportSettingsQuery = routerData.currentRoute.value.query.rp

const reportSettingsMenu = ref([
  {
    name:"Add Score",
    router_name:"student-score"
  },
  {
    name:"Generate Report",
    router_name:"generate-report"
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
          // campusCurriculumNumber = curriculumInfo[0].number
        }
      }
    },
    {deep:true}
)


</script>

<style scoped>

input:focus {
  box-shadow: none;
}


</style>