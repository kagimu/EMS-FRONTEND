<script setup>
   import {onMounted, reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";

   import { useAccountStore } from "@/main/dashboard/account/store/account.js";
   import TeacherComboBox from "@/main/dashboard/account/teacherManagement/TeacherComboBox.vue";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import ComboBox from "@/components/ComboBox.vue";
   import {useTeacherStore} from "@/main/dashboard/account/teacherManagement/store/teacherStore.js";
   import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";


   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const academicYearStore = useAcademicYearStore()
   const classStore = useClassesStore()
   const levelStore = useLevelStore()
   const assessmentStore= useAssessmentStore()
   const notificationStore = useNotificationStore()

   const accountStore = useAccountStore()
   const teacherStore = useTeacherStore()


   const userData = ref([])
   const buttonLoader = ref(false)
   const campusList = ref([])
   const curriculumList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const levelList = ref([])

   const streamList = ref([])
   const assessmentListData = ref([])


    const props = defineProps({
      userInfo:String
    })

   
   const form = reactive({
     teacher_ids:null,
     school_number:null,
     campus_number:null,
     curriculum_number:null,
     campus_level_number:null,
     class_number:null,
     streams:null,
     assessment_area_number:null,
   })

   onMounted(
       async () => {
         await schoolStore.fetchSchools()
       } )

   
       watch(
       () => accountStore.userResponse,
       async (data) => {
         if(data){
           userData.value = data.data
         }
       }
       )


   
   function addATeacher(){
      buttonLoader.value = true
     let formData = {...form}
     formData.curriculum_number = curriculumList.value.find(item => item.number === form.curriculum_number)?.curriculum_number
     teacherStore.assignTeacher(formData)
   }



   watch(
       () => teacherStore.errorMessage,
       async (data) => {
         if (data) {
           buttonLoader.value = false
           notificationStore.errorToast("Error", data.message)
         }
       }
   )

   watch(
       () => schoolStore.schoolsResponse,
       async (data) => {
         if (data) {
           schoolList.value = data.data
         }
       }
   )


   const fetchCampuses = (school_number) => {
     campusStore.fetchCampuses(school_number)
   }


   const fetchClasses = (campus_number) => {
     levelStore.fetchCampusCurriculum(campus_number)
   }



   const fetchAcademicYear = (campus_class_number) =>{
     let data = {
       campus_number:form.campus_number,
       class_number:campus_class_number,
       campus_curriculum_number:form.curriculum_number
     }
     classStore.fetchClassStreams(data)
     fetchAssessmentAreaList(campus_class_number)
   }

   const  fetchAssessmentAreaList = (campus_class_number) => {
     let data = {
       curriculum_number:curriculumList.value.find(item => item.number === form.curriculum_number)?.curriculum_number ,
       class_number:campus_class_number
     }
     assessmentStore.fetchAssessmentArea(data)

   }


   const fetchCampusLevel = (curriculum_number) => {
     classStore.fetchCampusLevel(curriculum_number)
   }


   const fetchLevelClasses = (campus_level_number) => {
     let data = {
       school_number:form.school_number,
       campus_number:form.campus_number,
       campus_curriculum_number:form.curriculum_number,
       campus_level_number:campus_level_number
     }
     campusStore.fetchClassesBySchool(data)
   }


   watch(
       () => campusStore.campusListResponse,
       async (data) => {
         if (data) {
           campusList.value = data.data
         }
       }
   )

   watch(
       () => levelStore.campusCurriculumResponse,
       async (data) => {
         if(data){
           curriculumList.value = data.data
         }
       }
   )

   watch(
       () => classStore.campusLevelResponse,
       async (data) => {
         if(data){
           levelList.value = data.data
         }
       }
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
       () => classStore.classStreams,
       async (data) => {
         if (data) {
           let draft = data.data
           streamList.value =  draft.map(item => ({
             text: item?.name,
             value: item?.stream_number
           }));
         }
       }
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
      <form @submit.prevent="addATeacher">
         <div class="row">
            <div class="col-12">


              <div class="mb-2">
                <label class="text-sm mt-3 mb-2"><small>Select User</small></label>
                <teacher-combo-box
                    v-model:optionResponse="form.teacher_ids"
                    :optionDraft="form?.teacher_ids"
                ></teacher-combo-box>
              </div>


              <div class="mb-2">
                 <label class="text-sm"><small>School</small> </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.school_number"
                    @change="fetchCampuses(form.school_number)"
                >
                  <option disabled  :value="null">--Filter by School--</option>
                  <option v-for="(list, index) in schoolList" :key="index" :value="list.number">
                    {{ list.name }}
                  </option>
                </select>
              </div>


              <div class="mb-2">
                 <label class="text-sm"><small>Campus</small>  </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.campus_number" required
                    @change="fetchClasses(form.campus_number)"
                >
                  <option disabled :value="null">--Filter by Campus--</option>
                  <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                  </option>
                </select>
              </div>



              <div class="mb-2">
                <label class="text-sm"><small>Curriculum</small> </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.curriculum_number"
                    @change="fetchCampusLevel(form.curriculum_number)"
                >
                  <option disabled :value="null" >--Select Curriculum--</option>
                  <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
                </select>
              </div>


              <div class="mb-2">
                <label class="text-sm"><small>Level</small> </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.campus_level_number"
                    @change="fetchLevelClasses(form.campus_level_number)"
                >
                  <option disabled :value="null">--Filter by level--</option>
                  <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
                </select>
              </div>




              <div class="mb-2">
                <label class="text-sm"><small>Class</small> </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.class_number"
                    @change="fetchAcademicYear(form.class_number)"
                >
                  <option disabled :value="null">--Filter by Class--</option>
                  <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
                    {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
                  </option>
                </select>
              </div>


              <div class="mb-2">
                 <label class="text-sm"><small>Stream</small> </label>
                <combo-box
                    v-model:optionResponse="form.streams"
                    :optionList="streamList"
                    :optionDraft="form?.streams"
                ></combo-box>
              </div>

              <div class="mb-2">
                <label class="text-sm"><small>Assessment Area</small> </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.assessment_area_number"
                >
                  <option disabled :value="null">--Filter by Assessment Area--</option>
                  <option v-for="(list, index) in assessmentListData" :key="index" :value="list.number">{{ list.name }}
                  </option>
                </select>
              </div>

            </div>
         </div>
         <div class="text-right mt-1">
            <button type="submit" class="btn btn-primary mb-2 btn-sm">
               Submit
               <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                  <span class="visually-hidden">Loading...</span>
               </div>
            </button>
         </div>
      </form>
   </div>
</template>
<style scoped>
   input:focus {
   box-shadow: none;
   }

</style>










