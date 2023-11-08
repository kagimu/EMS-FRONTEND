<template>
  <div>



    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Students Admission</div>

            <div class="mt-4">
              <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                  <button class="nav-link navColor active" id="babyClass-tab" data-bs-toggle="tab" data-bs-target="#babyClass" type="button" role="tab" aria-controls="babyClass" aria-selected="false"><small>Admissions</small></button>
                  <button class="nav-link navColor" id="grading-scale-tab" data-bs-toggle="tab" data-bs-target="#grading-scale" type="button" role="tab" aria-controls="grading-scale" aria-selected="true"><small>New Admission</small></button>
                </div>
              </nav>
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="babyClass" role="tabpanel" aria-labelledby="babyClass-tab" tabindex="0">
                 <admission-list></admission-list>
                </div>
                <div class="tab-pane fade" id="grading-scale" role="tabpanel" aria-labelledby="grading-scale-tab" tabindex="0">
                  <new-admission></new-admission>
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

import {reactive, ref} from "vue";
import AdmissionList from "@/main/dashboard/studentAdmission/AdmissionList.vue";
import NewAdmission from "@/main/dashboard/studentAdmission/NewAdmission.vue";

const buttonLoader = ref(false)
let show = ref(false)

const form = reactive({
  first_name:null,
  second_name:null,
  email:null,
  phone:null,
  location:null,
  level:""
})

function addCampus(){
  alert(JSON.stringify(form))
}

</script>

<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

</style>