<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
import PromoteStudent from "@/main/settings/promotion/PromoteStudent.vue";
import {usePromotionStore} from "@/main/settings/promotion/store/promotion.js"
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import AppModal from "@/components/AppModal.vue";
import FileUploader from "@/components/FileUploader.vue";
import {useRouter} from "vue-router";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";

const routerData = useRouter()

let streamNumber = "Hhheheh"
let campusClassNumber = "hdhdhdhdh"

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const enrollmentList = ref( [])
const  notificationStore  = useNotificationStore()
const enrollmentStore = useEnrolmentStore()
const promotionStore = usePromotionStore()

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
const uploadDialog = ref(false)
const total_items = ref(0)
const total_rows = ref(0)
const studentPhoto = ref(null)
const studentNumber = ref(null)
const schoolData = ref(null)
const schemeOfWorkStore = useSchemeOfWorkStore()
let profile = localStorage.getItem("userProfile")
const comment = ref(null)

const form = reactive({
stream_number:"",
// student_number:[],
comment:null,
date:null,
time:null,
teacher_number:null,
lessson_plan_step_numbers:null,
students: []
})


const props = defineProps({
schoolInfoData:{},
selectedStepNumbers:[]
});


onMounted(() => {
schoolStore.fetchSchools()
doFetchEnrollent()
getSchoolInfo()
getSteps()
getTeacherNumber()
}
)

const getSchoolInfo = () =>{
let draft = props.schoolInfoData
if(draft){
schoolData.value = draft
getStream(draft.class_number)
}
}

const getSteps = () =>{
   let draftData = props.selectedStepNumbers
   if(draftData){
      form.lessson_plan_step_numbers = draftData
   }
}

const getTeacherNumber = () => {
if (profile) {
  let user = JSON.parse(profile)
  form.teacher_number = user.number
}
}

watch (
() => props.schoolInfoData,
async (data) => {
if(data){
getSchoolInfo()
}
}
)

watch (
() => props.selectedStepNumbers,
async (data) => {
if(data){
getSteps()
}
}
)

const getStream = () =>{
classStore.fetchClassLevel({campusCurriculumNumber: props.schoolInfoData.curriculumNumber, campusLevelNumber: props.schoolInfoData.level})
}


const filterByStream = () => {
doFetchEnrollent()
}


const doFetchEnrollent = (schoolN) =>{
let schoolInfo = JSON.parse(localStorage.getItem("currentSchoolInfo") )
let data = {
page: 1,
per_page: per_page.value,
study_period_number:"",
school_number:schoolInfo.number,
campus_number: "",
campus_class_number:"",
stream_number:"",
academic_year_number:"",
status:""
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
study_period_number:"",
school_number:schoolInfo.number,
campus_number: "",
campus_class_number:"",
stream_number:streamNumber,
academic_year_number:"",
status:""
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

// watch(
// () => campusStore.campusClassesResponse,
// async (data) => {
// if (data) {
// classList.value = data.data
// }
// },
// {deep: true}
// )
const classNumber = props.schoolInfoData.class_number;
const streamListData = ref([])

watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
        
        const curriculum =data.data.find(item => 
        item.classes.some(classItem => classItem.number === classNumber)
    );

    if (!curriculum) {
        return `Class with class_number ${classNumber} not found.`;
    }

   //  const classItem = curriculum.classes.find(classItem => classItem.number === classNumber);
   //  alert(JSON.stringify(classItem))
    streamListData.value = curriculum.classes.find(classItem => classItem.number === classNumber)

      }
    },
    {deep:true}
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
() => academicYearStore.academicYearByCampusResponse,
async (data) => {
if (data) {
academicYearList.value = data.data
if(data && data.data){
let studyData = data.data
if(studyData && (studyData.length > 0)){
studyPeriodList.value = studyData[0].studyPeriod
}
}
}
}
)


const submitSchemeOfWorkDelivery = () =>{
   alert(JSON.stringify(form))
   schemeOfWorkStore.newCurriculumDelivery(form)
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





// Toggle a student in form.students based on checkbox
function toggleStudent(student_number) {
  const index = form.students.findIndex(student => student.student_number === student_number);
  if (index === -1) {
    form.students.push({ student_number, comment: "" });
  } else {
    form.students.splice(index, 1);
  }
}

// Retrieve the comment for a specific student
function getStudentComment(student_number) {
  const student = form.students.find(student => student.student_number === student_number);
  return student ? student.comment : "";
}

// Update the comment for a specific student
function updateStudentComment(student_number, comment) {
  const student = form.students.find(student => student.student_number === student_number);
  if (student) {
    student.comment = comment;
  } else {
    form.students.push({ student_number, comment });
  }
}
</script>
<template>

<div>
<!-- {{ schoolData }} -->
  <!-- {{ form.lessson_plan_step_numbers }} -->
<div class="row mt-3">
<div class="col-12">
   <div class="row">
      <div class="col-12">
         <div class="mt-3">
            <div class="row mx-auto">
               <div class="row">
                  <div class="col-3">
                     <div class="mb-2">
                        <select
                           v-model="form.stream_number"
                           class="form-select form-select-sm" required
                           style="box-shadow: none;"
                           @change="filterByStream()"
                           >
                           <option disabled value="">-Filter By Stream-</option>
                           <option v-for="(slist, index) in streamListData.streams" :key="index" :value="slist.stream_number">{{ slist.name }}
                           </option>
                        </select>
                     </div>
                  </div>
                  <div class="col-3"></div>
                  <div class="col-3"></div>
                  <div class="col-3">
                     <PaginationTemplate
                        v-model:perPage="per_page"
                        :per_page="per_page"
                        :total_items="total_items"
                        :total_rows="total_rows"
                        @perPageChanged="doFetchEnrollent"></PaginationTemplate>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
</div>
</div>
<div v-if="loading" class="text-center my-1">
<div class="spinner-border" role="status">
<span class="sr-only">Loading...</span>
</div>
</div>
<div v-else-if="enrollmentList.length === 0" class="text-center my-4">
<p>There is no data found</p>
</div>
<div v-else>
<div
class="w-full overflow-auto max-h-[520px] scrollbar-thin"
@scroll="onScroll">
<!-- {{form.student_number}} -->

<div class="row">
   <div class="col-lg-8">
 <table
   class="table table-hover caption-top mt-1 table-sm table-striped"
   style="font-size: 13px !important;"
   >
   <thead >
      <tr>
         <th>#</th>
         <th>ADN</th>
         <th>Student</th>
         <th>Comment</th>
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
      <label class="form-label">Comment</label>
      <textarea
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

<div class="col-lg-4">
   <div class="card shadow-sm mb-4 mt-6">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">..</h5>
      </div>
      <form @submit.prevent="submitSchemeOfWorkDelivery">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Date</label>
          <input placeholder="" type="date" v-model="form.date" required class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label">Time</label>
          <input placeholder="" type="time" v-model="form.time" required class="form-control">
        </div>

        <div class="mb-3">
          <label class="form-label">Comment</label>
          <textarea v-model="form.comment" class="form-control" style="height: 100px"></textarea>
        </div>

          <!-- Save Button -->
    <div class="text-end mt-4">
      <button type="submit" class="btn btn-primary" >
        Submit
        <div class="spinner-border spinner-border-sm ms-2" role="status" v-if="buttonLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
    </div>
      </div>
   </form>
    </div>
</div>

   </div>



</div>
</div>
</template>
<style scoped>
</style>