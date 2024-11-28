<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import { useSchemeOfWorkStore } from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
   import '@vuepic/vue-datepicker/dist/main.css';
   import useCommonsStore from "@/composables/useCommons.js";

   const useCommon = useCommonsStore()
   
   const schemeOfWorkStore = useSchemeOfWorkStore();
   const streamList = ref([])
   const promDialog = ref(false)
   const loading = ref(false)
   const page = ref(1)
   const per_page = ref(20)
   const total_items = ref(0)
   const total_rows = ref(0)
   const enrollmentList = ref( [])
   const  notificationStore  = useNotificationStore()
   const enrollmentStore = useEnrolmentStore()
   const schoolNumber = ref(null)
   const classStore = useClassesStore()
   const classNumber = ref(null);
   const classList = ref([])
   const draftInfo = ref({})
   const adn_no = ref(null)
   const showV = ref(false)
   const studentsInASessionDataInfo = ref([])
   const selectedStep = ref(null)
   const sessionNum = ref(null)   

   const openCommentField = (adn) =>{
   adn_no.value = adn
   showV.value = true
   }
   
   const closeCommentField = (adn) =>{
   adn_no.value = adn
   showV.value = false
   }
   
   
   const props = defineProps({
     streamNumber: String,
     schoolNum:String,
     studentsInASessionData:{},
     sessionInfoData:{},
     sessionNumber:String,
     teacherNumber:String,
     stepNumber:String,
     generalTime:String,
     generalDate:String
   })

   const form = reactive({
   stream_number:"",
   comment:null,
   date:null,
   time:null,
   teacher_number:null,
   step_number:null,
   students: [],
   })
  
   onMounted(() => {
      
     if(props.streamNumber){
      form.stream_number = props.streamNumber
     }
     if(props.schoolNum){
      schoolNumber.value = props.schoolNum
     }
     doFetchEnrollent()
     getStudentsInSessionInfo()
     getSessionInfoData()
     getSessionNumber()
     getTeacherInfo()
     getStepNumber()
     getGeneralTimeAndDate()
  })
   

  watch(
   () => props.streamNumber,
   async (data) => {
   if (data) {
    doFetchEnrollent()
   }
   }
   )

   watch(
      () => props.studentsInASessionData,
      async (data) => {
        if (data) {
           getStudentsInSessionInfo()
        }
      }
   )

   const getStudentsInSessionInfo = () => {
    if(props.studentsInASessionData){
      studentsInASessionDataInfo.value = props.studentsInASessionData
 
    }
   }

   const getSessionInfoData = () => {
    let draft = props.sessionInfoData
    if(draft){
      form.date = draft.date
      form.time = draft.time
      form.comment = draft.comment
    }
   }

   watch(
      () => props.sessionInfoData,
      async (data) => {
        if (data) {
          getSessionInfoData()
        }
      }
   )

   watch(
      () => props.sessionNumber,
      async (data) => {
        if (data) {
          getSessionNumber()
        }
      }
   )

   const getSessionNumber= () => {
    sessionNum.value = props.sessionNumber
   }

   const getStepNumber= () => {
    selectedStep.value = props.stepNumber
   }

   const getTeacherInfo= () => {
   form.teacher_number = props.teacherNumber
   }
   
   watch(
      () => props.teacherNumber,
      async (data) => {
        if (data) {
          getTeacherInfo()
        }
      }
   )

   watch(
      () => props.stepNumber,
      async (data) => {
        if (data) {
          getStepNumber()
        }
      }
   )
  

   const getGeneralTimeAndDate = () => {

     form.date = props.generalDate
     form.time = props.generalTime
   }


   watch(
      () => props.generalDate,
      async (data) => {
        if (data) {
          getGeneralTimeAndDate()
        }
      }
   )


   const doFetchEnrollent = () =>{
   let data = {
   page: 1,
   per_page: per_page.value,
   study_period_number:"",
   school_number:schoolNumber.value,
   campus_number: "",
   campus_class_number:"",
   stream_number:form.stream_number,
   academic_year_number:"",
   status:""
   }
   loading.value = true;
   enrollmentList.value = []
   enrollmentStore.fetchEnrolment(data)
   
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
   
 
   
   const index = enrollmentList.value.findIndex(object => object.studentNumber === list.student_number);
   
   if (index === -1) {

    let info = {
    studentName:(list?.student_surname ?? "") +" "+(list?.student_second_name ?? "") +" "+(list?.student_other_name ?? ""),
    student_number:null,
    adn:list.adn,
    photo:list.photo,
    studentNumber:list.student_number,
    comment:null
   }
   enrollmentList.value.push(info);
   }
   })

   updateStudent(enrollmentList.value)

   }
   
   }
   }
   
   const updateStudent = (arr1) => {
    arr1.forEach(student => {
    const matched = studentsInASessionDataInfo.value.find(person => person.number === student.studentNumber);
    if (matched) {
      student.student_number = student.studentNumber; 
     }
      })
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
   () => enrollmentStore.errorMessage,
   async (data) => {
   if (data) {
   promDialog.value = false;
   notificationStore.errorToast("Error", data.message)
   }
   },
   {deep: true}
   )
   
   
   function toggleStudent(student_number) {
     const index = form.students.findIndex(student => student.student_number === student_number);
     if (index === -1) {
       form.students.push({ student_number, comment: "" });
     } else {
       form.students.splice(index, 1);
     }
   }
   
   
   function updateStudentComment(student_number, comment) {
     const student = form.students.find(student => student.student_number === student_number);
     if (student) {
       student.comment = comment;
     } else {
       form.students.push({ student_number, comment });
     }
   }
   
  
   watch(
   () => schemeOfWorkStore.errorMessage,
   async (data) => {
   if (data) {
   notificationStore.errorToast("Error", data.message)
   }
   },
   {deep: true}
   )
 

   
   const submitSchemeOfWorkDelivery = () =>{
    let enrolment = [...enrollmentList.value.filter(student => student.student_number !== null)]

    const dateString = "2024-11-22 03:00:00 +0300 EAT";
// Remove the "EAT" or any non-parsable text
const cleanDateString = dateString.replace(" EAT", ""); // Removes EAT
const dated = new Date(cleanDateString);
let formattedDate = dated.toISOString().split('T')[0];


   let formData = {
      stream_number: form.stream_number,
      date: formattedDate,
      time: form.time,
      teacher_number: form.teacher_number,
      sessions : [ {
      comment: form.comment,
      time: form.time,
      step_number: selectedStep.value,
      students: enrolment ,
   } ]
}

formData.number = sessionNum.value
// alert(JSON.stringify(formData))
schemeOfWorkStore.updateCurriculumDelivery(formData)
}


