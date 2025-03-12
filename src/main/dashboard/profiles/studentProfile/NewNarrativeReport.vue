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
import VueDatePicker from "@vuepic/vue-datepicker";


const assessmentStore= useAssessmentStore()
const serviceStore= useServiceStore()
let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const campus_level_number = ref("")

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


const school_number = ref("")
const campus_number = ref("")
const academic_year_number = ref("")
const assessmentListData = ref([])



const formData = ref({
description:"",
student_number:"",
narrative_schedule_number:null,
assessment_area_number:"",
study_period_number:"",
campus_class_number:"",
reference_date:"",
reference_time:""
})

const props = defineProps({
  student_number:String,
})


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


const createNarrativeReportInfo = () => {
  buttonLoader.value=true




  let data  = formData.value
    data.student_number = props.student_number
    saveNarrativeReport(data)

}


const  saveNarrativeReport = async (data) => {
  await api.post("main/report-settings/narrative", data)
      .then((response) => {
        if(response){
          buttonLoader.value = false;
          emit("next")
        }

      })
      .catch((error) => {
        if(error && error.response) {
          buttonLoader.value = false;
        }
      });
}




/*
const getModeOfStudyInfo = (schoolN) =>{
  let data = {
    school_number:schoolN,
  }
  modeStudyStore.fetchModeOfStudy(data)
}

*/



const updateAmount = (index) => {
  const Service = servicesData.value[index];
  Service.amount = Service.quantity * Service.cost;
}

function addService() {
  servicesData.value.push({number:"", name: "", quantity: 1, cost: 0, amount: 0 });
}

function removeService(index) {
  servicesData.value.splice(index, 1);
}

const  calculateTotal = () => {
  return servicesData.value.reduce((total, Service) => total + Service.amount, 0);
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
        // ServiceOptions.value = data.map(option => ({ name: option.item.name, cost: option.item.cost,item_number:option.item.number }));
      }
    },
    { deep: true }
)


watch (
    () => billStore.errorMessage,
    async (data) => {
      if (data) {
        errorMessage.value = data.message
        //notificationStore.errorToast("Error",data.message)
      }
    }
)


const studyPeriodData = (campus_class_number) => {
   let classNumber = campusClassList.value ? campusClassList.value.find(item => item.number === campus_class_number)?.class_number : null
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
    class_number:classNumber, //campus_class_number
  }

  assessmentStore.fetchAssessmentArea(info)

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
  // classStore.fetchClassByLevel(campus_level_number)
  academicYearStore.fetchAcademicYearByLevel(campuslevelnumber)
  classStore.fetchClassLevel({campusCurriculumNumber: curriculumNumber.value, campusLevelNumber: campuslevelnumber})
/*  let data = {
    school_number:school_number.value,
    campus_level_number:campuslevelnumber
  }
  campusStore.fetchClassesBySchool(data)*/

}


watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        // alert(JSON.stringify(data.data))
        campusClassList.value = data?.data[0]?.classes
      }
    }
)

/*watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        // alert(JSON.stringify(data.data))
        campusClassList.value = data.data
      }
    }
)*/



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




</script>
<template>

  <div>
    <div class="row">
      <div class="card-body" style="padding: 0;">
        <div class="container mt-4">
          <form @submit.prevent="createNarrativeReportInfo">
            <div class="">
              <div class="">
                <div class="mb-2">
                  <label class="text-xs"><small>School</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="school_number"
                      @change="fetchCampuses(school_number)"
                  >
                    <option disabled value="">--Select School--</option>
                    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                  </select>
                </div>


                <div class="mb-2">
                  <label class="text-xs"><small>Campus</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="campus_number"
                      required
                      @change="fetchCurriculum(campus_number)">
                    <option disabled value="">--Select campus--</option>
                    <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="text-xs"><small>Curriculum</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="curriculumNumber"
                      @change="fetchClassLevels(curriculumNumber)"
                  >
                    <option disabled value="" >--Select Curriculum--</option>
                    <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="text-xs"><small>Level</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="campus_level_number"
                      @change="fetchClasses(campus_level_number)"
                  >
                    <option disabled value="">--Select Level--</option>
                    <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="text-xs"><small>AcademicYear</small></label>

                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="academic_year_number"
                  >
                    <option disabled value="">--Select AcademicYear--</option>
                    <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                  </select>
                </div>


                <div class="mb-2">
                  <label class="text-xs"><small>Class</small></label>
                  <select
                      class="form-select form-select-sm shadow-none" required
                      v-model="formData.campus_class_number"
                      @change="studyPeriodData(formData.campus_class_number)">
                    <option disabled value="">--Select Class--</option>
                    <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
                  </select>
                </div>


                <div class="mb-2">
                  <label class="text-xs"><small>Study Period</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="formData.study_period_number"
                  >
                    <option disabled value="">--Select Study period--</option>
                    <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="text-sm"><small>Assessment Area</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="formData.assessment_area_number"
                  >
                    <option disabled value="">--Select Assessment Area -- </option>
                    <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
                    </option>
                  </select>
                </div>


<!--                <div class="mb-2">
                  <label class="text-sm"><small>Narrative Schedule</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="formData.narrative_schedule_number	"
                  >
                    <option disabled :value="null">&#45;&#45;Select Narrative Schedule&#45;&#45;</option>
                    <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
                    </option>
                  </select>
                </div>-->

                
                <div class="mb-2">
                  <label class="text-sm"><small>Reference Date</small></label>
                  <!-- <VueDatePicker
                      placeholder="End date: dd/mm/yyy"
                      text-input
                      auto-apply
                      :teleport="true"
                      style="font-size: 7px;"
                      v-model="formData.reference_date"
                      :preview-format="format"
                      @update:modelValue="fetchNarrativeInfo()"
                  ></VueDatePicker> -->
                  <input type="date" class="form-control" v-model="formData.reference_date">

                </div>

                <div class="mb-2">
                  <label class="text-xs"><small>Time</small></label>
                  <input type="time" class="form-control" v-model="formData.reference_time">
                </div>

                <div class="mb-2">
                  <label class="text-xs"><small>Description</small></label>
                  <textarea v-model="formData.description" class="form-control shadow-none" style="height: 100px"></textarea>
                </div>


              </div>


            </div>





              <div class="flex justify-end ">
                <button type="submit" class="btn btn-sm btn-primary mb-2 mt-1 mr-3">
                  <small>Submit</small>
                  <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
              </div>


          </form>
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
  /* font-size: 10px !important; */
}
select{
  background-color: transparent;
  border-radius: 2px;
  font-size: 10px !important;
}

</style>
