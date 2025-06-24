<script setup>
import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useStudyModeStore} from "@/main/settings/mode-of-study/store/studyMode.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useBillStore} from "@/main/settings/bills/store/bills.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import api from "@/config/api.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import {useUserStore} from "@/main/dashboard/profiles/store/users.js";
import VueDatePicker from "@vuepic/vue-datepicker";
import NewNarrativeReport from "@/main/dashboard/profiles/studentProfile/NewNarrativeReport.vue";
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { useNarrativeStore } from "@/main/dashboard/narrative/narrativeComponents/store/narrativeStore.js";
import NarrativeReportTemplate from "@/main/dashboard/narrative/narrativeComponents/NarrativeReportTemplate.vue";



const narrativeStore = useNarrativeStore()
const assessmentStore= useAssessmentStore()
const serviceStore= useServiceStore()
let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const userStore = useUserStore()
const buttonLoader = ref(false)
const campus_level_number = ref("")
const narrativeList = ref([])

const academicYearList = ref([])
const studyPeriodList  = ref([])

const levelStore = useLevelStore()
const classStore = useClassesStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const modeStudyStore = useStudyModeStore()
const billStore = useBillStore()
const campusList = ref([])
const schoolList = ref([])
const campusLevelList = ref([])
const curriculumList = ref([])
const curriculumNumber = ref("")
const modeOfSchoolData  = ref([])
const academicYearStore = useAcademicYearStore()
const campusClassList = ref(null)
const studyPeriodStore = useStudyPeriodStore()
const billableData = ref([])
const servicesData = ref([]);
const ServiceOptions = ref([])
const unfilteredServicesData = ref([])
const bills_number = ref(null)
const reportDialog = ref(false)
const narrativeInfo = ref({})


const school_number = ref("")
const campus_number = ref("")
const academic_year_number = ref("")
const start_date = ref("")
const end_date = ref("")
const assessmentListData = ref([])
const narrativeSchedulesList = ref("")

const deletionLoader = ref( undefined)
const confirmationRef = ref(null);

const   assessment_area_number = ref("")
const narrative_schedule_number = ref("")
const narrativeModel = ref(false)




const props = defineProps({
  student_number:String,
  studentProfileData:{},
  narrativeWithSchedule:String
})


onMounted(
    async () => {
      fetchDraft()
      fetchNarrativeInfo()
    }
)


watch(
    () => props.studentProfileData,
    async (data) => {
      if (data) {
        fetchDraft()
        fetchNarrativeInfo()
      }
    }
)

const fetchDraft = () => {
  let draft = props.studentProfileData

  if(draft && draft?.current_enrollment && draft?.current_enrollment?.curriculum_number){
    let info = {
      curriculum_number: draft?.current_enrollment?.curriculum_number	, //curriculum ? curriculum?.curriculum_number : null,
      class_number: draft?.current_enrollment.class_number //classNumber, //campus_class_number
    }

    assessmentStore.fetchAssessmentArea(info)
  }

}


const fetchNarrativeInfo = () => {
  let draft = props.studentProfileData
  let data = {
    student_number:props.student_number,
    assessment_area_number:assessment_area_number.value,
    study_period_number: draft?.current_enrollment?.study_period_number,
    campus_class_number:draft?.current_enrollment?.campus_class_number,
    academic_year_number:draft?.current_enrollment?.academic_year_number,
    narrative_schedule_number:narrative_schedule_number?.value,
    start_date:start_date.value,
    end_date:end_date.value
  }

  userStore.fetchNarrativeReport(data)
  doFetchNarrativeSchedule()
}



const reloadDraft = () => {
  fetchNarrativeInfo()
}

defineExpose({
  reloadDraft
});


watch(
    () => userStore.narrativeReportResponse,
    async (data) => {
      if(data && data.data){
        narrativeList.value = data.data
      }
    }
)

watch(
    () => billStore.billableDetailsResponse,
    async (data) => {
      if (data) {
        let draft = data.data
        billableData.value = draft
        if(draft){
          bills_number.value=draft.billable_number
          campus_number.value = draft.campus_number
          if(draft?.campus_number){
            fetchCurriculum(draft?.campus_number)
            curriculumNumber.value = draft.campus_curriculum_number
          }
          if(draft?.campus_curriculum_number){
            fetchClassLevels(draft?.campus_curriculum_number)
            campus_level_number.value = draft?.campus_level_number
          }
          if(draft?.campus_level_number){
            fetchClasses(draft?.campus_level_number)
            academic_year_number.value = draft?.academic_year_number
            formData.campus_class_number = draft?.class_number
          }
          if(formData.class_number){
            studyPeriodData(draft?.class_number)
            formData.study_period_number = draft.study_period_number
          }
          formData.description = draft.description,
              formData.mode_of_study_number=draft.mode_of_study_number,

              formData.bill_type = draft.bill_type
          academic_year_number.value = draft.academic_year_number

          if(draft?.billable_items?.length > 0) {
            let items = draft?.billable_items
            let arr = []
            items.forEach(lst => {
              let obj = {
                number:lst?.item_number,
                name: lst?.name,
                quantity: lst?.quantity,
                cost: lst?.unit_cost,
                amount: lst?.total_cost
              }
              arr.push(obj)
            })
            servicesData.value = arr
          }
        }

      }
    },
    { deep: true }
)



