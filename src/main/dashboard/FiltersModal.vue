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
<div>
<div class="row mt-4">
<div class="row">
<div class="col-3">
<div class="mb-2">
<!-- <label class="text-sm"><small>School</small> </label> -->
<select
style="box-shadow: none;"
class="form-select form-select-sm" required
v-model="form.school_number"
@change="fetchCampuses(form.school_number)"
>
<option disabled  value="">-filter by School-</option>
<option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
</option>
</select>
</div>
</div>
<div class="col-3">
<div class="mb-2">
<!-- <label class="text-sm"><small>Campus</small>  </label> -->
<select
style="box-shadow: none;"
class="form-select form-select-sm"
v-model="form.campus_number" required
@change="fetchClasses(form.campus_number)"
>
<option disabled value="">-filter by Campus-</option>
<option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
</option>
</select>
</div>
</div>
<div class="col-3">
<div class="mb-2">
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
</div>
<div class="col-3" >
<div class="mb-2">
<select
style="box-shadow: none;"
class="form-select form-select-sm"
v-model="form.level"
@change="fetchLevelClasses(form.level)"
>
<option disabled value="">-Filter by level-</option>
<option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
</select>
</div>
</div>

<div class="col-3">
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

<div class="col-3">
<div class="mb-2">
<!-- {{ classList }} -->
<select
style="box-shadow: none;"
class="form-select form-select-sm" required
v-model="form.class_number"
@change="fetchStreamsAndStudyPeriod(form.class_number)"
>
<option disabled value="">-filter by class-</option>
<option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
{{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
</option>
</select>
</div>
</div>
<div class="col-3">
<div class="mb-2">
<!-- <label class="text-sm"><small>Stream</small> </label> -->
<select
style="box-shadow: none;"
class="form-select form-select-sm" required
v-model="form.stream_number"
@change="filterByStream()"
>
<option disabled value="">-filter by Stream-</option>
<option v-for="(slist, index) in streamList" :key="index" :value="slist.stream_number">{{ slist.name }}
</option>
</select>
</div>
</div>

<div class="col-3">
<div class="mb-2">
<select
style="box-shadow: none;"
class="form-select form-select-sm" required
v-model="form.study_period_number"
@change="filterByStudyPeriod()"
>
<option disabled value="">filter by Study period -</option>
<option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

</select>
</div>
</div>
</div>
</div>
</div>
                
           
    

            
</template>
<style scoped></style>