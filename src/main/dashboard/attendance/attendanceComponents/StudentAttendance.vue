<script setup>
   import {onMounted,reactive, ref, watch,computed} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
   import {usePromotionStore} from "@/main/settings/promotion/store/promotion.js"
   import PaginationTemplate from "@/components/PaginationTemplate.vue";
   import {useAttendanceStore} from "@/main/dashboard/attendance/store/attendance.js";
   import AppModal from "@/components/AppModal.vue";
   
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
   
   import { useAbility } from '@casl/vue';
   import RecordAttendanceModal from "./RecordAttendanceModal.vue";
   
   const { can } = useAbility()
   const time = ref("");

   const  notificationStore  = useNotificationStore()
   const enrollmentStore = useEnrolmentStore()
   const promotionStore = usePromotionStore()
   const attendanceStore = useAttendanceStore()
   const studyPeriodStore = useStudyPeriodStore()
   const levelStore = useLevelStore()
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
   const promDialog = ref(false)
   const loading = ref(false)
   const page = ref(1)
   const per_page = ref(20)
   const total_items = ref(0)
   const total_rows = ref(0)
   const studentNumber = ref(null)
   const userNumber= ref(null)
   const isComment = ref(false)
   const curriculumList = ref("")
   const levelList = ref("")
   const myModal = ref(false)
   const studentAttendanceList = ref([])
   
   //sample dammy
   const attendanceDate = ref("");
   
   const getCurrentTime = () => {
     const now = new Date();
     return now.toTimeString().slice(0, 5);
   };
   
   
   const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
   
   
   const form = reactive({
     study_period_number: "",
     campus_class_number: "",
     campus_number: "",
     stream_number:"",
     school_number:"",
     academic_year_number:"",
     status:"",
     class_number:"",
     curriculumNumber:"",
     level:""
   })
   
   
   
   const formData = reactive({
     check_in_time: "",
     check_out_time: "",
     present: "",
     user_number: "",
     campus_class_number: "",
     campus_number: "",
     absence_reason: "",
     date: "",
     student_number:""
   
   })
   
   const adn_no = ref(null)
   
   
   onMounted(() => {
         schoolStore.fetchSchools()
         const today = new Date();
         formData.date = today.toISOString().split("T")[0] 

        //  doFetchAttendance()

       }
   )


   const doFetchAttendance = () =>{

  if(!form.school_number){
    return
  }

  let data = {
    page: 1,
    per_page: per_page.value
  }
  attendanceStore.fetchStudentAttendance(data)
}




   
   const fetchCampuses = (school_number) => {
     campusStore.fetchCampuses(school_number)
     doFetchAttendance()
   }
   
   const fetchClasses = (campus_number) => {
     campusStore.fetchClassesByCampus(campus_number)
     levelStore.fetchCampusCurriculum(campus_number)
     doFetchAttendance()
   }
   
   const fetchAcademicYear = (campusN) =>{
     academicYearStore.fetchAcademicYearByCampus(campusN)
     // classStore.fetchClassStreams(campusN)
   
     let sData = {
        campus_number:form.campus_number,
        class_number:classN,
        campus_curriculum_number:form.curriculumNumber
   
       }
       classStore.fetchClassStreams(sData)
   
     doFetchAttendance()
   }
   
    
   const filterByStream = () => {
     doFetchAttendance()
   }
   
   const filterByStudyPeriod = () => {
     doFetchAttendance()
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
   
   watch(
       () => campusStore.schoolClassesResponse,
       async (data) => {
         if(data){
           classList.value = data.data
         }
       }
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
       () => academicYearStore.academicYearByLevelResponse,
       async (data) => {
         if(data){
           academicYearList.value = data.data
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
       () => attendanceStore.newStudentAttendanceResponse,
       async (data) => {
         if (data) {
           notificationStore.successToast("Success", data.message)
         }
       },
       {deep: true}
   )
   
   watch(
       () => attendanceStore.errorMessage,
       async (data) => {
         if (data) {
           notificationStore.errorToast("Error", data.message)
         }
       },
       {deep: true}
   )
   
   const studentName = ref(null)
   
   const openRecordAttendance = (student_number,student_sur_name, student_second_name,othername,user_number) => {
     myModal.value = true;
     studentName.value = student_sur_name + " "+student_second_name+" "+othername
     studentNumber.value = student_number
     userNumber.value = user_number
   }
   


   const fetchAttendanceList = (data) => {
  if(data) {
    let current_page = data.page
    page.value = current_page
    // loading.value = false;

    let per_page_item = data.per_page;
    per_page.value = per_page_item;

    let objArray = data.content

    let count_items = (current_page * per_page_item)
    let totalItems = data?.total_rows


    if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
      objArray.forEach((list, i) => {

        list.key =  (current_page - 1) * per_page_item + i + 1

        const index = studentAttendanceList.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          studentAttendanceList.value.push(list);
        }
      })
    }

  }
}


function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
    }
    attendanceStore.fetchStudentAttendance(data)
  }
}


