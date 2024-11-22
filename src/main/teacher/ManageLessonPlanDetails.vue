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
   const draftInfo = ref({});
   
   let profile = localStorage.getItem("userProfile")
   const comment = ref(null)
   const session = ref(null)
   const adn_no = ref(null)
   const showV = ref(false)
   const openCommentField = (adn) =>{
   adn_no.value = adn
   showV.value = true
   }
   
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
   
   
   
   
   onMounted(() => {
     filterLessonPlanData();
     filterDraftData();
     getTeacherNumber()
     
   });
   
   
   // const getSteps = () =>{
   //    let draftData = props.selectedStepNumbers
   //    if(draftData){
   //       form.step_number = draftData
   //    }
   // }
   
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
   };
   
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
   
  //  const toggleAll = () => {
  //    if (selectAll.value) {
  //      selectedStep.value = lessonPlanDetailsInfo.value.concepts.flatMap((concept) =>
  //        concept.steps.map((step) => step.number)
  //      );
  //    } else {
  //      selectedStep.value = [];
  //    }
  //  };
   
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
   
   
// Track maximize/minimize state
const isMaximized = ref(false);

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value;
};


   
</script>
<template>
   <div class="text-sm">
      <div class="flex justify-content-between" style="border-bottom: 1px solid #dee2e6; padding-bottom: 15px; margin-bottom: 25px;">
         &nbsp;
         <button type="button" class="btn btn-sm buttonStyle btn-success mr-2" style="margin-right: 5px;" @click="exportLessonPlanPdf">
            <i style="font-size: 15px;" class="bi-file-earmark-pdf mr-2"></i>
            Export PDF
            <div class="spinner-border spinner-border-sm" role="status" v-if="exportLoader">
               <span class="visually-hidden">Loading...</span>
            </div>
         </button>
      </div>
      <div class="row mx-auto">
         <div class="col col-6">
            <table class="mt-4">
               <tr>
                  <td style="width: 30%;"><b class="mr-5">Strand:</b></td>
                  <td>
                     <div>{{ lessonPlanInfo.strand_name }}</div>
                  </td>
               </tr>
               <tr>
                  <td><b class="mr-5">Topic:</b></td>
                  <td>
                     <div>{{ lessonPlanInfo.topic_name }}</div>
                  </td>
               </tr>
               <tr>
                  <td><b class="mr-5">Sub Topic:</b></td>
                  <td>
                     <div class="mt-3 mb-2" style="font-size: 19px;"><span class="text-blue-900">{{ lessonPlanInfo.name }}</span></div>
                  </td>
               </tr>
               <tr>
                  <td><b class="mr-5">Estimated Time:</b></td>
                  <td>
                     <div>{{ lessonPlanInfo.estimated_time }} (Min)</div>
                  </td>
               </tr>
            </table>
         </div>
         <div class="col col-6">
            <button @click="showHideReferenceForm" type="button" class="btn btn-sm btn-secondary border-0 mt-2">
            <i style="font-size: 15px;" class="bi-plus mr-1"></i>
            {{ referenceDialog ? 'Hide Reference' : 'Add Reference' }}
            </button>
            <div v-if="referenceDialog">
               <new-lesson-plan-reference v-if="lessonPlanDetailsInfo" :lesson_plan_number="lessonPlanDetailsInfo.number"></new-lesson-plan-reference>
            </div>
            <div>
               <table style="width: 100%; margin-top: 3px" v-if="lessonPlanDetailsInfo">
                  <thead>
                     <tr>
                        <td>#</td>
                        <td>Code</td>
                        <td>Name</td>
                     </tr>
                  </thead>
                  <tr v-for="(reference, idx) in lessonPlanDetailsInfo.references" :key="idx">
                     <td>{{ idx + 1 }}</td>
                     <td>{{ reference.code }}</td>
                     <td>{{ reference.name }}</td>
                  </tr>
               </table>
            </div>
         </div>
      </div>
      <div class="mt-10 mb-2" style="font-size: 18px;">
         <p>Lesson Plan / Concept(s)</p>
      </div>
      <div class="row">
         <div class="col-lg-6 content">
            <div><b class="mr-5">Concept</b></div>
         </div>
         <div class="col-lg-6 content"></div>
      </div>
      <hr />

   <div :class="{ fullscreen: isMaximized }"> 

      <div class="row mx-auto">
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
      <hr/>
      <div v-if="lessonPlanDetailsInfo" v-for="(lesson, index) in lessonPlanDetailsInfo.concepts" :key="index">
         <div class="mb-4">
            <div class="mb-3">
               <h5>
                  <b class="mr-3 text-sm">{{ lesson.code }}.</b> {{ lesson.concept_name }}
               </h5>
            </div>
            <div>
               <div class="">
                  <ul class="list-group">
                     <li v-for="(lsn, idx) in lesson.steps" :key="idx" class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">  
                           <input  type="radio" :value="lsn.number" v-model="selectedStep" class="form-check-inpu" style="width: 20px; height: 20px;" id="step-{{ lsn.number }}" />
                           <label class="form-check-label flex-grow-1 mx-2" :for="'step-' + lsn.number">
                           {{ lsn.code + ". " + lsn.step }}
                           </label>
                        </div>

                        <div v-if="selectedStep === lsn.number" class="mt-3">
                           <div class="card">
                              <div class="card-body">
                                 <!-- <ListOfStudentsInStream :schoolInfoData="draftInfo" :selectedStepNumbers="lsn.number"  :streamNumber ="streamNum"/> -->
                                 <div class="row mt-3 mb-3">
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
                                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                                    @scroll="onScroll">
                                    <div class="row">
                                       <div class="col-lg-8">
                                          <table
                                             class="table table-hover caption-top mt-1 table-sm table-striped"
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
                                                      <input type="checkbox"  :value="enrolData.student_number" 
                                                         @change="toggleStudent(enrolData.student_number)">
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
                                                         <div class="ml-2">{{ enrolData.student_surname + " "+ enrolData.student_second_name + " "  + enrolData.student_other_name }}</div>
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
                                                            @input="updateStudentComment(enrolData.student_number, $event.target.value)"
                                                            ></textarea>
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
                                                v-model="form.time"
                                                required
                                                />
                                          </div>

                                          <div class="m-2">
                                             <label  class="form-label">General Comment</label>
                                             <textarea            
                                                class="form-control"
                                                rows="2"
                                                v-model="form.comment"
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
                           </div>
                        </div>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
         <hr />
      </div>
      <div style="display: none">
         <div ref="lessonPlanRef">
            <LessonPlanDetailsPdf :lessonPlanInfo="lessonPlanInfo"></LessonPlanDetailsPdf>
         </div>
      </div>
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
}
</style>