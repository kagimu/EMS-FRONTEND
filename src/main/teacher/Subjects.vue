<script setup>

import router from "@/config/router.js";
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import Students from "@/main/teacher/students/Students.vue";
import StudentAssessment from "@/main/teacher/students/StudentAssessment.vue";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";

import LearningAreaList from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/LearningAreaList.vue";
import SubjectCluster from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/SubjectCluster.vue";
import SubjectList from "@/main/dashboard/curriculum/curriculumSetup/subject/SubjectList.vue";
import StrandList from "@/main/dashboard/curriculum/curriculumSetup/strands/StrandList.vue";
import TopicList from "@/main/dashboard/curriculum/curriculumSetup/topic/TopicList.vue";
import SubTopicList from "@/main/dashboard/curriculum/curriculumSetup/subTopic/SubTopicList.vue";
import ConceptList from "@/main/dashboard/curriculum/curriculumSetup/concept/ConceptList.vue";
import AppModal from "@/components/AppModal.vue";
import SelectCurriculumModal from "@/main/teacher/SelectCurriculumModal.vue";


import { useAbility } from '@casl/vue';
const { can } = useAbility()
const routerData = useRouter()
const selectedTab = routerData.currentRoute.value.query.tab ?? 'learning-area'
const curriculumStore = useCurriculumStore()
const curriculumList = ref([])
 const curriculumNumber = ref("")
 const curriculum_number = ref(null)
 const showingModal = ref(false)
const switchTabs = (tab) => {
  router.push({name: "manage-subjects", query: {id:routerData.currentRoute.value.query.id,ccl:routerData.currentRoute.value.query.ccl,tab:tab}});
}


onMounted(
    async () => {
      await  curriculumStore.fetchCurriculum()
      if(!curriculum_number.value){
        showingModal.value = true
      }
      curriculumNumber.value = localStorage.getItem("CurriculumNum") || "";
    }
)

watch(
    () => curriculumStore.curriculumDataResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)


watch(curriculumNumber, (newValue) => {
  if (newValue) {
    curriculum_number.value = newValue
    showingModal.value = false
  }
});

</script>

<template>

<AppModal v-model="showingModal"  title="" xs>
      <SelectCurriculumModal></SelectCurriculumModal>
    </AppModal>

  <div>
    <div class="bg-white border rounded-md py-3 px-2 mt-4">
  
  <div class="flex border-b mt-1">
    <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'learning-area' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('learning-area')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
       Learning Area
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'subject-cluster' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('subject-cluster')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
       Subject Cluster
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'subject' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('subject')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
       Subject 
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'strand' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('strand')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Strand
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'topic' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('topic')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Topic
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'subtopic' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('subtopic')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Sub Topic
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'concept' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('concept')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
      Concept
      </div>
    </div>
  </div>

  <div v-if="selectedTab === 'learning-area'">
   <LearningAreaList></LearningAreaList>
  </div>
  <div v-if="selectedTab === 'assessment'">
    <StudentAssessment></StudentAssessment>
  </div>

  <div v-if=" selectedTab === 'subject-cluster'">
                  <subject-cluster></subject-cluster>
                </div>

                <div v-if=" selectedTab === 'subject'">
                  <subject-list></subject-list>
                </div>

                <div v-if=" selectedTab === 'strand'">
                   <strand-list></strand-list>
                   </div>

                   <div v-if=" selectedTab === 'topic'">
                    <topic-list></topic-list>
                    </div>

                    <div v-if=" selectedTab === 'subtopic'">
                       <sub-topic-list></sub-topic-list>
                       </div>

                       <div v-if=" selectedTab === 'concept'">
                        <concept-list></concept-list>
                        </div>
</div>
  </div>
</template>

<style scoped>

</style>