<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="card mt-3 ">
           
            <div class="card-body" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="float: right; margin-right: 10px;"><i @click="goBack()" class="bi bi-x-lg"></i></div>

                <div>
    <div class="m-4">
      <div class="card-title mb-4">
              Interview : <b>{{ interviewM }}</b>
              <hr>
            </div>

      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="applicants_tab" data-bs-toggle="tab" data-bs-target="#applicants" type="button" role="tab" aria-controls="applicants" aria-selected="false"><small>Assess Interview Applicants</small></button>
          <button class="nav-link navColor" id="assessment_tab" data-bs-toggle="tab" data-bs-target="#assessment" type="button" role="tab" aria-controls="assessments" aria-selected="false"><small>Assessment Metrics On Interview</small></button>
          <button class="nav-link navColor" id="admission-offer_tab" data-bs-toggle="tab" data-bs-target="#admission-offer" type="button" role="tab" aria-controls="admission-offer" aria-selected="false"><small> Offer Admission</small></button>
          <!-- <button class="nav-link navColor" id="applicant-reports_tab" data-bs-toggle="tab" data-bs-target="#applicant-reports" type="button" role="tab" aria-controls="" aria-selected="false"><small>Applicant Reports</small></button>          -->
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade " id="assessment" role="tabpanel" aria-labelledby="assessment_tab" tabindex="0">
            <InterviewAssessmentList></InterviewAssessmentList>
        </div>
        <div class="tab-pane fade show active" id="applicants" role="tabpanel" aria-labelledby="applicants_tab" tabindex="0">
          <ApplicantsAssessment></ApplicantsAssessment>
        </div>
        <div class="tab-pane fade" id="admission-offer" role="tabpanel" aria-labelledby="admission-offer_tab" tabindex="0">
          <InterviewLearnersList></InterviewLearnersList>
        </div>
      
   
        
      </div>

    </div>
  </div>
  
  
            </div>
          </div>
        </div>
  
  
      </div>
    </div>
</template>
<script setup>
import InterviewAssessmentList from './InterviewAssessmentList.vue';
import {useRouter} from "vue-router";
import ApplicantsAssessment from "@/main/dashboard/studentApplication/ApplicantsAssessment.vue"
import InterviewLearnersList from './InterviewLearnersList.vue';
const routerData = useRouter()
let  interviewNumber = routerData.currentRoute.value.query.interview_id
let assessmentricsNumber = routerData.currentRoute.value.query.assessment_metric_id
let interviewM = routerData.currentRoute.value.query.interview


const goBack = () => {
  window.history.back()
}
</script>