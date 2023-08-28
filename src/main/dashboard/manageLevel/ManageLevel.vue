<template>
  <div>


    <level-info></level-info>



<!--    <div class="row mt-3">
      <div class="col-12">


        <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">New Level</button>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Level</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">


            <form @submit.prevent="addCampus">


              <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input type="email" v-model="form.name" required class="form-control">
              </div>



              <div class="text-right mt-4">
                <button type="submit" class="btn btn-primary mb-2">
                  save

                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>


            </form>


          </div>
        </div>


      </div>
    </div>-->





    <div class="row">
      <div class="col-3">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="levelDataInfo">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Level</div>

            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link v-for="(item, idx) in  levelDataInfo.levels" :key="idx" class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">{{item.name}}</small></router-link>
<!--              <router-link class="list-group-item list-group-item-action active" :to="{name:''}"><small style="font-size:12px;">Kindergarten</small></router-link>-->
<!--              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Primary</small></router-link>-->
<!--              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Secondary</small></router-link>-->
<!--              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Tertiary</small></router-link>-->
<!--              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Vocational</small></router-link>-->
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
                    <button class="nav-link navColor active" id="subjects-tab" data-bs-toggle="tab" data-bs-target="#subjects" type="button" role="tab" aria-controls="subjects" aria-selected="false"><small>Subjects</small></button>
                    <button class="nav-link navColor" id="grading-scale-tab" data-bs-toggle="tab" data-bs-target="#grading-scale" type="button" role="tab" aria-controls="grading-scale" aria-selected="true"><small>Grading Scale</small></button>
                    <button class="nav-link navColor" id="study-period-tab" data-bs-toggle="tab" data-bs-target="#study-period" type="button" role="tab" aria-controls="study-period" aria-selected="false"><small>Study Period</small></button>
                    <button class="nav-link navColor" id="assessment-manager-tab" data-bs-toggle="tab" data-bs-target="#assessment-manager" type="button" role="tab" aria-controls="assessment-manager" aria-selected="false"><small>Assessment Manager</small></button>
                    <button class="nav-link navColor" id="mode-of-assessment-tab" data-bs-toggle="tab" data-bs-target="#mode-of-assessment" type="button" role="tab" aria-controls="mode-of-assessment" aria-selected="false"><small>Mode of Assessment</small></button>
                    <button class="nav-link navColor" id="grading-term-tab" data-bs-toggle="tab" data-bs-target="#grading-term" type="button" role="tab" aria-controls="grading-term" aria-selected="false"><small>Grading Term</small></button>
                  </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                  <div class="tab-pane fade show active" id="subjects" role="tabpanel" aria-labelledby="subjects-tab" tabindex="0">
                    <subject></subject>
                  </div>
                  <div class="tab-pane fade" id="grading-scale" role="tabpanel" aria-labelledby="grading-scale-tab" tabindex="0">Grading Scale</div>
                  <div class="tab-pane fade" id="study-period" role="tabpanel" aria-labelledby="study-period-tab" tabindex="0">Study Period</div>
                  <div class="tab-pane fade" id="assessment-manager" role="tabpanel" aria-labelledby="assessment-manager-tab" tabindex="0">Assessment Manger</div>
                  <div class="tab-pane fade" id="mode-of-assessment" role="tabpanel" aria-labelledby="mode-of-assessment-tab" tabindex="0">Mode of Assessment</div>
                  <div class="tab-pane fade" id="grading-term" role="tabpanel" aria-labelledby="grading-term-tab" tabindex="0">Grading Term</div>
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

import {ref, watch} from "vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useLevelStore} from "@/main/dashboard/manageLevel/store/level.js";
const levelStore = useLevelStore()
const levelDataInfo = ref(null)

watch(
    () => levelStore.levelResponse,
    async (data) => {
      if(data){
        levelDataInfo.value = data.data
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

.navColor{
  color: black;
}

</style>