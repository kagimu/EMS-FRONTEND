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


   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const academicYearStore = useAcademicYearStore()
   const classStore = useClassesStore()
   const levelStore = useLevelStore()
   const notificationStore = useNotificationStore()

   const accountStore = useAccountStore()


   const errorMessage = ref(null)
   const userData = ref([])
   const buttonLoader = ref(false)
   const campusList = ref([])
   const curriculumList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const levelList = ref([])
   const academicYearList = ref([])
   const studyPeriodList  = ref([])

   const streamList = ref([])
   const admissionList = ref([])


    const props = defineProps({
      userInfo:String
    })

   
   const form = reactive({
     user_number:null,
     school_number:null,
     stream_number:null,
     campus_class_number:null,
     assessment_area_number:null,
     curriculum_number:null,
     curriculumNumber:null,
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


   
   function addUser(){
     buttonLoader.value = true
    accountStore.createNewAccount(form)
   }



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
     // campusStore.fetchClassesByCampus(campus_number)
     levelStore.fetchCampusCurriculum(campus_number)
   }

   const fetchAcademicYear = (campus_class_number) =>{
     // academicYearStore.fetchAcademicYearByCampus(campus_class_number)
     classStore.fetchClassStreams({class_number:campus_class_number})
   }

   const fetchCampusLevel = (curriculumNumber) => {
     classStore.fetchCampusLevel(curriculumNumber)
   }



   const fetchLevelClasses = (levelNumber) => {
     classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
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
       () => classStore.classLevelInfoResponse,
       async (data) => {
         if(data){
           classList.value = data.data
         }
       }
   )

</script>
<template>
   <div>
      <form @submit.prevent="addUser">
         <div class="row">
            <div class="col-12">


              <div class="mb-2">
                <label class="text-sm mt-3 mb-2"><small>Select User</small></label>
                <teacher-combo-box
                    v-model:optionResponse="form.user_number"
                    :optionDraft="form?.user_number"
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
                  <option disabled  :value="null">--filter by School--</option>
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
                  <option disabled value="">-filter by Campus-</option>
                  <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                  </option>
                </select>
              </div>



              <div class="mb-2">
                <label class="text-sm"><small>Curriculum</small> </label>
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


              <div class="mb-2">
                <label class="text-sm"><small>Level</small> </label>
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

              <div class="mb-2">
                <label class="text-sm"><small>Class</small> </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.campus_class_number"
                    @change="fetchAcademicYear(form.campus_class_number)"
                >
                  <option disabled value="">-filter by class-</option>
                  <template v-for="(classItem, index) in classList" :key="index">
                    <option v-for="(classDetail, indx) in classItem.classes" :key="indx" :value="classDetail.number">
                      {{ classDetail.name }}
                    </option>
                  </template>
                </select>
              </div>

              <div class="mb-2">
                 <label class="text-sm"><small>Stream</small> </label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.stream_number"
                    @change="filterByStream()"
                >
                  <option disabled value="">-filter by Stream-</option>
                  <option v-for="(lst, index) in streamList" :key="index" :value="lst.number">{{ lst.name }}
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










