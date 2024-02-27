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
      <div class="col-3">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="campusCurriculumDataInfo">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Campus Curriculum</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link
                  v-for="(item, idx) in  campusCurriculumDataInfo" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.number === campusCurriculumNumber ? 'active' : ''"
                  :to="{name:'campus-setup', query:{id:campusNumber, l:item.number}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

      </div>

      <div class="col-9">

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

    </div>

  </div>
</template>

<script setup>

import {computed, onMounted, ref, watch} from "vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import CampusSettings from "@/main/dashboard/manageLevel/CampusSettings.vue";
const levelStore = useLevelStore()
const campusCurriculumDataInfo = ref(null)
const routerData = useRouter()

const school = ref( "")


const campusNumber = routerData.currentRoute.value.query.id
let campusCurriculumNumber = routerData.currentRoute.value.query.l





onMounted(
    () => {
      // levelStore.fetchCampusLevelList(campusNumber)
      levelStore.fetchCampusCurriculum(campusNumber)
    }
)

const curriculumName =  computed(()=>{
  let c = ""
  if(campusCurriculumDataInfo.value) {
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
        let curriculumInfo = data.data

        campusCurriculumDataInfo.value = curriculumInfo
        if(!campusCurriculumNumber){
          campusCurriculumNumber = curriculumInfo[0].number
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