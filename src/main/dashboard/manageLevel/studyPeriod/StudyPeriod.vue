<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import NewStudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/NewStudyPeriod.vue";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import AppModal from "@/components/AppModal.vue";
import { useAbility } from '@casl/vue';
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

const { can } = useAbility()


const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()

const routerData = useRouter()
const newStudyPeriodDialog = ref( false)
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const studyPeriodList = ref( [])
const  notificationStore  = useNotificationStore()
const academicYearNumber = ref( "")
const academicYearList = ref( [])
const deletionLoader = ref( undefined)
const editMode = ref( false)

onMounted(
    () => {
      // classStore.fetchCampusLevel(campus_curriculum_number)
    }
)


const addStudyPeriod = () => {
  newStudyPeriodDialog.value = true
  editMode.value = false
}


const editStudyPeriod = (styPeriod)  => {
  if(styPeriod) {
    editMode.value = true
    newStudyPeriodDialog.value = true
    studyPeriodStore.fetchStudyPeriodData(styPeriod.number)
  }
}


const deleteStudyPeriod = async (styPeriod, idx) => {
  deletionLoader.value = idx

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+styPeriod.study_period_name);
if (agreed) {
  let data = {
    number:styPeriod.number
  }
  await studyPeriodStore.deleteStudyPeriod(data)
}


}


const filterStudyPeriod = (academicYearNumber) => {
  if(academicYearNumber) {
    studyPeriodData()
  }
}

onMounted(
    () => {
      studyPeriodData()
    }
)

const studyPeriodData = () => {
  studyPeriodStore.fetchStudyPeriod({campus_curriculum_number:campus_curriculum_number, academic_year_number:academicYearNumber.value})
}


watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)

watch(
    () => studyPeriodStore.newStudyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodData()
        notificationStore.successToast("Success","Study Period added successfully")
      }
    }
)

watch(
    () => academicYearStore.academicYearResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)

watch(
    () => studyPeriodStore.deleteStudyPeriodResponse,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
        studyPeriodData()
      }
    }
)

watch(
    () => studyPeriodStore.editStudyPeriodResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
         studyPeriodData()
      }
    }
)



</script>
<template>
  <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode ? 'Edit Study Period' : 'Add Study Period'" v-model="newStudyPeriodDialog" lg>
      <new-study-period></new-study-period>
    </AppModal>


    <div class="flex justify-content-between mt-10 mb-4 mr-3">
      &nbsp;
      <button v-if="can('create_term','manage')"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addStudyPeriod">
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
            <option disabled value="">--Select --</option>
            <option value="">All</option>
            <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
              {{list.code+". "+list.academic_year_name}}
            </option>
          </select>
        </div>
      </div>
    </div>


    <table class="table table-hover caption-top text-sm" style="font-size: 14px;" v-if="can('view_term','manage')">
      <thead>
      <tr>
<!--        <th scope="col">#</th>-->
        <th class="w-[5%]" scope="col">#Code</th>
        <th class="w-[20%]"  scope="col">Level</th>
        <th>
          <div class="row" >
            <div class="col-lg-6">Academic Year</div>
            <div class="col-lg-6">
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
              <td class="w-[5%] capitalize">{{academicYre.code}}</td>
              <td class="w-[40%] capitalize">
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
                    <td>
                      <div class="capitalize"> {{styPeriod.study_period_name}}</div>
                      <div class="ml-3">
                        <small>
                          <b>From:</b> {{styPeriod.study_period_start_date}}<br />
                          <b>To:</b> {{styPeriod.study_period_end_date}}
                        </small>
                      </div>

                    </td>
                    <td>
                      <div>
                        <i v-if="can('update_term','manage')"
                            data-bs-toggle="modal"
                            data-bs-target="#newStudyPeriod"
                            class="bi-pencil mr-2 cursor-pointer"
                            @click="editStudyPeriod(styPeriod)"></i>
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



<style scoped>

</style>