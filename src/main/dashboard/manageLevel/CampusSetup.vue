<script setup>

import {computed, onMounted, ref, watch} from "vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";

const levelStore = useLevelStore()
const campusCurriculumDataInfo = ref(null)

const routerData = useRouter()

const school = ref( "")


const campusNumber = routerData.currentRoute.value.query.id
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let reportSettingsQuery = routerData.currentRoute.value.query.rp
let assessmentSettingsQuery = routerData.currentRoute.value.query.ass
let schoolNumber = routerData.currentRoute.value.query.sch


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
      <div :class="reportSettingsQuery || assessmentSettingsQuery ? 'col-3' : 'col-12 mx-auto'">


        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="campusCurriculumDataInfo">

            <div class="mb-2 mt-2 text-[14px] border-b border-[#dfe1e3] rounded-0">
              <div class="ml-3 mb-2">Campus Curriculum</div>
            </div>

            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link
                  v-for="(item, idx) in  campusCurriculumDataInfo" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.number === campusCurriculumNumber ? 'active' : ''"
                  :to="{name:'campus-curriculum-setup', query:{id:campusNumber,sch:schoolNumber, crr:item.number, cr:item.curriculum_number}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
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