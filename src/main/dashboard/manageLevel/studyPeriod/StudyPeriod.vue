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



    <div class="row mx-auto mb-4">
      <div class="col-3">
        <div class="mb-2">
          <label class="textColor"><small>Academic Year</small></label>
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="academicYearNumber"
              @change="filterStudyPeriod(academicYearNumber)"
          >
            <option disabled value="">Select Class</option>
            <option value="">All</option>
            <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
              {{list.code+". "+list.academic_year_name}}
            </option>
          </select>
        </div>
      </div>
    </div>


    <table class="table table-hover caption-top text-sm" style="font-size: 14px;">
      <thead>
      <tr>
<!--        <th scope="col">#</th>-->
        <th scope="col">Code</th>
        <th scope="col">Level</th>
        <th>
          <div class="row" >
            <div class="col-lg-4">Academic Year</div>
            <div class="col-lg-8">
             <span class="ml-3">Study Period</span>
            </div>
          </div>
        </th>
      </tr>
      </thead>
      <tbody>

      <tr v-for="(level, index) in studyPeriodList" :key="index">
        <td> {{level.code}}</td>
        <td class="capitalize"> {{level.name}}</td>
        <td>
          <table class="table table-hover caption-top text-sm">
            <tbody>
            <tr v-for="(academicYre,idx) in level.academicYear" :key="idx">
              <td>{{academicYre.code}}</td>
              <td class="w-[30%] capitalize">
                <div>
                <div>{{academicYre.academic_year_name}}</div>
                  <span class="bg-[#0d6efd] px-2 py-[2px] rounded-sm text-white text-xs">{{academicYre.no_of_study_period}} Study Periods</span>
                </div>
                <div class="ml-5 text-sm">
                  <small>
                   <b>From:</b>  <small>{{academicYre.academic_year_start_date}}</small><br />
                   <b>To:</b>  <small>{{academicYre.academic_year_end_date}}</small>
                  </small>
                </div>
              </td>

              <td>
                <table class="table table-hover caption-top text-sm">
                  <tbody>
                  <tr v-for="(styPeriod, index) in academicYre.studyPeriod" :key="index">

                    <td> {{styPeriod.code}}</td>
                    <td class="capitalize"> {{styPeriod.study_period_name}}</td>
                    <td>
                      <small>
                       <b>From:</b> {{styPeriod.study_period_start_date}}<br />
                       <b>To:</b> {{styPeriod.study_period_end_date}}
                      </small>
                    </td>
                    <td>
                      <div>
                        <i
                            data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                            class="bi-pencil mr-2 cursor-pointer" @click="editStudyPeriod(styPeriod)"></i>
                        <i class="bi-trash cursor-pointer"  @click="deleteStudyPeriod(styPeriod,index)"></i>
                        <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  </tbody>
                </table>

              </td>
            </tr>
            </tbody>
          </table>

        </td>

      </tr>



      </tbody>
    </table>





  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import NewStudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/NewStudyPeriod.vue";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()

const routerData = useRouter()
const newAcademicYearDialog = ref( false)
const campusCurriculumNumber = routerData.currentRoute.value.query.crr
const studyPeriodList = ref( [])
const  notificationStore  = useNotificationStore()
const academicYearNumber = ref( "")
const academicYearList = ref( [])
const deletionLoader = ref( undefined)



const addStudyPeriod = (item) => {
  // classNumber.value = item.number
  newAcademicYearDialog.value = true
}


const editStudyPeriod = (styPeriod)  => {

}

const deleteStudyPeriod = (styPeriod, idx) => {
  deletionLoader.value = idx

  if(!confirm("Are you sure, you want to delete: "+styPeriod.study_period_name)){
    return
  }


  let data = {
    number:styPeriod.number
  }
  studyPeriodStore.deleteStudyPeriod(data)

}

const filterStudyPeriod = (academicYearNumber) => {
  if(academicYearNumber) {
    studyPeriodData()
    //studyPeriodStore.fetchStudyPeriod({level:campusCurriculumNumber, academic_year_number:academicYearNumber})
  }
}

onMounted(
    () => {
      studyPeriodData()
      // studyPeriodStore.fetchStudyPeriod({level:campusCurriculumNumber, academic_year_number:academicYearNumber.value})
      // academicYearStore.fetchAcademicYear(campusLevel)
    }
)

const studyPeriodData = () => {
  studyPeriodStore.fetchStudyPeriod({campus_curriculum_number:campusCurriculumNumber, academic_year_number:academicYearNumber.value})
}

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
        await studyPeriodData()
        notificationStore.successToast("Success","Study Period added successfully")
      }
    },
    {deep:true}
)

watch(
    () => academicYearStore.academicYearResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => studyPeriodStore.deleteStudyPeriodResponse,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
        await studyPeriodStore.fetchStudyPeriod({level: campusCurriculumNumber, academic_year_number: academicYearNumber.value})
      }
    },
    {deep:true}
)

</script>

<style scoped>

</style>