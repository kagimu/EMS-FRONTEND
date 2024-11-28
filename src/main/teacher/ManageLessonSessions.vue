<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import NewLessonPlanReference from "@/main/dashboard/curriculum/schemeOfWork/NewLessonPlanReference.vue";
   import { useSchemeOfWorkStore } from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
   import LessonPlanDetailsPdf from "@/main/dashboard/curriculum/schemeOfWork/LessonPlanDetailsPdf.vue";
   import useCommonsStore from "@/composables/useCommons.js";
   import AppModal from "@/components/AppModal.vue";
   import ListOfStudentsInStream from "./students/ListOfStudentsInStream.vue";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
   import StudentsInASession from "./StudentsInASession.vue";
   import CurriculumProgressBar from  "@/main/teacher/CurriculumProgressBar.vue";

   
   import DatePicker from '@vuepic/vue-datepicker';
   import '@vuepic/vue-datepicker/dist/main.css';
   
   const dialog = ref(false);
   const fullscreenMode = ref(false);
   const referenceDialog = ref(false);
   const exportLoader = ref(false);
   const lessonPlanRef = ref(null);
   const lessonPlanDetailsInfo = ref(null);
   const scheme_sub_topic_number = ref(null);
   const schemeOfWorkStore = useSchemeOfWorkStore();
   const commons = useCommonsStore();
   const schoolInfoData = ref([]);   
   const streamList = ref([])
   const promDialog = ref(false)
   const loading = ref(false)
   const page = ref(1)
   const per_page = ref(20)
   const uploadDialog = ref(false)
   const total_items = ref(0)
   const total_rows = ref(0)
   const enrollmentList = ref( [])
   const  notificationStore  = useNotificationStore()
   const enrollmentStore = useEnrolmentStore()
   const schoolNumber = ref(null)
   const classStore = useClassesStore()
   const classNumber = ref(null);
   const classList = ref([])
   const selectAll = ref(false);
   const selectedStep = ref(null);
   const draftInfo = ref({})
   const selectedStudentEnrolment = ref([])
   const deliveryProgressData = ref([])
   
   let profile = localStorage.getItem("userProfile")
   const comment = ref(null)
   const session = ref(null)
   const adn_no = ref(null)
   const showV = ref(false)
   const classSessionStudentsData =ref([])
   const openCommentField = (adn) =>{
   adn_no.value = adn
   showV.value = true
   }
   
   const sessionListData = ref([])
   const closeCommentField = (adn) =>{
   adn_no.value = adn
   showV.value = false
   }
   
   
   const props = defineProps({
     lessonPlanInfo: {},
     schoolInfo: {}
   });
   
   const form = reactive({
   stream_number:"",
   comment:null,
   date:null,
   time:null,
   teacher_number:null,
   step_number:null,
   students: [],
   })
   
