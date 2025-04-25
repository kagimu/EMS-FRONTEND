<script setup>
import {onMounted, reactive, ref, watch,defineEmits} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import {usePromotionStore} from "./store/promotion.js"
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";

const emit = defineEmits();
const classError = ref(null)
const loader = ref(false)
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const promNumber = ref("")
const promotionStore = usePromotionStore()
const studyPeriodStore = useStudyPeriodStore()

const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()
const levelStore = useLevelStore()
const academicYearList = ref([])
const streamList = ref([])
const curriculumList = ref([])
const levelList = ref([])
const studyPeriodList  = ref([])

const props = defineProps({
    promotionSettingInfo: String,
    promotionDataInfo:{}
  })

onMounted(() => {
      schoolStore.fetchSchools()
      getPromotionSettingInfo()
      getPromoInfo()
  }
)

const form = reactive({
  name:null,
  status:"ACTIVE",
  type:"",
  next_class_number:'',
  previous_class_number:'',
  academic_year_number:'',
  study_period_number:''
})


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


   const getPromoInfo = () => {
  let promoData = props.promotionDataInfo
  if(promoData){
    form.name = promoData.name
    form.type = promoData.type
    formData.school_number = promoData.school_number
    if(formData.school_number){
      fetchCampuses(formData.school_number)
      formData.campus_number = promoData.campus_number
    }
    if(formData.campus_number){
      fetchCurriculum(formData.campus_number)
      formData.curriculumNumber = promoData.curriculum.curriculum_number
    }
    // if(formData.curriculumNumber){
    //   fetchCampusLevel(formData.curriculumNumber)
    // }
    // if(formData.level){
    //   fetchLevelClasses(formData.level)
    // }

   
   
    
  }

}


const addPromotionSetting = () =>{
  loader.value = true
  // alert(JSON.stringify(form))
  form.campus_number = formData.campus_number
  // form.curriculum_number = formData.curriculumNumber
  form.campus_curriculum_number = formData.curriculumNumber
  promotionStore.newPromotionSetting(form)
} 




  const getPromotionSettingInfo = () => {
    let promoData = props.promotionSettingInfo
    if(promoData){
      form.name = promoData.name
      form.type = promoData.type
      // form.next_class_number = promoData.next_class_number
      // form.previous_class_number = promoData.previous_class_number
      // form.academic_year_number = promoData.academic_year_number
      // form.study_period_number = promoData.study_period_number
      // promNumber.value = promoData.number
    }
  }


  watch(
     () => props.promotionSettingInfo,
     async (data) => {
       if(data){
        getPromotionSettingInfo()
       }
     }
   )


const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
}

const fetchCurriculum = (campus_number) => {
  levelStore.fetchCampusCurriculum(campus_number)
  campusStore.fetchClassesByCampus(campus_number)
}


//fetchacadmicYear
const fetchAcademicYear = (campusN) =>{
// alert(campusN)
academicYearStore.fetchAcademicYearByCampus(campusN)
classStore.fetchClassStreams(campusN)

}


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
  () => campusStore.campusListResponse,
  async (data) => {
      if (data) {
          campusList.value = data.data
      }
  },
  {deep: true}
)

// watch(
//   () => campusStore.campusClassesResponse,
//   async (data) => {
//       if (data) {
//           classList.value = data.data
//       }
//   },
//   {deep: true}
// )

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
  () => promotionStore.newPromotionSettingResponse,
  async (data) => {
      if (data) {
          form.name=null,
          form.status="ACTIVE",
          form.type=null,
          form.next_class_number=null,
          form.previous_class_number=null
          loader.value = false
        notificationStore.successToast("Success application submitted", data.message)
        promotionStore.fetchPromotionSetting()
      }
  },
  {deep: true}
)

watch(
  () => promotionStore.errorMessage,
  async (data) => {
        if (data) {
          form.name=null,
          form.status="ACTIVE",
          form.type=null,
          form.next_class_number=null,
          form.previous_class_number=null
          loader.value = false
            notificationStore.errorToast("Error", data.message)
        }
  },
  {deep: true}
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
     () => campusStore.schoolClassesResponse,
     async (data) => {
       if(data){
         classList.value = data.data
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

   const fetchStudyPeriodData = (classNumber) =>{

     studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:classNumber,
        school_number:formData.school_number
      } )
   }

   watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)

</script>



<template>
    <div>
     <!-- {{promotionSettingInfo}} -->
       {{ promotionDataInfo }}

      <form @submit.prevent="addPromotionSetting">
  
        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
          {{ classError }}
        </div>

        <div class="mb-2">
            <label class="text-sm"><small>Type</small>  </label><br>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.type"
            >
                <option disabled value="">--Select Type--</option>
                <option value="promotion">Promotion</option>
                <option value="repeat">Repeat</option>
                <option value="demote">Demote</option>
                <option value="admission">Admission</option>
            </select>
        </div>

  
        <div class="mb-2">
          <label class="text-sm"><small>Name</small></label>
          <input
              style="outline: none 0 !important; box-shadow: none;"
              type="text" v-model="form.name"
              required
              class="form-control form-select-sm">
        </div>

        <div class="mb-2">
            <label class="text-sm"><small>School</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="formData.school_number"
                    @change="fetchCampuses(formData.school_number)"
            >
                <option disabled value="">Select School</option>
                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>


        <div class="mb-2">
            <label class="text-sm"><small>Campus</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="formData.campus_number" required
                    @change="fetchCurriculum(formData.campus_number)"
            >
                <option disabled value="">Select campus</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>

        <div class="mb-2">
          <label class="text-sm"><small>Curriculum</small>  </label>
          <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="formData.curriculumNumber"  
          @change="fetchCampusLevel(formData.curriculumNumber)"                                         
          >
          <option disabled value="" >--Select Curriculum--</option>
          <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
          </select>
          </div>

          <div class="mb-2">
            <label class="text-sm"><small>Level</small> </label>
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
          <div class="mb-2">
            <label class="text-sm"><small>Academic year</small> </label>
                <div class="mb-2">
                <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="form.academic_year_number"
                @change=""
                >
                <option disabled value="">-filter AcademicYear-</option>
                <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                </select>
                </div>

            </div>


        <div class="row">
            <div class="col-lg-6">
                <div class="mb-2">
            <label class="text-sm"><small>Current Class</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.previous_class_number"
                    @change="fetchAcademicYear(form.previous_class_number)"
            >
              <option disabled value="">-filter by class-</option>
              <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
              {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
              </option>

            </select>
        </div>

            </div>
            <div class="col-lg-6">
              
                <div class="mb-2">
            <label class="text-sm"><small>Next Class</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.next_class_number"
                    @change="fetchStudyPeriodData(form.next_class_number)"
            >

                <option disabled value="">-filter by class-</option>
              <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
              {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
              </option>
            </select>
        </div>

            <div class="mb-2">
                <label class="text-sm"><small>Study period</small> </label>
                <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.study_period_number"          
              >
              <option disabled value="">filter by Study period -</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
              </select>
              </div>
          </div>
          </div>


        <div class="flex justify-content-end mt-2" style="width: 100%;">
          <button
              type="submit"
              class="btn btn-primary border-0">
              {{promNumber ? "Edit" : "Save"}}
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