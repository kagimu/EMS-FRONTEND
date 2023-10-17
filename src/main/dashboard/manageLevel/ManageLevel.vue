<template>
  <div>

    <div class="row mx-auto mt-5">

      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="school"
              @change="filterSchool(school)"
          >
            <option disabled value="">Filter by School</option>
            <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
          </select>
        </div>
      </div>

      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="campus"
              @change="filterCampus(campus)"
          >
            <option disabled value="">Filter by Campus</option>
            <option v-for="(lvl, index) in campusList" :key="index" :value="lvl.number">{{lvl.name}}</option>
          </select>
        </div>
      </div>


    </div>

    <div style="font-size: 25px; color: #262626;" class="mt-3 ml-2" v-if="levelDataInfo">
      {{levelDataInfo.name}}
    </div>

    <div class="row">
      <div class="col-3">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="levelDataInfo">
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link class="list-group-item list-group-item-action" :class="showHomeLevel && showHomeLevel === 'home' ? 'active' : ''" :to="{name:'level', query:{id:campusId}}"><small style="font-size:12px;">Home</small></router-link>
            </div>

          </div>
        </div>


        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="levelDataInfo">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Level</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link v-for="(item, idx) in  levelDataInfo.levels" :key="idx" class="list-group-item list-group-item-action" :class="item.number === campusLevel ? 'active' : ''" :to="{name:'level', query:{l:item.number}}"><small style="font-size:12px;">{{item.name}}</small></router-link>
            </div>

          </div>
        </div>

      </div>

      <div class="col-9">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mt-4">

              <div v-if="showHomeLevel && showHomeLevel === 'home'">
                <level-info></level-info>
              </div>

              <div v-if="showHomeLevel && showHomeLevel === 'level'">
                <level-settings></level-settings>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useLevelStore} from "@/main/dashboard/manageLevel/store/level.js";
import {useRouter} from "vue-router";
import LevelSettings from "@/main/dashboard/manageLevel/LevelSettings.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
const levelStore = useLevelStore()
const campusStore = useCampusStore()
const schoolStore = useSchoolStore()
const levelDataInfo = ref(null)
const routerData = useRouter()
const showHomeLevel = ref("home")
const school = ref( "")
const campus = ref( "")


// const campusId = routerData.currentRoute.value.query.c
const campusId = localStorage.getItem('campus_number');
// const schoolId = routerData.currentRoute.value.query.s
const schoolId  = localStorage.getItem('school_number');
const campusLevel = routerData.currentRoute.value.query.l
const schoolsList = ref( [])
const campusList = ref( [])


showHomeLevel.value = campusLevel ? "level" : "home"



const filterSchool = async (school) => {
  if(school) {
    campusList.value = []
    levelDataInfo.value = null
    campus.value = ""
    levelDataInfo.value = null
    localStorage.setItem('school_number', school);
    localStorage.removeItem('campus_number')
    await campusStore.fetchCampuses(school)
    // await routerData.push({name: 'level'})
  }
}

const filterCampus = (campus) => {
  if(schoolId && campus) {
    localStorage.setItem('campus_number', campus);
    // routerData.push({name: 'level', query: {s: schoolId, c: campus}})
    levelStore.fetchLevelInfo(campus)
  }
}



onMounted(
    () => {
      campus.value = campusId
      school.value = schoolId
      schoolStore.fetchSchools()
     /* if(campusId) {
        levelStore.fetchLevelInfo(campusId)
      }*/

    }
)



watch(
    () => levelStore.levelResponse,
    async (data) => {
      if(data){
        levelDataInfo.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data && (data.data.length > 0)){
        let schoolNumber = data.data[0].number
        if(!schoolId) {
          localStorage.setItem('school_number', schoolNumber);
          // await routerData.push({name: 'level', query: {s:schoolNumber}})
        }
          await campusStore.fetchCampuses(schoolId ? schoolId : schoolNumber)
          schoolsList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if(data && (data.data.length > 0)){
        let campusNumber = data.data[0].number
        if(!campus.value){
           campus.value = campusNumber
          localStorage.setItem('campus_number', campusNumber);
        }

        if(campusNumber){
          campusList.value = data.data
          // if(!campusId) {
            await levelStore.fetchLevelInfo(campusId ? campusId : campusNumber)
            // await levelStore.fetchLevelInfo(campusNumber)
          // }
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

.textColor{
  color: #717375;
}

.navColor{
  color: black;
}

</style>