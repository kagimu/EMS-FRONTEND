
<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
   import useCommonsStore from "@/composables/useCommons.js";

   const commons = useCommonsStore()
   const studyPeriodStore = useStudyPeriodStore()
   const levelStore = useLevelStore()
   const  notificationStore  = useNotificationStore()
    
   const campusList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const academicYearStore = useAcademicYearStore()
   const academicYearList = ref([])
   const studyPeriodList  = ref([])
   const classStore = useClassesStore()
   const streamList = ref([])

   
   const curriculumList = ref([])
   const levelList = ref([])
   
 
   
   const form = reactive({
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
   
   onMounted(() => {
     schoolStore.fetchSchools()
     
     let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
  let defaultCampusNo =   localStorage.getItem("defaultCampusNo")
  let defaultCampusCurriculumNo =   localStorage.getItem("defaultCampusCurriculumNo")


 if(defaultSchoolNo){
    form.school_number = defaultSchoolNo
    fetchCampuses(form.school_number)
  }

  if(defaultCampusNo){
    form.campus_number = defaultCampusNo
    fetchClasses(form.campus_number)
  }

  if(defaultCampusCurriculumNo){
    form.curriculumNumber = defaultCampusCurriculumNo
    fetchCampusLevel(form.curriculumNumber)
  }
  
    }
   )
   
   const fetchCampuses = (school_number) => {
     campusStore.fetchCampuses(school_number)
     
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
    updateDefaultFilters()
   }
   
   const updateDefaultFilters = () => {
  commons.updateDefaultFilters({
    schoolNumber: form.school_number,
    campusNumber: form.campus_number,
    campusCurriculumNumber: form.curriculumNumber
  })
}
   
   
   const fetchLevelClasses = (levelNumber) => {
    let data = {
     school_number:form.school_number,
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
   
   const filterByStudyPeriod = () => {
    
   }
 

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
   
   
</script>

<template>
  <div class="filters-container p-3 rounded shadow-sm bg-white">
    <div class="row g-3">
      <!-- School -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-building me-1"></i> School
        </label>
        <select class="form-select form-select-sm" v-model="form.school_number" @change="fetchCampuses(form.school_number)">
          <option disabled value="">Select School</option>
          <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}</option>
        </select>
      </div>

      <!-- Campus -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-geo-alt me-1"></i> Campus
        </label>
        <select class="form-select form-select-sm" v-model="form.campus_number" @change="fetchClasses(form.campus_number)">
          <option disabled value="">Select Campus</option>
          <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}</option>
        </select>
      </div>

      <!-- Curriculum -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-journal-text me-1"></i> Curriculum
        </label>
        <select class="form-select form-select-sm" v-model="form.curriculumNumber" @change="fetchCampusLevel(form.curriculumNumber)">
          <option disabled value="">Select Curriculum</option>
          <option v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{ lvl.name }}</option>
        </select>
      </div>

      <!-- Level -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-layers me-1"></i> Level
        </label>
        <select class="form-select form-select-sm" v-model="form.level" @change="fetchLevelClasses(form.level)">
          <option disabled value="">Select Level</option>
          <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{ lvl.code + ". " + lvl.name }}</option>
        </select>
      </div>

      <!-- Academic Year -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-calendar me-1"></i> Academic Year
        </label>
        <select class="form-select form-select-sm" v-model="form.academic_year_number">
          <option disabled value="">Select Year</option>
          <option v-for="(item, index) in academicYearList" :key="index" :value="item.number">{{ item.academic_year_name }}</option>
        </select>
      </div>

      <!-- Class -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-easel2 me-1"></i> Class
        </label>
        <select class="form-select form-select-sm" v-model="form.class_number" @change="fetchStreamsAndStudyPeriod(form.class_number)">
          <option disabled value="">Select Class</option>
          <option v-for="(item, index) in classList" :key="index" :value="item.number">
            {{ item.name + " [" + item.abbreviation + "]" }}
          </option>
        </select>
      </div>

      <!-- Stream -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-diagram-3 me-1"></i> Stream
        </label>
        <select class="form-select form-select-sm" v-model="form.stream_number" @change="filterByStream()">
          <option disabled value="">Select Stream</option>
          <option v-for="(item, index) in streamList" :key="index" :value="item.stream_number">{{ item.name }}</option>
        </select>
      </div>

      <!-- Study Period -->
      <div class="col-md-3">
        <label class="form-label small fw-bold">
          <i class="bi bi-clock me-1"></i> Study Period
        </label>
        <select class="form-select form-select-sm" v-model="form.study_period_number" @change="filterByStudyPeriod()">
          <option disabled value="">Select Period</option>
          <option v-for="(item, index) in studyPeriodList" :key="index" :value="item.study_period_number">{{ item.study_period_name }}</option>
        </select>
      </div>
    </div>
  </div>


</template>

<style scoped>
.filters-container {
  background-color: #fefefe;
  /* border: 1px solid #e0e0e0; */
  border-radius: 0.5rem;
}

.form-label {
  color: #333;
}
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25);
}

</style>