watch(
   () => schemeOfWorkStore.updateCurriculumDeliveryResponse,
   async (data) => {
   if (data) {
   notificationStore.successToast("success", data.message)
   }
   },
   {deep: true}
   )

   
</script>
<template>
  <!-- {{ studentsInASessionDataInfo }} -->
    <!-- {{ sessionNum }} -->

   <div>
            <div class="row mb-3">
               <div class="col-3"></div>
               <div class="col-3"></div>
               <div class="col-3"></div>
               <div class="col-3">
                  <PaginationTemplate
                     v-model:perPage="per_page"
                     :per_page="per_page"
                     :total_items="total_items"
                     :total_rows="total_rows"
                     ></PaginationTemplate>
               </div>
            </div>
            <div
               class="w-full overflow-auto max-h-[820px] scrollbar-thin"
               @scroll="onScroll">
               <div class="row">
                  <div class="col-lg-8">
                     <table
                        class="table table-hover caption-top table-sm table-striped"
                        style="font-size: 13px !important;"
                        >
                        <thead>
                           <tr>
                              <th>#</th>
                              <th>ADN</th>
                              <th>Student</th>
                              <th></th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="(enrolData,index) in enrollmentList" :key="index" >
                              <td>
                              
                                 <input type="checkbox" 
                                    v-model="enrolData.student_number"
                                       :true-value="enrolData.studentNumber"
                                       :false-value="null"
                                    >
                              </td>
                              <td>{{ enrolData.adn }}</td>
                              <td style="text-transform: capitalize;">
                                 <div class="flex flex-row items-center">
                                    <div class="text-center">
                                       <img v-if="enrolData?.photo" :src="enrolData?.photo" alt="photo" class="w-[40px] h-[40px] border rounded-full"/>
                                       <div v-else class="m-auto">
                                          <i class="bi-person-circle text-[40px] text-[#8a8888]"></i>
                                       </div>
                                    </div>
                                    <div class="ml-2" style="text-transform: capitalize;">{{ enrolData.studentName}}</div>
                                 </div>
                              </td>
                              <td>
                                 <div class="mb-3">
                                    <span v-if="!showV"  class="link link-primary cursor-pointer" @click="openCommentField(enrolData.adn)">
                                    <i class="bi bi-chevron-double-right"></i> comment </span>
                                    <span v-if="showV" class="link link-primary cursor-pointer" @click="closeCommentField(enrolData.adn)">
                                    <i  class="bi bi-chevron-double-down"></i> comment </span>
                                    <textarea
                                       v-if="adn_no === enrolData.adn && showV"
                                       class="form-control"
                                       style="height: 100px"
                                       v-model="enrolData.comment"
                                  
                                       ></textarea>
                                       {{ enrolData.comment }}
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  <div class="col-lg-4 pt-4">       
                    <div class="m-2 ">
                        <label  class="form-label">Time</label>
                        <input
                          type="time"
                          class="form-control"
                          placeholder="Enter time"
                          :value="form.time"
                            required
                          />
                    </div>

                    <div class="m-2">
                        <label  class="form-label">General Comment</label>
                        <textarea            
                          class="form-control"
                          rows="2"
                            :value="form.comment"
                          
                          placeholder="Enter comment"
                          ></textarea>
                    </div>
                    <div class="m-2">
                        <button
                          class="btn btn-primary mb-2 btn-sm text-sm"
                          style="float: right"
                          @click="submitSchemeOfWorkDelivery"
                          >
                        Submit
                        </button>
                    </div>
                  </div>
               </div>
            </div>
         </div>
         
  </template>
<style scoped>
   .buttonStyle {
   font-size: 12px;

   }
</style>