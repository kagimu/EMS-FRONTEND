<script setup>

import {onMounted, ref, watch} from "vue";
import LearningAreaList from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/LearningAreaList.vue";
import SubjectCluster from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/SubjectCluster.vue";
import SubjectList from "@/main/dashboard/curriculum/curriculumSetup/subject/SubjectList.vue";
import StrandList from "@/main/dashboard/curriculum/curriculumSetup/strands/StrandList.vue";
import TopicList from "@/main/dashboard/curriculum/curriculumSetup/topic/TopicList.vue";
import SubTopicList from "@/main/dashboard/curriculum/curriculumSetup/subTopic/SubTopicList.vue";
import ConceptList from "@/main/dashboard/curriculum/curriculumSetup/concept/ConceptList.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
import ManageCurriculum from "@/main/dashboard/curriculum/curriculumSetup/ManageCurriculum.vue";
import {useRouter} from "vue-router";
import CurriculumLevel from "@/main/settings/level/CurriculumLevel.vue";
import CurriculumClassSetUp from "@/main/dashboard/manageLevel/class/CurriculumClassSetUp.vue";
import AssesmentAreas from "@/main/dashboard/assessment/assessmentComponents/AssesmentAreas.vue";
import Metric from "@/main/dashboard/assessment/assessmentComponents/metric/Metric.vue";
import router from "@/config/router.js";


const routerData = useRouter()
const menuSelected = ref( "level")
const curriculumMenu = ref( [
  {text:"Learning Area", value:"learning-area"},
  {text:"Subject Cluster", value:"subject-cluster"},
  {text:"Subject", value:"subject"},
  {text:"Strand", value:"strand"},
  {text:"Topic", value:"topic"},
  {text:"Subtopic", value:"subtopic"},
  {text:"Concept", value:"concept"},
])

const assessmentMenu = ref( [
  {text:"Assessment Area", value:"assessmentArea"},
  {text:"Metric", value:"metric"},
])

const importCurriculumMenu = ref([
{text:"Import Curriculum", value:"import-curriculum"},
])

const curriculumSetUpMenu = ref( [
  {text:"Curriculum Level", value:"level"},
  {text:"Curriculum Classes", value:"classes"},
])

const notificationStore  = useNotificationStore()
const curriculumStore = useCurriculumStore()
let  curriculumNumber = routerData.currentRoute.value.query.id
let curriculumInfo = ref(null)
let campusQuery = routerData.currentRoute.value.query.type ? routerData.currentRoute.value.query.type : "level"

// const changeMenu = (value) => {
//   menuSelected.value = value
// }

const changeMenu = (value) => {
  router.push({ name: "curriculum-setup", query:{m:value} })
}

const importDialog = ref(false)
const importFromExcel = () => {
  importDialog.value = true
}

onMounted(
    () => {
      curriculumStore.fetchCurriculumInfo(curriculumNumber)
    }
)

watch(
    () => curriculumStore.importResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => curriculumStore.curriculumInfoResponse,
    async (data) => {
      if(data){
        curriculumInfo.value = data.data
      }
    },
    {deep:true}
)



