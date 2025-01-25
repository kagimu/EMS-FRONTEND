<script setup>
  
import {onMounted, reactive, ref, watch,defineEmits} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {usePromotionStore} from "./store/promotion.js"
import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";

const levelStore = useLevelStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const academicYearList = ref([])
const studyPeriodList  = ref([])
const streamList = ref([])
const curriculumList = ref([])
const levelList = ref([])
const gradeDataList = ref([])
const gradeAssessmentAreaList = ref([])
const gradingInfo = ref([
  {
    minimum_grade:"",
    maximum_aggregate:"",
    minimum_score:"",
  }
])

const assessmentStoreInfo = ref([
  {
    assessment_area_number:"",
    minimum_grade:"",
    maximum_score:"",
  }
])


const emit = defineEmits();
const classError = ref(null)
const loader = ref(false)
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const promotionStore = usePromotionStore()
const assessmentStore = useAssessmentStore()
const isGrade = ref(null)
const subjectStore = useSubjectStore()
const promoSettingList = ref([])
const assessmentScaleData = ref([])
const subjectList = ref([])
const assessmentListData = ref([])
const gradeData = ref([])


const formData = reactive({
   study_period_number: "",
   class_number: "",
   campus_class_number: "",
   campus_number: "",
   stream_number:"",
   school_number:"",
   academic_year_number:"",
   curriculumNumber:"",
   level:""
   })

const form = reactive({
  type:null,
  score:null,
  promotion_setting_number:"",
  assessment_grade_number:null
})

const rows = reactive([{ assessment_area_number: "", score: "", aggregate_number: "" }])

const addRow = () => {
  rows.push({  assessment_area_number: "", score: "", aggregate_number: ""});
}

const removeRow = (index) => {
  rows.splice(index, 1);
}


const theType = () => {
  isGrade.value = form.type
}

const addPromotionValue = () =>{
  loader.value = true
  form.assessment_area = rows
  // alert(JSON.stringify(form))
  promotionStore.newPromotionSettingValue(form)
} 




onMounted(() => {
        assessmentStore.fetchAssessmentGrades()
        promotionStore.fetchPromotionSetting()
        subjectStore.fetchAllSubjects()
        schoolStore.fetchSchools()
    }
) 


const  fetchAssessmentAreaList = (classN) => {
  const result = curriculumList.value.find(item => item.number === formData.curriculumNumber);
  
let data = {
  curriculum_number: result.curriculum_number,
  class_number:formData.class_number,
}
assessmentStore.fetchAssessmentArea(data)
}




watch(
  () => assessmentStore.assessmentScaleResponse,
  async (data) => {
    if(data){
      loader.value = false
      // notificationStore.successToast("Success", data.message)
      assessmentScaleData.value = data.data
    }
  },
  {deep:true}
)



watch(
  () => promotionStore.newPromotionSettingValueResponse,
  async (data) => {
      if (data) {
        loader.value = false
        notificationStore.successToast("Success", data.message)
        await promotionStore.fetchPromotionSettingValue()
        form.type=null,
        form.score=null,
        form.promotion_setting_number=null,
        form.assessment_grade_number=null
      }
  },
  {deep: true}
)

watch(
  () => promotionStore.errorMessage,
  async (data) => {
        if (data) {
            notificationStore.errorToast("Error", data.message)
        }
  },
  {deep: true}

)

watch(
  () => promotionStore.PromotionSettingResponse,
  async (data) => {
      if (data) {
        promoSettingList.value = data.data
      }
  },
  {deep: true}
)



