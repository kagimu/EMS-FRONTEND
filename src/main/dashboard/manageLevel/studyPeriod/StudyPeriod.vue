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
const studyPeriodRef = ref( null)
const deletionLoader = ref( undefined)
const editMode = ref( false)

onMounted(
    () => {
      classStore.fetchCampusLevel(campus_curriculum_number)
      academicYearStore.fetchAcademicYear(campus_curriculum_number)
    }
)


const addStudyPeriod = (item) => {
  // classNumber.value = item.number
  newStudyPeriodDialog.value = true
  editMode.value = false
  studyPeriodRef.value.clearStudyPeriod()
}


const editStudyPeriod = (styPeriod)  => {
  if(styPeriod) {
    // alert(styPeriod)
    editMode.value = true
    newStudyPeriodDialog.value = true
    studyPeriodStore.fetchStudyPeriodData(styPeriod)
  }
}

// const deleteStudyPeriod = (styPeriod, idx) => {
//   deletionLoader.value = idx

//   if(!confirm("Are you sure, you want to delete: "+styPeriod.study_period_name)){
//     return
//   }


//   let data = {
//     number:styPeriod.number
//   }
//   studyPeriodStore.deleteStudyPeriod(data)

// }


const deleteStudyPeriod = async (styPeriod, idx) => {
  deletionLoader.value = idx

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+styPeriod.study_period_name);
if (agreed) {
  let data = {
    number:styPeriod.number
  }
  studyPeriodStore.deleteStudyPeriod(data)
}


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
        await studyPeriodData()
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
        await studyPeriodData()
        // await studyPeriodStore.fetchStudyPeriod({level: campusCurriculumNumber, academic_year_number: academicYearNumber.value})
      }
    }
)

watch(
    () => studyPeriodStore.editStudyPeriodResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        await studyPeriodData()
        // await studyPeriodStore.fetchStudyPeriod({level: campusCurriculumNumber, academic_year_number: academicYearNumber.value})
      }
    }
)



</script>
<template>
  <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode ? 'Edit Study Period' : 'Add Study Period'" v-model="newStudyPeriodDialog" xl2>
      <new-study-period ref="studyPeriodRef"></new-study-period>
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
         
         
            {{ list }}
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="academicYearNumber"
              @change="filterStudyPeriod(academicYearNumber)"
          >
            <option disabled value="">--Select --</option>
            <!-- <option value="">All</option> -->
            <template v-for="(list, index) in academicYearList" :key="index"  >
            <option v-for="(listD, index) in list.academicYear" :key="index" :value="listD.number">
              {{listD.code+". "+listD.academic_year_name}}
            </option>
          </template>
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
        <th>Academic Year</th>
        <th>Study Period NameGroup</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>

      <tr v-for="(level, index) in studyPeriodList" :key="index">
        <td> {{level.code}}</td>
        <td class="capitalize"> Level </td>
        <td>
          <table class="table table-hover caption-top text-sm">
            <tbody>
            <tr>
              <td class="w-[40%] capitalize">
                <div>
                <div>{{level.academic_year_name}}</div>
                 
                </div>
                <div class="ml-5 text-sm">
                  <small>
                   <b>From:</b>  <small>{{level.study_period_start_date}}</small><br />
                   <b>To:</b>  <small>{{level.study_period_end_date}}</small>
                  </small>
                </div>
              </td>
            </tr>
            </tbody>
          </table>

        </td>
        <td>{{level.study_period_name}}</td>
         <td>
           <div>
                        <i v-if="can('update_term','manage')"
                            data-bs-toggle="modal"
                            data-bs-target="#newStudyPeriod"
                            class="bi-pencil mr-2 cursor-pointer"
                            @click="editStudyPeriod(level.number)"></i>
                        <i class="bi-trash cursor-pointer"  @click="deleteStudyPeriod(level,index)"></i>
                        <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                          <span class="visually-hidden">Loading...</span>
                        </div>
           </div>
        </td>
      </tr>



      </tbody>
    </table>





  </div>
</template>



<style scoped>

</style>