watch(
    () => attendanceStore.attendanceStudentResponse,
    async (data) => {
      if (data) {
        fetchAttendanceList(data?.data)
      }
    },
    {deep: true}
)
   
</script>
<template>
   <div>
      <AppModal :title="'CheckIn / CheckIn => '+ studentName " v-model="myModal" xl2>
         <RecordAttendanceModal :userNumber="userNumber" :studentNumber="studentNumber"></RecordAttendanceModal>
      </AppModal>
      <!-- end  -->
      <div class="row">
         <div class="col-12">
            <div class="mt-4">
               <div class="col-lg-12">
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
                     <div class="col-2">
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
                     <div class="col-2">
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
                     <div class="col-2">
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
                     <div class="col-3">
                        <div class="mb-2">
                           <input
                              type="text"
                              v-model="searchQuery"
                              class="form-control"
                              placeholder="Search ....."
                              >
                        </div>
                     </div>
                  </div>
               </div>
               <div class="row">
                  <div class="col-lg-8">
                     📅 Select Date: <input type="date" class="border border-primary text-center fw-bold" id="attendanceDate" v-model="formData.date">
                  </div>
                  <div class="col-lg-4">

                     <PaginationTemplate
                        v-model:perPage="per_page"
                        :per_page="per_page"
                        :total_items="total_items"
                        :total_rows="total_rows"
                        @perPageChanged="doFetchAttendance"></PaginationTemplate>

                  </div>
               </div>
               <div v-if="loading" class="text-center my-4">
                  <div class="spinner-border" role="status">
                     <span class="sr-only">Loading...</span>
                  </div>
               </div>
               <div v-else-if="studentAttendanceList.length === 0" class="text-center my-4">
                  <p>There is no data found</p>
               </div>
               <div v-else>
               
                  <div class="table-responsive w-full overflow-auto max-h-[520px] scrollbar-thin ">
                     <table class="table table-hover  caption-top mt-1 table-sm table-striped text-sm">
                        <thead class="table-dark">
                           <tr>
                              <th style="width: 2px;">#</th>
                              <th>Name</th>
                              <th>Date</th>
                              <th>Check InTime</th>
                              <th>Present</th>
                              <th>Absent</th>
                              <th>Reason (if absent)</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="(list,index) in studentAttendanceList" :key="index">
                              <td>{{ index + 1 }}</td>
                              <td style="text-transform: capitalize;">
                               {{ list.name }}
                              </td>
                              <td>
                                {{list.date}}
                              </td>

                              <td>
                                 <input disabled type="time" class="form-control" v-model="list.check_in_time">
                              </td>
                              <td class="text-center">
                                <!-- {{ list.present }} -->
                                 <input disabled  type="radio" :name="'attendance' + list.number" value="YES" v-model="list.present" class="square-radio">
                              </td>
                              <td class="text-center">
                                <!-- {{ list.present }} -->
                                 <input  disabled type="radio" :name="'attendance' + list.number" value="NO" v-model="list.present" class="square-radio">
                              </td>
                              <td>
                                 <textarea  v-if="list.present === 'NO'" class="form-control" 
                                 v-model="list.absence_reason"  disabled></textarea>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<style scoped>
   /* Square Radio Buttons with Checkmark */
   .square-radio {
   appearance: none;
   width: 25px;
   height: 25px;
   border: 2px solid #007bff;
   background-color: white;
   cursor: pointer;
   display: inline-block;
   position: relative;
   margin: 5px;
   border-radius: 5px; /* Slight rounding for softer look */
   }
   /* Checkmark when selected */
   .square-radio:checked::after {
   content: "✔";
   font-size: 18px;
   color: white;
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   font-weight: bold;
   }
   /* Change background color when checked */
   .square-radio:checked {
   background-color: #007bff;
   border-color: #0056b3;
   }
   /* Bigger Date Picker */
   #attendanceDate {
   font-size: 1.2rem;
   padding: 10px;
   }
   /* Styling textareas */
   textarea {
   min-width: 200px;
   min-height: 40px;
   }
   /* Center table text */
   th, td {
   text-align: left;
   }
</style>