const fetchCampuses = (school_number) => {
     campusStore.fetchCampuses(school_number)
     let data = {
    school_number:school_number
  }
  assessmentStore.fetchGrades(data)
     
   }
   
   
   const fetchClasses = (campus_level_number) => {
     levelStore.fetchCampusCurriculum(campus_level_number)
     
   }
   
   watch(
     () => campusStore.schoolClassesResponse,
     async (data) => {
       if(data){
         classList.value = data.data
       }
     }
   )
   
   const fetchStreamsAndStudyPeriod = (classNumber) =>{
   let sData = {
      campus_number:form.campus_number,
      class_number:classNumber,
      campus_curriculum_number:form.curriculumNumber
     }
     classStore.fetchClassStreams(sData)

     studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:classNumber,
        school_number:form.school_number
      } )

     
   }


   watch (
    () => assessmentStore.gradeResponse,
    async (data) => {
      if(data){
        gradeData.value = data
      }
    }
)


   
   watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)


   watch(
     () => academicYearStore.academicYearByLevelResponse,
     async (data) => {
       if(data){
         academicYearList.value = data.data
       }
     }
   )
   
   const fetchCampusLevel = (curriculumNumber) => {
    classStore.fetchCampusLevel(curriculumNumber)
   }
   
   
   
   const fetchLevelClasses = (levelNumber) => {
    let data = {
     school_number:formData.school_number,
     campus_level_number:levelNumber
   }
   campusStore.fetchClassesBySchool(data)
   academicYearStore.fetchAcademicYearByLevel(levelNumber)
   }
   
   watch(
     () => classStore.campusLevelResponse,
     async (data) => {
       if(data){
         levelList.value = data.data
       }
     },
     {deep:true}
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
     () => classStore.classStreams,
     async (data) => {
         if (data) {
           streamList.value = data.data
         }
     }
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
     () => campusStore.campusListResponse,
     async (data) => {
         if (data) {
             campusList.value = data.data
         }
     },
     {deep: true}
   )
   
   
   watch(
     () => campusStore.errorMessage,
     async (data) => {
           if (data) {
               notificationStore.errorToast("Error", data.message)
           }
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

const fetchSettingsDetails = async (promotion_setting_number) => {
  await promotionStore.fetchPromotionSettingDetails(promotion_setting_number)
}


watch(
    () => promotionStore.promotionSettingDetailsResponse,
    async (data) => {
      if (data && data.data) {
        let draft = data.data
        alert(JSON.stringify(draft))
      }
    }
)

const addAggregateScale = () => {
  gradingInfo.value.push({
    minimum_grade:"",
    maximum_aggregate:"",
    minimum_score:"",
  })
}

const addAssessmentArea = () => {
  assessmentStoreInfo.value.push({
    assessment_area_number:"",
    minimum_grade:"",
    maximum_score:"",
  })
}

</script>


<template>
    <div>

      <form @submit.prevent="addPromotionValue">
  
        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
          {{ classError }}
        </div>

        <div class="mb-2">
            <label class="text-sm"><small>Promotion Setting</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.promotion_setting_number"
                    required
                    @change="fetchSettingsDetails(form.promotion_setting_number)"
            >
                <option disabled value="">
                  --Select Promotion Setting--
                </option>
                <option v-for="(list, index) in promoSettingList" :key="index" :value="list.promotion_settings_number">
                  {{ list.name }}
                </option>
            </select>
        </div>


        <p class="mt-5">Grade Settings</p>

        <table   class="table  table-sm table-striped text-sm">
          <tr>
            <td>#</td>
            <td>Minimum Grade</td>
            <td>Maximum Aggregate</td>
            <td>Minimum Score</td>
            <td>Action</td>
          </tr>
          <tbody>

          <tr v-for="(list,idx) in gradingInfo" :key="idx">
            <td>{{(idx + 1)}}</td>
            <td>
              <select
                  style="outline: none 0 !important; box-shadow: none;"
                  type="text"
                  v-model="list.minimum_grade"
                  required
                  class="form-control form-select-sm">
                <option disabled value="">--Select Grade--</option>
                <option v-for="(lst, index) in gradeDataList" :key="index" :value="lst.number">{{ lst.name }}</option>
              </select>

            </td>
            <td>
              <input
                  type="email"
                  v-model.trim="list.maximum_aggregate"
                  required
                  class="form-control shadow-none">
            </td>
            <td>
              <input
                  type="email"
                  v-model.trim="list.minimum_score"
                  required
                  class="form-control shadow-none">
            </td>
            <td>

                  <div class="mt-2">
                      <i
                          class="cursor-pointer mx-1 text-xs fa-solid bi-trash"
                          @click="gradingInfo.splice(idx, 1)"
                      ></i>
                  </div>

            </td>
          </tr>


          </tbody>
        </table>

        <button
            @click="addAggregateScale"
            type="button"
            class="btn btn-sm btn-success btn-sm text-sm">
          <i class="bi bi-plus"></i>
          Add grade settings
        </button>


        <p class="mt-5">Assessment Area Settings</p>

        <table   class="table table-sm table-striped text-sm">
          <tr>
            <td>#</td>
            <td>Subject / Assessment Area</td>
            <td>Minimum Grade</td>
            <td>Minimum Score</td>
            <td>Action</td>
          </tr>
          <tbody>

          <tr v-for="(list,idx) in assessmentStoreInfo" :key="idx">
            <td>{{(idx + 1)}}</td>
            <td>
              <select
                  style="outline: none 0 !important; box-shadow: none;"
                  type="text"
                  v-model="list.assessment_area_number"
                  required
                  class="form-control form-select-sm">
                <option disabled value="">--Select Assessment Area--</option>
                <option v-for="(lst, index) in gradeAssessmentAreaList" :key="index" :value="lst.number">{{ lst.name }}</option>
              </select>

            </td>
            <td>
              <select
                  style="outline: none 0 !important; box-shadow: none;"
                  type="text"
                  v-model="list.minimum_grade"
                  required
                  class="form-control form-select-sm">
                <option disabled value="">--Select Grade--</option>
                <option v-for="(lst, index) in gradeDataList" :key="index" :value="lst.number">{{ lst.name }}</option>
              </select>

            </td>
            <td>
              <input
                  type="email"
                  v-model.trim="list.maximum_score"
                  required
                  class="form-control shadow-none">
            </td>
            <td>

              <div class="mt-2">
                <i
                    class="cursor-pointer mx-1 text-xs fa-solid bi-trash"
                    @click="assessmentStoreInfo.splice(idx, 1)"
                ></i>
              </div>

            </td>
          </tr>


          </tbody>
        </table>

        <button
            @click="addAssessmentArea"
            type="button"
            class="btn btn-sm btn-success btn-sm text-sm">
          <i class="bi bi-plus"></i>
            Add Assessment Area settings
        </button>


<!--        <div class="mb-2">
            <label class="text-sm"><small>Type</small>  </label><br>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.type"
                    @change="theType()"
                  
            >
                <option disabled value="">Select Type</option>
                <option value="score">Score
                </option>
                <option value="aggregate">Aggregate
                </option>
                <option value="grade">Grade
                </option>
                <option value="assessment">Assessment Area
                </option>
            </select>
         
        </div>

        <div class="mb-2" v-if="isGrade == 'score' || isGrade=='aggregate'">
          <label class="text-sm"><small>Value</small></label>
          <input
              style="outline: none 0 !important; box-shadow: none;"
              type="number" v-model="form.score"
              required
              class="form-control form-select-sm">
        </div>

        
        <div class="mb-2" v-if="isGrade == 'grade'">
            <label class="text-sm"><small>Assessment Grade</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.assessment_grade_number" required
            >
                <option disabled value="">Assessment Grade</option>
                <option v-for="(list, index) in assessmentScaleData" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>


        <div class="mb-2 mt-4" v-if="isGrade == 'assessment'">
          
          <p class="text-sm alert alert-success" ><small>ASSESSMENT AREA &#45;&#45;&#45;&#45;&#45;&#45;</small>  </p>
          <div class="row">
          <div class="col-3">
          <div class="mb-2">
          <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="formData.school_number"
          @change="fetchCampuses(formData.school_number)"
          >
          <option disabled  value="">-filter by School-</option>
          <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
          </option>
          </select>
          </div>
          </div>
          <div class="col-3">
          <div class="mb-2">
          &lt;!&ndash; <label class="text-sm"><small>Campus</small>  </label> &ndash;&gt;
          <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="formData.campus_number" required
          @change="fetchClasses(formData.campus_number)"
          >
          <option disabled value="">-filter by Campus-</option>
          <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
          </option>
          </select>
          </div>
          </div>
          <div class="col-2">
          <div class="mb-2">
          <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="formData.curriculumNumber"  
          @change="fetchCampusLevel(formData.curriculumNumber)"                                         
          >
          <option disabled value="" >&#45;&#45;Select Curriculum&#45;&#45;</option>
          <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
          </select>
          </div>
          </div>
          <div class="col-2" >
          <div class="mb-2">
          <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="formData.level"
          @change="fetchLevelClasses(formData.level)"
          >
          <option disabled value="">-Filter by level-</option>
          <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
          </select>
          </div>
          </div>

          <div class="col-2">
          <div class="mb-2">
          &lt;!&ndash; {{ classList }} &ndash;&gt;
          <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="formData.class_number"
          @change="fetchAssessmentAreaList(formData.class_number)"
          >
          <option disabled value="">-filter by class-</option>
          <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
          {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
          </option>
          </select>
          </div>
          </div>


          </div>

          <div class="row">
          <div class="col-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th class="text-xs">Assessment Area</th>
                <th class="text-xs">Score</th>
                <th class="text-xs">Aggregate</th>
                <th class="text-xs">#</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="index">
                <td>
                  <select class="form-select form-select-sm"
                  v-model="row.assessment_area_number" required
                    >
                    <option disabled value="">Select Assessment Area</option>
                    <option v-for="(assess, index) in assessmentListData" :key="index" :value="assess.number">{{ assess.name }}
                    </option>
                  </select>
                </td>
                <td><input type="number" class="form-control form-select-sm" v-model="row.score"></td>
                <td>
            &lt;!&ndash; {{gradeData}} &ndash;&gt;
                  <select class="form-select form-select-sm" v-model="row.aggregate_number">
                    <option value="">-select -</option>
                    <option v-for="(list,index) in gradeData" :key="index" :value="list.number">{{ list.name }} ({{ list.short_name }})</option>
                  </select>
                </td>
                <td>
                  <i style="cursor: pointer;color: red;"  @click="removeRow(index)" class="bi bi-x-circle-fill"></i>
                </td>
              </tr>
            </tbody>
          </table>

          <button type="button" class="btn btn-sm btn-primary mr-2" @click="addRow(index)" ><i class="bi bi-plus"></i></button> 

          </div>

          </div>
        </div>
       -->
  
        <div class="flex justify-content-end mt-2" style="width: 100%;">
          <button
              type="submit"
              class="btn btn-primary border-0">
              {{levelNumber ? "Edit" : "Save"}}
            <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </span>
          </button>
        </div>
  
      </form>
  
  
    </div>
  </template>
  

  
  <style scoped>
  .noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
  </style>