</script>
<template>
  <div>

    <div class="mt-3">
      <div class="ml-4 mt-3" v-if="curriculumInfo && curriculumInfo.name">
        <div style="font-size: 22px; text-transform: capitalize;">Curriculum: <span class="text-blue-900">{{curriculumInfo.name}}</span> </div>
      </div>
    </div>


    <div class="row">


        <div class="col-3">
            <div class="w-full h-screen overflow-y-auto scrollbar-thin">
              <div class="card mt-3">
                <div class="card-body" style="padding: 0;">
                    <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Curriculum Setup</div>
           <hr />

 
            <div class="list-group list-group-flush mb-1 rounded-0" >
                  <router-link
                  v-for="(item, idx) in  curriculumSetUpMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.value === campusQuery ? 'active' : ''"
                  :to="{name:'curriculum-setup', query:{id:curriculumNumber,type:item.value}}">
                <small style="font-size:12px;">{{item.text}}</small></router-link>
              </div>

                </div>
              </div>

              <div class="card mt-3">
                <div class="card-body" style="padding: 0;">
                  <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                    <!-- <div
                        v-for="(item, idx) in  curriculumMenu"
                        :key="idx"
                        class="list-group-item list-group-item-action cursor-pointer"
                        :class="item.value === menuSelected ? 'active' : ''"
                        @click="changeMenu(item.value)"
                    >
                      <small style="font-size:12px;">{{item.text}}</small>
                    </div> -->

                    <router-link
                  v-for="(item, idx) in  curriculumMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.value === campusQuery ? 'active' : ''"
                  :to="{name:'curriculum-setup', query:{id:curriculumNumber,type:item.value}}">
                <small style="font-size:12px;">{{item.text}}</small></router-link>


                  </div>
                </div>
              </div>

              <div class="card mt-3">
                <div class="card-body" style="padding: 0;">
                  <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Import Curriculum</div>
                  <hr />
                  <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                    
                    <!-- <div
                        class="list-group-item list-group-item-action cursor-pointer"
                        :class="menuSelected === 'import-curriculum' ? 'active' : ''"
                        @click="changeMenu('import-curriculum')"
                    >
                      <small style="font-size:12px;">Import Curriculum</small>
                    </div> -->

                    <router-link
                  v-for="(item, idx) in  importCurriculumMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.value === campusQuery ? 'active' : ''"
                  :to="{name:'curriculum-setup', query:{id:curriculumNumber,type:item.value}}">
                <small style="font-size:12px;">{{item.text}}</small></router-link>

                  </div>
                </div>
              </div>


              <div class="card mt-3">
                <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Assessment Setup</div>
                <hr />

                <div class="card-body" style="padding: 0;">
                  <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                    <!-- <div
                        v-for="(item, idx) in  assessmentMenu"
                        :key="idx"
                        class="list-group-item list-group-item-action cursor-pointer"
                        :class="item.value === menuSelected ? 'active' : ''"
                        @click="changeMenu(item.value)"
                    >
                      <small style="font-size:12px;">{{item.text}}</small>
                    </div> -->

                    <router-link
                  v-for="(item, idx) in  assessmentMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.value === campusQuery ? 'active' : ''"
                  :to="{name:'curriculum-setup', query:{id:curriculumNumber,type:item.value}}">
                <small style="font-size:12px;">{{item.text}}</small></router-link>


                  </div>
                </div>
              </div>

          </div>
      </div>


      <div class="col-9">
        <div class="h-screen overflow-y-auto scrollbar-thin">
          <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

             <div v-if=" campusQuery === 'import-curriculum'">
               <manage-curriculum></manage-curriculum>
               </div>


                 <div v-if=" campusQuery === 'learning-area'">
                <learning-area-list> </learning-area-list>
                </div>

                <div v-if=" campusQuery === 'subject-cluster'">
                  <subject-cluster></subject-cluster>
                </div>

                <div v-if=" campusQuery === 'subject'">
                  <subject-list></subject-list>
                </div>

                <div v-if=" campusQuery === 'strand'">
                   <strand-list></strand-list>
                   </div>

                   <div v-if=" campusQuery === 'topic'">
                    <topic-list></topic-list>
                    </div>

                    <div v-if=" campusQuery === 'subtopic'">
                       <sub-topic-list></sub-topic-list>
                       </div>

                       <div v-if=" campusQuery === 'concept'">
                        <concept-list></concept-list>
                        </div>

               <div v-if=" campusQuery === 'level'">
                <curriculum-level></curriculum-level>
                </div>

                <div v-if=" campusQuery==='classes'">
                <!-- <curriculum-level></curriculum-level> -->
                <curriculum-class-set-up ></curriculum-class-set-up>
                </div>

            
                <!-- <assesment-areas v-if="menuSelected === 'assessmentArea'"></assesment-areas> -->
                <div v-if=" campusQuery==='assessmentArea'">
                  <assesment-areas></assesment-areas>
                  </div>


            <!-- <assessment-metrics v-if="menuSelected == 'assessmentmetric'"></assessment-metrics> -->
            <div v-if=" campusQuery==='metric'">
              <metric></metric>
            </div>

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

.text-sm2{
  color: #717375;
}

</style>