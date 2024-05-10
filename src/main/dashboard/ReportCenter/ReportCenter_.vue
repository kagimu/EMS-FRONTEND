<template>
<div>

  <div class="row">
    <div class="col-3">
      <div class="card mt-3">
        <div class="card-body" style="padding: 0;">
          <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Level</div>


          <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
            <router-link 
            v-if="can('view_kindergaten_reports','general')"
            class="list-group-item list-group-item-action active" :to="{name:''}"><small style="font-size:12px;">Kindergarten</small></router-link>
            <router-link
            v-if="can('view_primary_reports','general')"
             class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Primary</small></router-link>
            <router-link 
            v-if="can('view_secondary_reports','general')"
            class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Secondary</small></router-link>
            <router-link
            v-if="can('view_tertiary_reports','general')"
             class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Tertiary</small></router-link>
            <router-link 
            v-if="can('view_vocational_reports','general')"
            class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Vocational</small></router-link>
          </div>



        </div>
      </div>
    </div>

    <div class="col-9">
      <div class="card mt-3">
        <div class="card-body" style="padding: 0;">

          <div class="mt-4">

            <div class="mt-4">
              <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                  <button 
                  
                  class="nav-link navColor active" id="babyClass-tab" data-bs-toggle="tab" data-bs-target="#babyClass" type="button" role="tab" aria-controls="babyClass" aria-selected="false"><small>Baby Class</small></button>
                  <button class="nav-link navColor" id="grading-scale-tab" data-bs-toggle="tab" data-bs-target="#grading-scale" type="button" role="tab" aria-controls="grading-scale" aria-selected="true"><small>Middle CLass</small></button>
                  <button class="nav-link navColor" id="study-period-tab" data-bs-toggle="tab" data-bs-target="#study-period" type="button" role="tab" aria-controls="study-period" aria-selected="false"><small>Top Class</small></button>
                  <button class="nav-link navColor" id="assessment-manager-tab" data-bs-toggle="tab" data-bs-target="#assessment-manager" type="button" role="tab" aria-controls="assessment-manager" aria-selected="false"><small>Primary</small></button>
                  <button class="nav-link navColor" id="mode-of-assessment-tab" data-bs-toggle="tab" data-bs-target="#mode-of-assessment" type="button" role="tab" aria-controls="mode-of-assessment" aria-selected="false"><small>Secondary</small></button>
                  <button class="nav-link navColor" id="grading-term-tab" data-bs-toggle="tab" data-bs-target="#grading-term" type="button" role="tab" aria-controls="grading-term" aria-selected="false"><small>Tertiary</small></button>
                </div>
              </nav>
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="babyClass" role="tabpanel" aria-labelledby="babyClass-tab" tabindex="0">
                  <baby-class-report></baby-class-report>
                </div>
                <div class="tab-pane fade" id="grading-scale" role="tabpanel" aria-labelledby="grading-scale-tab" tabindex="0">
                  <baby-class-report></baby-class-report>
                </div>
                <div class="tab-pane fade" id="study-period" role="tabpanel" aria-labelledby="study-period-tab" tabindex="0">
                  <top-class-report></top-class-report>
                </div>
                <div class="tab-pane fade" id="assessment-manager" role="tabpanel" aria-labelledby="assessment-manager-tab" tabindex="0">
                  <primary-report></primary-report>
                </div>
                <div class="tab-pane fade" id="mode-of-assessment" role="tabpanel" aria-labelledby="mode-of-assessment-tab" tabindex="0">
                  <victorious-report-primary></victorious-report-primary>
                </div>
                <div class="tab-pane fade" id="grading-term" role="tabpanel" aria-labelledby="grading-term-tab" tabindex="0">Tertiary</div>
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

import BabyClassReport from "@/main/dashboard/ReportCenter/BabyClassReport_.vue";
import TopClassReport from "@/main/dashboard/ReportCenter/TopClassReport_.vue";
import PrimaryReport from "@/main/dashboard/ReportCenter/PrimaryReport_.vue";

import { useAbility } from '@casl/vue';
import VictoriousReportPrimary from "@/main/dashboard/ReportCenter/victorious/VictoriousReportPrimary.vue";

const { can } = useAbility()

</script>

<style scoped>

</style>