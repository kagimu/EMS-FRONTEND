<script setup>
import {ref, onMounted, watch,reactive} from 'vue'
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import router from "@/config/router.js";


const currentSchool = ref(null)
const notificationStore = useNotificationStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const levelStore = useLevelStore()
const academicYearStore = useAcademicYearStore()
const academicYearList = ref([])
const curriculumList  = ref([])
const levelList  = ref([])
const studyPeriodList = ref([])
const schoolName = ref("")
const schoolLists = ref([])

  const form = reactive({
  academic_year: "",
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  interview_number:"",
  statusData:"",
  school_number:"",
  academic_year_number:"",
  curriculumNumber:"",
  level:""
  })




onMounted(
    async () => {
      schoolStore.fetchSchools()
      if(localStorage.getItem("SchoolInfo")){
        let data =  JSON.parse(localStorage.getItem("SchoolInfo")) 
        schoolLists.value =data
      }
    }

)

const goToDashboard = () => {
    //set storage and move on

   r = router.resolve({
            name: "teacher"
          })
}



watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
  )

  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
  }


  watch(
    () => campusStore.campusListResponse,
    async (data) => {
        if (data) {
            campusList.value = data.data
        }
    }
  )

  const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
    levelStore.fetchCampusCurriculum(campus_number)
  }

  const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data 
      }
    }
)


const fetchLevelClasses = (levelNumber) => {
   classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
   academicYearStore.fetchAcademicYearByLevel(levelNumber)
}


watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
        if (data) {
            classList.value = data.data
        }
    },
    {deep: true}
  )
  
  watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)

watch(
     () => academicYearStore.academicYearByLevelResponse,
     async (data) => {
       if(data){
         academicYearList.value = data.data
       }
     }
   )

   const fetchStreamsAndStudyPeriod = (classNumber) =>{

     studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:classNumber,
        school_number:form.school_number
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

  

      <div class="mb-2">       
        <label class="mb-1 mt-1 text-xs">School</label>                                       
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.school_number"
              @change="fetchCampuses(form.school_number)"
              >
              <option disabled value=""> -select school-</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
          </div>
       
        <div class="mb-2">
          <label class="mb-1 mt-1 text-xs">Campus</label>
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="form.campus_number" required
              @change="fetchClasses(form.campus_number)"
              >
              <option disabled value="">-Selct Campus-</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
        </div>
    
    <div class="mb-2">
      <label class="mb-1 mt-1 text-xs">Curriculum</label>
        <select
        style="box-shadow: none;"
        class="form-select form-select-sm"
            v-model="form.curriculumNumber"  
            @change="fetchCampusLevel(form.curriculumNumber)"                                         
        >
            <option disabled value="" >--Select Curriculum--</option>
            <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
      </div>

      <div class="row">
        <div class="col-lg-6">
          <div class="mb-2">
        <label class="mb-1 mt-1 text-xs">Level</label>
        <select
        style="box-shadow: none;"
        class="form-select form-select-sm"
          v-model="form.level"
          @change="fetchLevelClasses(form.level)"
        >
          <option disabled value="">-Select level-</option>
          <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
        </select>
      </div>


                                                  
  

        </div>
        
        <div class="col-lg-6">
          <div class="mb-2">
      <label class="mb-1 mt-1 text-xs">AcademicYear</label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="form.academic_year_number"
          >
          <option disabled value="">-Select -</option>
          <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
      </select>
    </div>
      
        </div>

      </div>

      <div class="row">
        <div class="col-lg-6">
          <div class="mb-2">
      <label class="mb-1 mt-1 text-xs">Class</label>
    <select
        style="box-shadow: none;"
        class="form-select form-select-sm" required
        v-model="form.campus_class_number"
        @change="fetchStreamsAndStudyPeriod(form.campus_class_number)">
      <option disabled value="">- select class-</option>
        <template v-for="(classItem, index) in classList" :key="index">
        <option v-for="(classDetail, indx) in classItem.classes" :key="indx" :value="classDetail.class_number">
        {{ classDetail.name }}
        </option>
        </template>
      </select>
    </div>
        </div>

        <div class="col-lg-6">
          <div class="mb-2">
      <label class="mb-1 mt-1 text-xs">Study Period</label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm" required
          v-model="form.study_period_number"
          >
          <option disabled value="">select -</option>
          <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

      </select>
    </div>

</div>

        

      </div>

      <button @click="goToDashboard" :disabled="!form.school_number" class="btn btn-primary btn-sm ml-2 mt-2 ">continue <i class="bi bi-arrow-right-circle"></i></button>


      <!-- <button @click="goToDashboard" :disabled="!schoolName" class="btn btn-primary btn-sm ml-2 mt-2 ">continue <i class="bi bi-arrow-right-circle"></i></button> -->
</template>



<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
