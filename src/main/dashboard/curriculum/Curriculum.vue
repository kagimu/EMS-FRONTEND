<template>
  <div>

    <div class="mt-3 flex">
      <div class="ml-4">Curriculum Setup</div>
    </div>


    <div class="row">


        <div class="col-3">

          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Curriculum</div>
              <hr />
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
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Curriculum</div>
              <hr />
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

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Class Setup</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <div
                  class="list-group-item list-group-item-action cursor-pointer"
                  :class="menuSelected === 'class' ? 'active' : ''"
                  @click="changeMenu('class')"
              >
                <small style="font-size:12px;">Class</small>
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
            <class-setup-list v-if="menuSelected==='class'"></class-setup-list>
            <manage-curriculum v-if="menuSelected==='import-curriculum'"></manage-curriculum>
          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>

import {ref, watch} from "vue";
import LearningAreaList from "@/main/dashboard/curriculum/lerningArea/LearningAreaList.vue";
import SubjectCluster from "@/main/dashboard/curriculum/subjectCluster/SubjectCluster.vue";
import SubjectList from "@/main/dashboard/curriculum/subject/SubjectList.vue";
import StrandList from "@/main/dashboard/curriculum/strands/StrandList.vue";
import TopicList from "@/main/dashboard/curriculum/topic/TopicList.vue";
import SubTopicList from "@/main/dashboard/curriculum/subTopic/SubTopicList.vue";
import ConceptList from "@/main/dashboard/curriculum/concept/ConceptList.vue";
import ClassSetupList from "@/main/dashboard/manageLevel/class/ClassSetupList.vue";
import NewLearningArea from "@/main/dashboard/curriculum/lerningArea/NewLearningArea.vue";
import ImportCurriculum from "@/main/dashboard/curriculum/importCurriculum/importCurriculum.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/store/curriculum.js";
import ManageCurriculum from "@/main/dashboard/curriculum/ManageCurriculum.vue";

const menuSelected = ref( "learning-area")
const curriculumMenu = ref( [
  {text:"Learning Area", value:"learning-area"},
  {text:"Subject Cluster", value:"subject-cluster"},
  {text:"Subject", value:"subject"},
  {text:"Strand", value:"strand"},
  {text:"Topic", value:"topic"},
  {text:"Subtopic", value:"subtopic"},
  {text:"Concept", value:"concept"},
])

const notificationStore  = useNotificationStore()
const curriculumStore = useCurriculumStore()




const changeMenu = (value) => {
  menuSelected.value = value
}

const importDialog = ref(false)
const importFromExcel = () => {
  importDialog.value = true
}


watch(
    () => curriculumStore.importResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
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