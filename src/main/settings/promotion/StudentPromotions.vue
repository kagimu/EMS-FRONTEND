

<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
   import AppModal from "@/components/AppModal.vue";
   import PromotedStudents from "@/main/settings/promotion/PromotedStudents.vue"
   
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
   const showPromotionModel = ref(false)

   
   const curriculumList = ref([])
   const levelList = ref([])
   
   onMounted(() => {
     schoolStore.fetchSchools()
    }
   )
   
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
   
   
const viewPromotedStudents = () => {
  showPromotionModel.value = true
}
   
</script>
<template>
<div>

  <AppModal title="Promoted Students" v-model="showPromotionModel" xl8>
       <PromotedStudents></PromotedStudents>
    </AppModal>


<div class="row mt-4 m-1">
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
</div>


<div class="row mt-4 m-1">
  <div class="col-12">

  <PromotedStudents></PromotedStudents>
  </div>
  <div class="col-3">
    
<!-- <button @click="viewPromotedStudents()"
  type="button"  class="btn btn-sm  btn-outline-primary mr-2 mt-5 text-xs" style="font-size: 12px !important;">
  View Promoted Students 
  <i class="bi bi-arrow-right"></i>
</button>

<hr>
<button @click="adjustConfig()"
  type="button"  class="btn btn-sm  btn-outline-danger mr-2 text-xs" style="font-size: 12px !important;" >
  <i class="bi bi-arrow-left"></i> Adjust Configurations
</button> -->
  </div>



</div>



</div>

                
           

  </template>
  

  
  <style>
  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .search-input {
    padding: 5px;
    font-size: 14px;
  }
  
  .action-button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .action-button:hover {
    background-color: #0056b3;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    position: relative;
    cursor: pointer;
    background-color: #f9f9f9;
    padding: 8px;
    text-align: left;
  }
  
  th span {
    font-size: 12px;
    margin-left: 5px;
  }
  
  .resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    cursor: col-resize;
  }
  
  td {
    padding: 8px;
    border-top: 1px solid #ccc;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }
  
  .pagination button {
    padding: 5px 10px;
    margin: 0 5px;
    cursor: pointer;
  }
  </style>
  