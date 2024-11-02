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
    <!-- {{ interviewInfo }} -->
    
  <div>
    <!-- Tab Switcher -->
   <!-- Interview Info Card -->
   <div class="interview-info-card">
      <!-- <h2>Interview Details</h2> -->
      <div class="info-grid">
        <div class="info-item">
          <i class="bi bi-person-fill"></i>
          <span>Name:</span> {{ interviewInfo.name }}
        </div>
        <div class="info-item">
          <i class="bi bi-geo-alt-fill"></i>
          <span>Venue:</span> {{ interviewInfo.venue }}
        </div>
        <div class="info-item">
          <i class="bi bi-calendar-event-fill"></i>
          <span>Date:</span> {{ interviewInfo.interview_date }}
        </div>
        <div class="info-item">
          <i class="bi bi-book-fill"></i>
          <span>Class:</span> {{ interviewInfo.class }}
        </div>
      </div>
    </div>
    <div class="flex border-b mt-1">
      <div 
           :class="selectedTab === 'applicants' ? 'selected-tab' : 'unselected-tab'"
           @click="switchTabs('applicants')">
        <div class="py-1 px-3 text-xs">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          Enter Interview Scores
        </div>
      </div>
      <div 
           :class="selectedTab === 'admission-offer' ? 'selected-tab' : 'unselected-tab'"
           @click="switchTabs('admission-offer')">
        <div class="py-1 px-3 text-xs">
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
  font-size: 13px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

/* Interview Info Card */
.interview-info-card {
  background-color: #f8f9fe;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.interview-info-card h2 {
  color: #2c2f8c;
  font-weight: bold;
  margin-bottom: 12px;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 8px 12px;
  width: calc(24% - 6px); /* Responsive half-width items */
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
}

.info-item i {
  color: #2c2f8c;
  margin-right: 8px;
}

.info-item span {
  font-weight: 600;
  color: #333;
}

/* Tabs */
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
