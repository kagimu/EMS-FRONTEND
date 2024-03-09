<template>
  <div>

    <div class="mt-3">
      <div class="ml-4 mt-3" v-if="curriculumInfo && curriculumInfo.name">
        <div style="font-size: 22px; text-transform: capitalize;">Curriculum: <span class="text-blue-900">{{curriculumInfo.name}}</span> </div>
      </div>
    </div>


    <div class="row">


        <div class="col-3">

          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
                <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Curriculum Setup</div>
       <hr />
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                <div
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="menuSelected === 'level' ? 'active' : ''"
                    @click="changeMenu('level')"
                >
                  <small style="font-size:12px;">Curriculum Level</small>
                </div>
              </div>
              


              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                <div
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="menuSelected === 'classes' ? 'active' : ''"
                    @click="changeMenu('classes')"
                >
                  <small style="font-size:12px;">Curriculum Classes</small>
                </div>
              </div>


            </div>
          </div>


          <div class="card mt-3">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Assessment Setup</div>
       <hr />

            <div class="card-body" style="padding: 0;">
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                <div
                    v-for="(item, idx) in  assessmentMenu"
                    :key="idx"
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="item.value === menuSelected ? 'active' : ''"
                    @click="changeMenu(item.value)"
                >
                  <small style="font-size:12px;">{{item.text}}</small>
                </div>
              </div>
            </div>
          </div>
     

          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                <div
                    v-for="(item, idx) in  curriculumMenu"
                    :key="idx"
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="item.value === menuSelected ? 'active' : ''"
                    @click="changeMenu(item.value)"
                >
                  <small style="font-size:12px;">{{item.text}}</small>
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">

              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                <div
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="menuSelected === 'import-curriculum' ? 'active' : ''"
                    @click="changeMenu('import-curriculum')"
                >
                  <small style="font-size:12px;">Import Curriculum</small>
                </div>
              </div>
            </div>
          </div>




      </div>


      <div class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <learning-area-list v-if="menuSelected==='learning-area'"></learning-area-list>
            <subject-cluster v-if="menuSelected==='subject-cluster'"></subject-cluster>
            <subject-list  v-if="menuSelected==='subject'"></subject-list>
            <strand-list v-if="menuSelected==='strand'"></strand-list>
            <topic-list v-if="menuSelected==='topic'"></topic-list>
            <sub-topic-list v-if="menuSelected==='subtopic'"></sub-topic-list>
            <concept-list v-if="menuSelected==='concept'"></concept-list>
<!--            manage curriculum-->
            <manage-curriculum v-if="menuSelected==='import-curriculum'"></manage-curriculum>
<!--            manage Level-->
            <curriculum-level v-if="menuSelected==='level'"></curriculum-level>
<!--            manage classes-->
            <curriculum-class-set-up v-if="menuSelected==='classes'"></curriculum-class-set-up>
            <assesment-areas v-if="menuSelected === 'assessmentarea'"></assesment-areas>
            <!-- <assessment-metrics v-if="menuSelected == 'assessmentmetric'"></assessment-metrics> -->
            <metric v-if="menuSelected == 'metric'"></metric>

          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import LearningAreaList from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/LearningAreaList.vue";
import SubjectCluster from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/SubjectCluster.vue";
import SubjectList from "@/main/dashboard/curriculum/curriculumSetup/subject/SubjectList.vue";
import StrandList from "@/main/dashboard/curriculum/curriculumSetup/strands/StrandList.vue";
import TopicList from "@/main/dashboard/curriculum/curriculumSetup/topic/TopicList.vue";
import SubTopicList from "@/main/dashboard/curriculum/curriculumSetup/subTopic/SubTopicList.vue";
import ConceptList from "@/main/dashboard/curriculum/curriculumSetup/concept/ConceptList.vue";
import ClassSetupList from "@/main/dashboard/manageLevel/class/ClassSetupList.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
import ManageCurriculum from "@/main/dashboard/curriculum/curriculumSetup/ManageCurriculum.vue";
import {useRouter} from "vue-router";
import CurriculumLevel from "@/main/settings/level/CurriculumLevel.vue";
import CurriculumClassSetUp from "@/main/dashboard/manageLevel/class/CurriculumClassSetUp.vue";
import AssesmentAreas from "@/main/dashboard/assessment/assessmentComponents/AssesmentAreas.vue";
import AssessmentMetrics from "@/main/dashboard/assessment/assessmentComponents/AssessmentMetrics.vue";
import Metric from "@/main/dashboard/assessment/assessmentComponents/Metric.vue";



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
  {text:"Assessment Area", value:"assessmentarea"},
  // {text:"Assessment Metric", value:"assessmentmetric"},
  {text:"Metric", value:"metric"},
])

const notificationStore  = useNotificationStore()
const curriculumStore = useCurriculumStore()
let  curriculumNumber = routerData.currentRoute.value.query.id
let curriculumInfo = ref(null)




const changeMenu = (value) => {
  menuSelected.value = value
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

<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

</style>