<script setup>
import InterviewAssessmentList from './InterviewAssessmentList.vue';
import { useRouter } from "vue-router";
import ApplicantsAssessment from "@/main/dashboard/studentApplication/ApplicantsAssessment.vue";
import InterviewLearnersList from './InterviewLearnersList.vue';
const routerData = useRouter();
let interviewNumber = routerData.currentRoute.value.query.interview_id;
let assessmentricsNumber = routerData.currentRoute.value.query.assessment_metric_id;
let interviewM = routerData.currentRoute.value.query.interview;
import router from "@/config/router.js";

const goBack = () => {
  window.history.back();
};

const selectedTab = router.currentRoute.value.query.type ?? 'applicants';
const menu = router.currentRoute.value.query.m;

const switchTabs = (data) => {
  router.push({
    name: "manage-interviews",
    query: {
      m: menu,
      type: data,
      interview_id: interviewNumber,
      assessment_metric_id: assessmentricsNumber,
      interview: interviewM,
    },
  });
};
</script>

<template>
  <div class="container mt-1">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
          
            <div class="mb-2">
              <div class="d-flex align-items-center mb- text-[13px]">
                <h6 class="me- mb-0 text-[13px] py-1">Interview: &nbsp;</h6>
                {{ interviewM }}
              </div>
              <!-- <div class="d-flex align-items-center mb-2">
                <span class="me-2">Scheduled On:</span>
                <span>12/02/2025</span>
              </div> -->
              <!-- <div class="d-flex align-items-center mb-2">
                <span class="me-2">Venue:</span>
                <span>Main Hall</span>
              </div> -->
              <!-- <div class="d-flex align-items-center mb-2">
                <span class="me-2">Message:</span>
                <span>Come early</span>
              </div> -->
              </div>
          </div>
          <div class="card-body">
           

            <div class="flex border-b mt-1">
        <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'applicants' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('applicants')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Enter Interview Scores
          </div>
        </div>
        <div  class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'admission-offer' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('admission-offer')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Offer Admission
          </div>
        </div>
      </div>

      
            <div class="tab-content mt-4">
      
              <div class="tab-pane" :class="{ active: selectedTab === 'applicants' }">
                <ApplicantsAssessment></ApplicantsAssessment>
              </div>
              <div class="tab-pane" :class="{ active: selectedTab === 'admission-offer' }">
                <InterviewLearnersList></InterviewLearnersList>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 8px;
}

.card-header {
  background-color: #f8f9fa;
}

.nav-tabs .nav-link {
  cursor: pointer;
}

.nav-tabs .nav-link.active {
  border-color: #dee2e6 #dee2e6 #f8f9fa;
}

.tab-content .tab-pane {
  display: none;
}

.tab-content .tab-pane.active {
  display: block;
}
</style>
