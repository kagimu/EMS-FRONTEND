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


const school_number = ref("")
const campus_number = ref("")
const academic_year_number = ref("")
const assessmentListData = ref([])


// const   description  = ref("")
// const   student_number = ref("")
// const   narrative_schedule_number = ref("")
const   assessment_area_number = ref("")
const   study_period_number = ref("")
const   campus_class_number = ref("")


/*const formData = ref({
  description:"",
  student_number:"",
  narrative_schedule_number:null,
  assessment_area_number:"",
  study_period_number:"",
  campus_class_number:"",
})*/

const props = defineProps({
  student_number:String,
})


onMounted(
    async () => {
      fetchNarrativeInfo()
    }
)


const fetchNarrativeInfo = () => {
  let data = {
    student_number:props.student_number,
    assessment_area_number:assessment_area_number.value,
    study_period_number:study_period_number.value,
    campus_class_number:campus_class_number.value,
    academic_year_number:academic_year_number.value
  }

  userStore.fetchNarrativeReport(data)
}

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
    class_number:classNumber,
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


              <div class="grid grid-cols-4 gap-2">

                <div class="mb-1">
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


                <div class="mb-1">
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

                <div class="mb-1">
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

                <div class="mb-1">
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

                <div class="mb-1">

                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="academic_year_number"
                      @change="fetchNarrativeInfo"
                  >
                    <option disabled value="">--Select AcademicYear--</option>
                    <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                  </select>
                </div>


                <div class="mb-1">
                  <select
                      class="form-select form-select-sm shadow-none" required
                      v-model="campus_class_number"
                      @change="studyPeriodData(campus_class_number)"

                  >
                    <option disabled value="">--Select Class--</option>
                    <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
                  </select>
                </div>


                <div class="mb-1">
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="study_period_number"
                      @change="fetchNarrativeInfo"
                  >
                    <option disabled value="">--Select Study period--</option>
                    <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
                  </select>
                </div>

                <div class="mb-1">
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="assessment_area_number"
                      @change="fetchNarrativeInfo"
                  >
                    <option disabled value="">--Select Assessment Area -- </option>
                    <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
                    </option>
                  </select>
                </div>


              </div>



          <table class="table table-hover caption-top mt-3 table-sm" style="font-size: 14px;">
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Teacher</th>
              <th scope="col">Academic Year</th>
              <th scope="col">Study Period</th>
              <th scope="col">Class</th>
              <th scope="col">Assessment Area</th>
              <th scope="col">Narration</th>
              <!--      <th scope="col">Action</th>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="(info, index) in narrativeList" :key="index">
              <td> {{(index + 1)}}</td>
              <td> {{info?.date ?? ""}}</td>
              <td> {{info?.teacher ?? ""}}</td>
              <td> {{info?.academic_year ?? ""}}</td>
              <td> {{info?.study_period ?? ""}}</td>
              <td> {{info?.class ?? ""}}</td>
              <td> {{info?.assessment_area ?? ""}}</td>
              <td> {{info?.narration ?? ""}}</td>
              <!--      <td>
                      <div>
                        <i
                            v-if="can('edit_level','general')"
                            style="font-size: 13px;"
                            data-bs-toggle="modal" data-bs-target="#levelModal"
                            class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                        <i
                            v-if="can('delete_level','general')"
                            style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                        <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </td>-->
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
  /* font-size: 10px !important; */
}
select{
  background-color: transparent;
  border-radius: 2px;
  font-size: 10px !important;
}

</style>
