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
    
   const enrollmentList = ref( [])
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
   const buttonLoader = ref(false)
   
   //sample dammy
   const attendanceDate = ref("");
   
   const getCurrentTime = () => {
     const now = new Date();
     return now.toTimeString().slice(0, 5);
   };
   
   
   
   // Capitalize first letter
   const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
   
   
   // ======================
   
   const form = reactive({
     study_period_number: "",
     class_number: "",
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
     class_number: "",
     campus_number: "",
     absence_reason: "",
     date: "",
     student_number:""
   
   })
   
   const adn_no = ref(null)
   
   
   onMounted(() => {
         schoolStore.fetchSchools()
         // doFetchEnrollent()
   
         const today = new Date();
         formData.date = today.toISOString().split("T")[0]; // YYYY-MM-DD format


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
   //   doFetchEnrollent()
   }
   
   const fetchClasses = (campus_number) => {
     campusStore.fetchClassesByCampus(campus_number)
     levelStore.fetchCampusCurriculum(campus_number)
   //   doFetchEnrollent()

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
   
   //   doFetchEnrollent()
   }
   
   
   
   const filterByStream = () => {
     doFetchEnrollent()
   }
   
   const filterByStudyPeriod = () => {
     doFetchEnrollent()
   }
   
   
   const doFetchEnrollent = () =>{
     if(!form.study_period_number){
       return
     }
   
     let data = {
       page: 1,
       per_page: per_page.value,
       study_period_number:form.study_period_number,
       school_number:form.school_number,
       campus_number: form.campus_number,
       class_number:form.class_number,
       stream_number:form.stream_number,
       academic_year_number:form.academic_year_number,
       curriculum_number:form.curriculumNumber,
       status:form.status
     }
     loading.value = true;
     enrollmentList.value = []
     enrollmentStore.fetchEnrolment(data)
   
   }
   
   function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
     if (scrollTop + clientHeight >= scrollHeight) {
       let data = {
         page: (page.value+1),
         per_page: per_page.value,
         study_period_number:form.study_period_number,
         school_number:form.school_number,
         campus_number: form.campus_number,
         class_number:form.class_number,
         stream_number:form.stream_number,
         academic_year_number:form.academic_year_number,
         curriculum_number:form.curriculumNumber,
         status:form.status
       }
   
       enrollmentStore.fetchEnrolment(data)
     }
   }
   
   
   const fetchEnrollmentList = (data) => {
     if(data) {
       let current_page = data.page
       page.value = current_page
       loading.value = false;
   
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
   
           // const index = enrollmentList.value.findIndex(object => object.number === list.number);
           //
           // if (index === -1) {
           //   enrollmentList.value.push(list);
           // }
   
   
           const index = enrollmentList.value.findIndex(object => object.number === list.number);
           if (index === -1) {
             list.present = "";
             list.check_in_time = getCurrentTime()
             list.absence_reason = ""
             // isComment.value = false
             // formData.present="YES"
             // Add status property
             enrollmentList.value.push(list);
           }
   
         })
       }
   
     }
   }
   
   watch (
       () => enrollmentStore.enrolmentResponse,
       async (data) => {
         if(data){
           promDialog.value = false;
           fetchEnrollmentList(data)
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
       () => enrollmentStore.errorMessage,
       async (data) => {
         if (data) {
           promDialog.value = false;
           notificationStore.errorToast("Error", data.message)
         }
       },
       {deep: true}
   )
   
   
   watch(
       () => promotionStore.newPromotionsResponse,
       async (data) => {
         if (data) {
           promDialog.value = false;
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
   
   
   const  setAttendanceStatus = (status,adn,userN,stdN) => {
     adn_no.value = adn
     formData.user_number = userN
     formData.student_number = stdN
      
     if(status === "present"){
       isComment.value = false
       formData.present="YES"
     }else {
       isComment.value = true
       formData.present="NO"
     }
   }
   
   
   const saveAttendanceData = () =>{



   //   alert(JSON.stringify(formData))
     attendanceStore.newStudentAttendance(formData)
   }

   const recordAttendance = (checkInTime,present,user_number,student_number,absence_reason) =>{
     formData.school_number = form.school_number
     formData.school_number = form.school_number
     formData.study_period_number= form.school_number
      formData.campus_class_number= form.class_number
      formData.campus_number= form.campus_number
      formData.stream_number= form.stream_number
      formData.academic_year_number= form.academic_year_number

     formData.check_in_time = checkInTime
     formData.present = present
     formData.user_number = user_number
     formData.student_number = student_number
     formData.absence_reason = absence_reason
   //   alert(JSON.stringify(formData))
   buttonLoader.value = true
     attendanceStore.newStudentAttendance(formData)
   }
   
   
   watch(
       () => attendanceStore.newStudentAttendanceResponse,
       async (data) => {
         if (data) {
           notificationStore.successToast("Success", data.message)
           buttonLoader.value = false
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
                     <div class="col-2">
                        <div class="mb-2">
                           <!-- <label class="text-sm"><small>Stream</small> </label> -->
                            <!-- {{ streamList }} -->
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
                        @perPageChanged="doFetchEnrollent"></PaginationTemplate>
                  </div>
               </div>
               <div v-if="loading" class="text-center my-4">
                  <div class="spinner-border" role="status">
                     <span class="sr-only">Loading...</span>
                  </div>
               </div>
               <div v-else-if="enrollmentList.length === 0" class="text-center my-4">
                  <p class="alert alert-success">Please select stream to view students !</p>
               </div>
               <div v-else>
                  <div
                     class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                     @scroll="onScroll"
                     style="display: none;">
                     <table
                        class="table table-hover caption-top mt-1 table-sm table-striped text-xs"
                        style="font-size: 13px !important;"
                        >
                        <thead >
                           <tr>
                              <!--                      <th>#</th>-->
                              <th class="text-xs">Student</th>
                              <th class="text-xs">Class</th>
                              <th class="text-xs" :style="formData.present ?'width: 45%;'  : 'width:35%'">
                                 Check InDate <span style="color: red">*</span>
                                 <input class="ml-2 p-1"  type="date"  v-model="formData.date" style="width: 150px">
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="(enrolData,index) in enrollmentList" :key="index" >
                              <!--                      <td>-->
                              <!--                        <input type="checkbox" class="mt-3">-->
                              <!--                      </td>-->
                              <td style="text-transform: capitalize;">
                                 <div class="flex flex-row items-center">
                                    <div class="text-center">
                                       <img v-if="enrolData?.photo" :src="enrolData?.photo" alt="photo" class="w-[40px] h-[40px] border rounded-full"/>
                                       <div v-else class="m-auto">
                                          <i class="bi-person-circle text-[40px] text-[#8a8888]"></i>
                                       </div>
                                    </div>
                                    <div class="ml-2">
                                       <span class="link link-primary" style="cursor: pointer" >
                                       {{ enrolData.student_surname + " "+ enrolData.student_second_name + " "  + enrolData.student_other_name }}
                                       </span>
                                    </div>
                                 </div>
                              </td>
                              <td>{{ enrolData.class }}</td>
                              <td>
                                 <div class="row">
                                    <div class="col-lg-4">
                                       <select class="form-control form-select" v-model="enrolData.status" @change="setAttendanceStatus(enrolData.status,enrolData.adn,enrolData.user_number,enrolData.student_number)">
                                          <option value="">- select -</option>
                                          <option value="present">Present</option>
                                          <option value="absent">Absent</option>
                                       </select>
                                    </div>
                                    <div class="col-lg-8" v-if="isComment && enrolData.adn === adn_no">
                                       <textarea v-on:blur="saveAttendanceData" class="form-control form-control-sm" v-model="formData.absence_reason"></textarea>
                                    </div>
                                    <div class="col-lg-8" v-if="!isComment && enrolData.adn === adn_no">
                                       <input v-on:blur="saveAttendanceData" type="time" class="form-control form-control-sm" v-model="formData.check_in_time">
                                    </div>
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
                  <div class="table-responsive w-full overflow-auto max-h-[520px] scrollbar-thin ">
                     <table class="table table-hover  caption-top mt-1 table-sm table-striped text-sm">
                        <thead class="table-dark" style="position: sticky; top: 0;z-index: 12;" >
                           <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th style="text-align: center;">Present</th>
                              <th style="text-align: center;">Absent</th>
                              <th>Check In Time / Reason (if absent)</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="(enrolData,index) in enrollmentList" :key="index">
                              <td>{{ index + 1 }}</td>
                              <td>
                                 <div class="flex flex-row items-center">
                                    <div class="text-center">
                                       <img v-if="enrolData?.photo" :src="enrolData?.photo" alt="photo" class="w-[40px] h-[40px] border rounded-full"/>
                                       <div v-else class="m-auto">
                                          <i class="bi-person-circle text-[40px] text-[#8a8888]"></i>
                                       </div>
                                    </div>
                                    <div class="ml-2" style="text-transform: capitalize;" >
                                       
                                       {{ enrolData.student_surname + " "+ enrolData.student_second_name + " "  + enrolData.student_other_name }}

                                    </div>
                                 </div>
                              </td>
                          
                              <td class="text-center">
                                 <input
                                  type="radio" :name="'attendance' + enrolData.adn" value="YES" v-model="enrolData.present" class="square-radio">
                              </td>
                              <td class="text-center">
                                 <input  type="radio" :name="'attendance' + enrolData.adn" value="NO" v-model="enrolData.present" class="square-radio">
                              </td>
                              <td>
                                 
                                 <textarea v-on:blur="recordAttendance(enrolData.check_in_time,enrolData.present,enrolData.user_number,enrolData.student_number,enrolData.absence_reason)" v-if="enrolData.present === 'NO'" class="form-control" v-model="enrolData.absence_reason" placeholder="Enter reason "></textarea>
                                 <span   style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                                 role="status" v-if="buttonLoader && enrolData.student_number ==formData.student_number && enrolData.present === 'NO'"><span class="visually-hidden">Loading...</span></span> 

                                 <div class="row" v-if="enrolData.present === 'YES'">
                                    <div class="col-lg-6">
                                 <div class="input-group input-group-sm">
                                 <input 
                                 type="time" 
                                 class="form-control form-control-sm" 
                                 v-model="enrolData.check_in_time">
                                 <button 
                                 @click="recordAttendance(enrolData.check_in_time, enrolData.present, enrolData.user_number, enrolData.student_number, null)"
                                 class="btn btn-outline-primary btn-sm">
                                 <i class="bi bi-check2"></i>

                                 <span   style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                                 role="status" v-if="buttonLoader && enrolData.student_number ==formData.student_number"><span class="visually-hidden">Loading...</span></span> 

                                 </button>
                                 </div>
                                 </div>

                              </div>
                                

                              </td>
                              <!-- <td>
                                 <textarea v-on:blur="recordAttendance(enrolData.check_in_time,enrolData.present,enrolData.user_number,enrolData.student_number,enrolData.absence_reason)" v-if="enrolData.present === 'NO'" class="form-control" v-model="enrolData.absence_reason" placeholder="Enter reason"></textarea>
                              </td> -->
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