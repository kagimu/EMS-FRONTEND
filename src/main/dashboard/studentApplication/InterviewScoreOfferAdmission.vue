<script setup>
import { ref , onMounted} from 'vue';
import InterviewLearnersList from './InterviewLearnersList.vue';
import ApplicantsAssessment from "@/main/dashboard/studentApplication/ApplicantsAssessment.vue";
const selectedTab = ref('applicants'); // Default tab
   import { useStudentApplicationStore } from "@/main/dashboard/studentApplication/store/student_application"

const studentApplicationStore = useStudentApplicationStore()
const interviewData = ref([])
const admissionLearnerDetailsInfo = ref(null)

const switchTabs = (tab) => {
  selectedTab.value = tab;
};

const props = defineProps({
  interviewInfo: {},
  admissionLearnerDetails:{}
});

onMounted(async () => {
    interviewData.value = props.interviewInfo
    studentApplicationStore.fetchAssessmentMetricsOnInterview(props.interviewInfo.interview_number)

    if(props.admissionLearnerDetails){
        admissionLearnerDetailsInfo.value = props.admissionLearnerDetails
    }

  });


</script>

<template>
  <div>
    <!-- Tab Switcher -->
    <div class="flex border-b mt-1">
      <div 
           :class="selectedTab === 'applicants' ? 'selected-tab' : 'unselected-tab'"
           @click="switchTabs('applicants')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Enter Interview Scores
        </div>
      </div>
      <div 
           :class="selectedTab === 'admission-offer' ? 'selected-tab' : 'unselected-tab'"
           @click="switchTabs('admission-offer')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Offer Admission
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content mt-4">
      <div v-if="selectedTab === 'applicants'">
        <ApplicantsAssessment  :interviewInfoData="interviewData"></ApplicantsAssessment>
      </div>
      <div v-if="selectedTab === 'admission-offer'">
    <InterviewLearnersList :interviewInfoDataa="interviewData" :admissionLearnerDetailsInfo="admissionLearnerDetailsInfo"></InterviewLearnersList>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selected-tab {
  border-bottom: 2px solid #2c2f8c;
  color: #2c2f8c;
  font-weight: bold;
  background-color: #f1f8fe;
  cursor: pointer;
  text-align: center;
}
.unselected-tab {
  border-bottom: 1px solid #bbbbbb;
  background-color: #f1f1f1;
  color: #555;
  cursor: pointer;
  text-align: center;
}
.tab-content p {
  font-size: 16px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
