<script setup>
import InterviewAssessmentList from './InterviewAssessmentList.vue';
import {useRouter} from "vue-router";
import ApplicantsAssessment from "@/main/dashboard/studentApplication/ApplicantsAssessment.vue"
import InterviewLearnersList from './InterviewLearnersList.vue';
const routerData = useRouter()
let  interviewNumber = routerData.currentRoute.value.query.interview_id
let assessmentricsNumber = routerData.currentRoute.value.query.assessment_metric_id
let interviewM = routerData.currentRoute.value.query.interview
import router from "@/config/router.js";

const goBack = () => {
  window.history.back()
}

const selectedTab = router.currentRoute.value.query.type ?? 'applicants'
const menu = router.currentRoute.value.query.m



const switchTabs = (data) => {
  router.push({
    name: "manage-interviews",
    query: {
      m: menu,
      type: data,
      interview_id: interviewNumber,
      assessment_metric_id: assessmentricsNumber,
      interview: interviewM
    }
  });
};

</script>

<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="card mt-3 ">
           
            <div class="ca" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="float: right; margin-right: 10px;"><i @click="goBack()" class="bi bi-x-lg"></i></div>

                <div>
    <div class="m-3">
      <div class="card-title mb-4">
              Interview : <b>{{ interviewM }}</b>
              <hr>
            </div>


        <div class="flex border-b">

          <!-- <div class="cursor-pointer text-sm" :class="selectedTab === 'assessment' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('assessment')">
            <div class="py-2 px-3">
              <i class="bi bi-box-arrow-in-right mr-1"></i>
              Assessment Schedules On Interview
            </div>
          </div> -->

          <div class="cursor-pointer text-sm" :class="selectedTab === 'applicants' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('applicants')">
            <div class="py-2 px-3">
              <i class="bi bi-box-arrow-in-right mr-1"></i>
            Enter Interview Scores
            </div>
          </div>

        <div class="cursor-pointer text-sm" :class="selectedTab === 'admission-offer' ? 'border-b-2 border-[#2c2f8c]' : ''" @click="switchTabs('admission-offer')">
          <div class="py-2 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Offer Admission
          </div>
        </div>
      </div>




      <!-- <div v-if="selectedTab === 'assessment'">
        <div>
          <InterviewAssessmentList></InterviewAssessmentList>
        </div>
      </div> -->

      <div v-if="selectedTab === 'applicants'">
        <div >
          <ApplicantsAssessment></ApplicantsAssessment>
        </div>
      </div>

      <div v-if="selectedTab === 'admission-offer'">
        <div >
          <InterviewLearnersList></InterviewLearnersList>
        </div>
      </div>

      <div class="tab-content" id="nav-tabContent">
        <!-- <div class="tab-pane fade " id="assessment" role="tabpanel" aria-labelledby="assessment_tab" tabindex="0">
            <InterviewAssessmentList></InterviewAssessmentList>
        </div> -->
        <!-- <div class="tab-pane fade show active" id="applicants" role="tabpanel" aria-labelledby="applicants_tab" tabindex="0">
          <ApplicantsAssessment></ApplicantsAssessment>
        </div> -->
        <!-- <div class="tab-pane fade" id="admission-offer" role="tabpanel" aria-labelledby="admission-offer_tab" tabindex="0">
          <InterviewLearnersList></InterviewLearnersList>
        </div> -->
      </div>

    </div>
  </div>
  
  
            </div>
          </div>
        </div>
  
  
      </div>
    </div>
</template>