const isMaximized = ref(false);
const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;
}

   
   onMounted(() => {
     filterLessonPlanData();
     filterDraftData();
     getTeacherNumber()
     
   })
 
   const getTeacherNumber = () => {
   if (profile) {
     let user = JSON.parse(profile)
     form.teacher_number = user.number
   }
   }
   
   const filterDraftData = () => {
     let draft = props.schoolInfo;
     if (draft) {
       draftInfo.value = draft;
       schoolNumber.value = draft.school_number
       classNumber.value = draft.class_number
       getStream(draft)
     }
   }
   
   const filterLessonPlanData = async () => {
     let draft = props.lessonPlanInfo;
     if (draft) {
       scheme_sub_topic_number.value = draft.number;
       await schemeOfWorkStore.fetchLessonPlanDetails(draft.number);
     }
   };
   
   const exportLessonPlanPdf = () => {
     exportLoader.value = true;
     schemeOfWorkStore.exportPdf(commons.initializePdfData("Lesson Plan", lessonPlanRef.value.innerHTML));
   };
   
   const showHideReferenceForm = () => {
     referenceDialog.value = !referenceDialog.value;
   };
   
   
   watch(

     () => props.lessonPlanInfo,
     async (data) => {
       if (data) {
         filterLessonPlanData();
       }
     }
   );
   
   watch(
     () => schemeOfWorkStore.lessonPlanResponse,
     (data) => {
       if (data) {
         lessonPlanDetailsInfo.value = data.data;
       }
     },
     { deep: true }
   );
   
   watch(
     () => schemeOfWorkStore.exportPdfResponse,
     (data) => {
       if (data) {
         exportLoader.value = false;
       }
     },
     { deep: true }
   );
   
   
   const getStream = (draftInfo) =>{
   classStore.fetchClassLevel({campusCurriculumNumber: draftInfo.curriculumNumber, campusLevelNumber: draftInfo.level})
   }
   
   
   const streamListData = ref([])
   
   watch(
       () => classStore.classLevelInfoResponse,
       async (data) => {
         if(data){
           classList.value = data.data
           const curriculum =data.data.find(item => 
           item.classes.some(classItem => classItem.number === classNumber.value)
       );
   
       if (!curriculum) {
           return `Class with class_number ${classNumber.value} not found.`;
       }
   
       streamListData.value = curriculum.classes.find(classItem => classItem.number === classNumber.value)
   
         }
       },
       {deep:true}
   )
   
   const streamNum = ref(null)
   
   const filterByStream = (streamN) => {
     streamNum.value = streamN
   doFetchEnrollent()

   let data = {
           stream_number:streamN
         }
         schemeOfWorkStore.fetchClassSessions(data)
         schemeOfWorkStore.fetchCurriculumDeliveryProgress(data)
   }
   
  

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
   
   const index = enrollmentList.value.findIndex(object => object.number === list.number);
   
   if (index === -1) {
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
   () => classStore.byCampusClassStreams,
   async (data) => {
   if (data) {
   streamList.value = data.data
   }
   },
   {deep: true}
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
   
   
   const submitSchemeOfWorkDelivery = () =>{
   
      let formData = {
         stream_number: form.stream_number,
         date: form.date,
         time: form.time,
         teacher_number: form.teacher_number,
         sessions : [ {
         comment: form.comment,
         time: form.time,
         step_number: selectedStep.value,
         students: form.students 
      } ]
   
      }
     

      schemeOfWorkStore.newCurriculumDelivery(formData)
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

watch(
() => schemeOfWorkStore.curriculumDeliveryResponse,
async (data) => {
if (data) {
   notificationStore.successToast("Success", data.message);
}
},
{deep: true}
)

 
const fetchSessionList = (data) => {
     if(data) {
       let current_page = data.page
       page.value = current_page
     
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
   
           const index = sessionListData.value.findIndex(object => object.number === list.number);
   
           if (index === -1) {
             sessionListData.value.push(list);

           }
         })
       }
   
     }
   }

   watch (
       () => schemeOfWorkStore.classSessionResponse,
       async (data) => {
         if(data){
           fetchSessionList(data)
           alert(JSON.stringify(data))
         }
       },
       {deep:true}
   )


   const dofetchStudentSessionsData = () => {
      let data = {
        page: 1,
        per_page: per_page.value,
        session_number:selectedStep.value,
      }
      schemeOfWorkStore.fetchStudentsInSession(data)
  }


watch (
       () => selectedStep.value,
       async (data) => {
         if(data){
            dofetchStudentSessionsData()
         }
       }
   )

   watch(
    () => schemeOfWorkStore.classSessionStudentsResponse,
    async (data) => {
      if(data){
        
        classSessionStudentsData.value = data.content
        data.content.forEach(studentD => {
       form.students.push({ student_number:studentD.number, comment: "" });  
    })

}
    }

  )

  const enrolmentInfo = (data) => {
      if(data){
      //  alert(JSON.stringify(data)) 
        selectedStudentEnrolment.value = data
      }
  }
   

   
  watch(
    () => schemeOfWorkStore.curriculumDeliveryProgressResponse,
    async (data) => {
      if(data){
        deliveryProgressData.value = data
      }
    }

  )

  