onMounted(
    async () => {
      await schoolStore.fetchSchools()
      getSchoolInfo()
    } )


const getSchoolInfo = () =>{
  if(props.schoolN){
    school_number.value = props?.schoolN
    fetchCampuses(props?.schoolN)
  }
}



watch(
    () => serviceStore.servicesListResponse,
    async (data) => {
      if (data) {
        ServiceOptions.value =  data.map(option => ({
          text: option.item.name,
          number: option.item.number
        }));
        unfilteredServicesData.value = data
      }
    },
    { deep: true }
)


watch (
    () => billStore.errorMessage,
    async (data) => {
      if (data) {
        errorMessage.value = data.message
      }
    }
)


const studyPeriodData = (campus_class_number) => {
  /*let classNumber = campusClassList.value ? campusClassList.value.find(item => item.number === campus_class_number)?.class_number : null
  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:curriculumNumber.value,
        academic_year_number:academic_year_number.value,
        class_number:classNumber, //campus_class_number,
        school_number:school_number.value
      }
  )



  const curriculum = curriculumList.value.find(item => item?.number === curriculumNumber.value);
  let info = {
    curriculum_number:curriculum ? curriculum?.curriculum_number : null,
    class_number:classNumber,
  }

  assessmentStore.fetchAssessmentArea(info)
*/
}



watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)


const fetchCampuses = (school) => {
  campusStore.fetchCampuses(school)
}

const fetchCurriculum = (campus_number) => {
  levelStore.fetchCampusCurriculum(campus_number)
}

const fetchClassLevels = (campus_number) => {
  classStore.fetchCampusLevel(campus_number)
}

const fetchClasses = (campuslevelnumber) => {
  academicYearStore.fetchAcademicYearByLevel(campuslevelnumber)
  classStore.fetchClassLevel({campusCurriculumNumber: curriculumNumber.value, campusLevelNumber: campuslevelnumber})
}


watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        campusClassList.value = data?.data[0]?.classes
      }
    }
)



watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)

watch (
    () => billStore.newBillableResponse,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
        buttonLoader.value=false
      }
    },
    { deep: true }
)


watch (
    () => billStore.updateBillableResponse,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
        buttonLoader.value=false
      }
    },
    { deep: true }
)

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)



watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    },
    {deep: true}
)


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    },
    {deep: true}
)


watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)



watch(
    () => modeStudyStore.modeOfStudyInfoResponse,
    async (data) => {
      modeOfSchoolData.value = data.data
    },
    {deep: true}
)




watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        assessmentListData.value = data.data
      }
    }
)


const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `Selected date is ${day}/${month}/${year}`;
}

const editNarrative = (date) => {
  if(date){
    narrativeInfo.value = date;
    reportDialog.value = true
  }
}

const closeDialog = () => {
  reportDialog.value = false
  reloadDraft()
}

const deleteNarrative = async (data, index) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+data.name);
  if (agreed) {
    deletionLoader.value = index
    await deleteNarrativeReport(data.number)
  }

}


const  deleteNarrativeReport = async (number) => {
  await api.delete("main/report-settings/narrative/"+number)
      .then((response) => {
        if(response){
          deletionLoader.value = undefined
          fetchDraft()
        }

      })
      .catch((error) => {
        if(error && error.response) {
          deletionLoader.value = undefined
        }
      });
}

const doFetchNarrativeSchedule = () => {
  let data = {
    class_number:props.studentProfileData?.current_enrollment?.class_number,
    // academic_year_number:academic_year_number.value,
    study_period_number:props.studentProfileData?.current_enrollment?.study_period_number,
    assessment_area_number:assessment_area_number.value,
    campus_number:props.studentProfileData?.current_enrollment?.campus_number,
    curriculum_number:props.studentProfileData?.current_enrollment?.curriculum_number,
  }

   narrativeStore.fetchNarrativeSchedules(data)
}

watch(
    () => narrativeStore.narrativeResponse,
    async (data) => {
      if(data){
        narrativeSchedulesList.value = data.data
      }
    }
)


const filterNarrativeReportBySchedule = (scheduleNumber) => {
  let draft = props.studentProfileData
  let data = {
    student_number:props.student_number,
    assessment_area_number:assessment_area_number.value,
    study_period_number: draft?.current_enrollment?.study_period_number,
    campus_class_number:draft?.current_enrollment?.campus_class_number,
    academic_year_number:draft?.current_enrollment?.academic_year_number,
    narrative_schedule_number:scheduleNumber,
    start_date:start_date.value,
    end_date:end_date.value
  }
  userStore.fetchNarrativeReport(data)

}

const previewNarrativeReport = () => {
  narrativeModel.value = true
  printPreviewNarrative()
}


