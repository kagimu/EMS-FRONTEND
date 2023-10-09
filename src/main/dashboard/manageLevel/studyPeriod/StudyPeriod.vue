<template>
  <div>
    <div class="modal fade" id="newStudyPeriod" tabindex="-1" :class="{ show: newAcademicYearDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Study Period</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-study-period></new-study-period>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="flex justify-content-between mt-10 mb-4 mr-3">
      &nbsp;
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addStudyPeriod" data-bs-toggle="modal" data-bs-target="#newStudyPeriod">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Study Period
      </button>
    </div>


    <table class="table table-hover caption-top" style="font-size: 14px;">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Code</th>
        <th scope="col">Period name</th>
        <th scope="col">Academic Year</th>
        <th scope="col">Date Period</th>
        <th scope="col">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(styPeriod, index) in studyPeriodList" :key="index">
        <td>{{index+1}}</td>
        <td> {{styPeriod.code}}</td>
        <td> {{styPeriod.study_period_name}}</td>
        <td> {{styPeriod.academic_year_name}}</td>
        <td class="text-sm">
          Start Date:   {{styPeriod.study_period_start_date}}  <br />
          End Date:  {{styPeriod.study_period_end_date}}
        </td>
        <td>
          <div>
            <i
                style="font-size: 13px;"
                data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                class="bi-pencil mr-2 cursor-pointer" @click="editStudyPeriod(styPeriod)"></i>
            <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteStudyPeriod(styPeriod)"></i>
          </div>
        </td>
      </tr>
      </tbody>
    </table>





  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import NewStudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/NewStudyPeriod.vue";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
const routerData = useRouter()
const newAcademicYearDialog = ref( false)
const campusLevel = routerData.currentRoute.value.query.l
const studyPeriodList = ref( [])
const studyPeriodStore = useStudyPeriodStore()
const  notificationStore  = useNotificationStore()

const addStudyPeriod = (item) => {
  // classNumber.value = item.number
  newAcademicYearDialog.value = true
}


const editStudyPeriod = (styPeriod)  => {

}

const deleteStudyPeriod = (styPeriod) => {

}

onMounted(
    () => {
      studyPeriodStore.fetchStudyPeriod(campusLevel)
    }
)


/*watch(
    () => academicYearStore.newAcademicYearResponse,
    async (data) => {
      if(data){
        await academicYearStore.fetchAcademicYear(campusLevel)
      }
    },
    {deep:true}
)*/

watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => studyPeriodStore.newStudyPeriodResponse,
    async (data) => {
      if(data){
        await studyPeriodStore.fetchStudyPeriod(campusLevel)
        notificationStore.successToast("Success","Study Period added successfully")
      }
    },
    {deep:true}
)

</script>

<style scoped>

</style>