</script>
<template>
    {{ sessionListData }}
      <!-- {{ classSessionStudentsData }} -->
        <!-- {{ selectedStudentEnrolment }} -->
          <!-- {{deliveryProgressData}} -->
           
   <div :class="{ fullscreen: isMaximized }" > 

      <div class="row mx-auto mb-4"> 
         <div class="row">
            <div class="col-3">
               <div class="mb-0 mt-1">
                <label  class="form-label">Stream</label>
                  <select
                     v-model="form.stream_number"
                     class="form-select form-select-sm" required
                     style="box-shadow: none;"
                     @change="filterByStream(form.stream_number)"
                     >
                     <option disabled value="">-Filter By Stream-</option>
                     <option v-for="(slist, index) in streamListData.streams" :key="index" :value="slist.stream_number">{{ slist.name }}
                     </option>
                  </select>
               </div>
            </div>
            <div class="col-3">
              <div >
                  <label  class="form-label">Date</label>
                  <input
                    type="date"
                    class="form-control"
                    placeholder="Enter Date"
                    v-model="form.date"
                    required
                    />
              </div>
                                
            </div>
            <div class="col-3">
              <div >
                  <label  class="form-label">Time</label>
                  <input
                    type="time"
                    class="form-control"
                    placeholder="Enter time"
                    v-model="form.time"
                    required
                    />
              </div>
            </div>
            <div class="col-3">
              <button class="btn btn-outline-primary mt-4 " @click="toggleMaximize" style="float: right">
         <i :class="isMaximized ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen ' "></i> 
        </button>

            </div>
    
         </div>
      </div>
      <CurriculumProgressBar :progressInfoData="deliveryProgressData"></CurriculumProgressBar>


      <div v-if="lessonPlanDetailsInfo" v-for="(lesson, index) in lessonPlanDetailsInfo.concepts" :key="index">
         <div class="mb-4 mt-4">
            <div class="mb-3">
               <h5>
                  <b class="mr-3 text-sm">{{ lesson.code }}.</b> {{ lesson.concept_name }}
               </h5>
            </div>
            <div>
              <!-- {{ sessionListData }} -->
             <ul class="list-group" v-for="(item, index) in sessionListData" :key="index" >   
              <!-- {{ item.number }}   -->
                     <li v-for="(lsn, idx) in item.steps" :key="idx" class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">  
                           <input  type="radio" :value="item.number" v-model="selectedStep" class="form-check-inpu" style="width: 20px; height: 20px;" id="step-{{ item.number }}" />
                           <label class="form-check-label flex-grow-1 mx-2" :for="'step-' + item.number">
                           {{lsn.name }}
                           </label>
                        </div>

                        <div v-if="selectedStep === item.number" class="mt-3">
                           
                           <div class="card">
                            <!-- {{classSessionStudentsData}} -->
                              <div class="card-body">
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
                                    class="w-full overflow-auto max-h-[620px] scrollbar-thin"
                                    @scroll="onScroll">
                                    <div class="row">
                                       <div class="col-lg-12">
                                        

                                          <StudentsInASession 
                                              :streamNumber="form.stream_number" 
                                              :schoolNum="schoolNumber" 
                                              :studentsInASessionData="classSessionStudentsData" 
                                              :sessionInfoData="lsn"
                                              :stepNumber="lsn.number"
                                              :sessionNumber="item.number"
                                              :teacherNumber="item.teacher_number"
                                              :generalDate="lsn.date"
                                              :generalTime="lsn.time"
                                              ></StudentsInASession>
                                       </div>
                                     
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </li>
                </ul>
            </div>
         </div>
         <hr />
      </div>
      
      </div>

</template>
<style scoped>
   .buttonStyle {
   font-size: 12px;
   padding: 2px 7px;
   }
   .td {
   text-transform: capitalize !important;
   }
   .modal {
   display: none;
   }
   .modal.show {
   display: block;
   }
   .modal-dialog {
   margin-top: 2rem; /* Adjust this value as needed for more spacing from the top */
   }
   .step-row {
   display: flex;
   align-items: center;
   border: 1px solid #dee2e6;
   border-radius: 5px;
   padding: 10px;
   background-color: #f9f9f9;
   }
   textarea {
   resize: none;
   }
   .steps-container {
   max-width: 800px;
   margin: 0 auto;
   }
   .list-group-item {
   border: 1px solid #dee2e6;
   border-radius: 5px;
   margin-bottom: 10px;
   }
   .card {
   border: 1px solid #cce5ff;
   border-radius: 5px;
   background-color: #f8f9fa;
   }
   .card-title {
   font-size: 16px;
   margin-bottom: 15px;
   }

   .fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  margin: 0;
  padding: 20px;
  background: white;
  border-radius: 0;
  overflow-y: auto;
  transition: all 0.3s ease-in-out;
}

   .accordion {
   margin: 0px;
   }
   .group-title {
   margin: 10px 0;
   font-size: 14px;
   font-weight: bold;
   color: #333;
   }
   .accordion-item {
   border: 1px solid #ddd;
   border-radius: 5px;
   margin-bottom: 5px;
   }
   .accordion-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   padding: 5px;
   background-color: #f9f9f9;
   cursor: pointer;
   border: none;
   outline: none;
   }
   .header-info {
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   }
   .accordion-body {
   padding: 5px;
   background-color: #fff;
   border-top: 1px solid #ddd;
   }
</style>