const printPreviewNarrative = () => {
  let draft = props.studentProfileData
  let data = {
    student_number:props.student_number,
    assessment_area_number:assessment_area_number.value,
    study_period_number: draft?.current_enrollment?.study_period_number,
    campus_class_number:draft?.current_enrollment?.campus_class_number,
  }
  narrativeStore.printPreviewNarrativeReport(data)

}


</script>
<template>

  <div>

    <ConfirmationModal removeBorder="remove" ref="confirmationRef"></ConfirmationModal>

    <AppModal title="Edit Narrative Report" v-model="reportDialog" lg>
      <new-narrative-report
          v-on:next="closeDialog"
          :narrativeInfo="narrativeInfo"
          :studentProfileData="studentProfileData"
          :student_number="student_number"></new-narrative-report>
    </AppModal>

    <AppModal title="PreviewReport" v-model="narrativeModel" xl6>
     <NarrativeReportTemplate></NarrativeReportTemplate>
    </AppModal>

    <div class="row">
      <div class="card-body" style="padding: 0;">
        <div class="container mt-4">


              <div class="grid grid-cols-4 gap-2">


                <div class="mb-3">
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="assessment_area_number"
                      @change="fetchNarrativeInfo"
                  >
                    <option disabled value="">--Filter by Assessment Area -- </option>
                    <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
                    </option>
                  </select>
                </div>


                <div class="mb-2" v-if="narrativeWithSchedule">
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="narrative_schedule_number"
                      @change="filterNarrativeReportBySchedule(narrative_schedule_number)"
                  >
                    <option disabled :value="null">&#45;&#45;Filter By Narrative Schedule&#45;&#45;</option>
                    <option v-for="(narrativeData, index) in narrativeSchedulesList " :key="index" :value="narrativeData.number">
                      {{ narrativeData.description }} - {{  narrativeData.class }} - {{ narrativeData.scheduled_on }}
                    </option>
                  </select>
                </div>

              </div>

          <div class="grid grid-cols-3 gap-2">

                <div>
                  <VueDatePicker
                      placeholder="Start date: dd/mm/yyy"
                      text-input
                      auto-apply
                      :teleport="true"
                      style="font-size: 7px;"
                      v-model="start_date"
                      :preview-format="format"
                      @update:modelValue="fetchNarrativeInfo()"
                  ></VueDatePicker>
                </div>

                <div>
                  <VueDatePicker
                      placeholder="End date: dd/mm/yyy"
                      text-input
                      auto-apply
                      :teleport="true"
                      style="font-size: 7px;"
                      v-model="end_date"
                      :preview-format="format"
                      @update:modelValue="fetchNarrativeInfo()"
                  ></VueDatePicker>
                </div>

                <div>
                
                <button style="float: right;"
                  type="button"  class="btn btn-sm buttonStyle btn-success mr-2"  @click="previewNarrativeReport()">
                  <i style="font-size: 15px;"  class="bi-printer mr-2"></i>
                  Print</button>
                </div>

              </div>



          <table class="table table-hover caption-top mt-3 table-sm text-sm" style="font-size: 14px;">
            <thead>
            <tr>
              <td class="font-semibold">#</td>
              <td class="font-semibold">Reference Date</td>
              <td class="font-semibold">Reference Time</td>
              <td class="font-semibold">Teacher</td>
              <td class="font-semibold">Academic Year</td>
              <td class="font-semibold">Study Period</td>
              <td class="font-semibold">Class</td>
              <td class="font-semibold">Assessment Area</td>
              <td class="font-semibold">Narration</td>
              <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(info, index) in narrativeList" :key="index">
              <td> {{(index + 1)}}</td>
              <td> {{info?.reference_date	 ?? ""}}</td>
              <td> {{info?.reference_time		 ?? ""}}</td>
              <td> {{info?.teacher ?? ""}}</td>
              <td>
              {{info?.academic_year ?? ""}}
              </td>
              <td> {{info?.study_period ?? ""}}</td>
              <td> {{info?.class ?? ""}}</td>
              <td> {{info?.assessment_area ?? ""}}</td>
              <td> {{info?.narration ?? ""}}</td>
              <td>
                <div>
                  <i
                      style="font-size: 13px;"
                      data-bs-toggle="modal" data-bs-target="#levelModal"
                      class="bi-pencil mr-2 cursor-pointer" @click="editNarrative(info)"></i>
<!--                        <i
                      style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteNarrative(info, index)"></i>-->
                  <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>





        </div>
      </div>

    </div>

  </div>

</template>



<style>
.mb-8 {
  margin-bottom: 2rem;
  text-align: left;
  color: rgb(0, 0, 0);
  font-family: Roboto, sans-serif;
  font-size: 17px;
}
.mb-2 {
  text-align: left;
  color: rgb(0, 0, 0);
  font-family: Roboto, sans-serif;
  border-radius: 3px !important;
}
input{
  background-color: #f8f9fa;
  border-radius: 2px;
}
select{
  background-color: transparent;
  border-radius: 2px;
  font-size: 10px !important;
}

</style>
