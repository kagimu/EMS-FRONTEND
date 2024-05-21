<template>
   <div>
      <!-- {{ studentNumber }} -->
      <!-- {{ adm }} -->
      <form @submit.prevent="Enrol()">
         <div class="row">
            <div class="col-4">
            <div class="mb-2 ">
               <label class="textColor"><small>School</small> </label>
               <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.school_number"
                  @change="fetchCampuses(form.school_number)"
                  >
                  <option disabled value="">Select School</option>
                  <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                  </option>
               </select>
            </div>
            <div class="mb-2">
               <label class="textColor"><small>Campus</small>  </label>
               <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.campus_number" required
                  @change="fetchClasses(form.campus_number)"
                  >
                  <option disabled value="">Select campus</option>
                  <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                  </option>
               </select>
            </div>
            <div class="mb-2">
               <label class="textColor"><small>Class</small> </label>
               <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.campus_class_number"
                  @change="fetchAcademicYear(form.campus_class_number)"
                  >
                  <option disabled value="">Select class</option>
                  <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                  </option>
               </select>
            </div>
            <div class="mb-2">
               <label class="textColor"><small>Stream</small> </label>
               <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.stream_number"
                  >
                  <option disabled value="">Select Stream</option>
                  <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}
                  </option>
               </select>
            </div>
            <div class="mb-2">
               <label class="textColor"><small>Academic Year</small> </label>
               <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.academic_year_number"
                  >
                  <option disabled value="">Select Year</option>
                  <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
               </select>
            </div>
            <div class="mb-2">
               <label class="textColor">
                  <small>Study Period</small> 
                  <!-- {{ studyPeriodList }} -->
               </label>
               <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.study_period_number"
                  >
                  <option disabled value="">Select</option>
                  <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
               </select>
               
            </div>
            <div class="mb-2">
               <label class="textColor"><small>Enrolment Date</small> 
               </label>
               <input type="date" class="form-control" v-model="form.enrollment_date">
            </div>
         </div>
         

         <div class="col-8">
            <p class="" style=""><small>Tick <i class="bi bi-check" style="color:red"> </i>brought Item on the List </small> </p>
            <div class="col-12">
               <div class="mb-2">
                  <!-- <ul style="display: none;">
                     <li v-for="(item, indx) in itemsData" :key="indx"
                        class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                        <div class="d-flex align-items-center" style="font-size: 12px;">
                           <input v-model="selectedItems" 
                              class="form-check-input me-2" 
                              type="checkbox" 
                              :value="item.item_number" 
                              @change="toggleSelection(item)"
                              aria-label="..." />
                           {{ item.item_name }} {{ item.cost }}
                           <input type="text" 
                           @keypress="commons.numbersOnlyValidator($event)"
                            maxlength="10"
                              class=" ml-1" 
                              placeholder="1"
                              style="width: 30px; font-size: 13px; border: 1px solid black;text-align: center;" 
                              v-model="item.quantity"
                               
                              @input="updateQuantity(item, $event)">
                        </div>
                     </li>
                  </ul> -->

                  <table class="table table-hover caption-top mt-1 table-sm table-striped" style="font-size: 13px;">
  <thead>
    <tr>
      <th>#</th>
      <th>Item Name</th>
      <th>Cost</th>
      <th>Quantity</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item, indx) in itemsData" :key="indx">
      <td>
        <input v-model="selectedItems" 
               class="form-check-input" 
               type="checkbox" 
               :value="item.item_number" 
               @change="toggleSelection(item)"
               aria-label="..." />
      </td>
      <td style="font-size: 12px;">{{ item.item_name }}</td>
      <td style="font-size: 12px;">{{ item.cost }}</td>
      <td>
        <input type="text" 
               @keypress="commons.numbersOnlyValidator($event)" 
               maxlength="10"
               class="form-control" 
               placeholder="1"
               style="width: 50px; font-size: 13px; text-align: center;" 
               v-model="item.quantity" 
               @input="updateQuantity(item, $event)">
      </td>
    </tr>
  </tbody>
</table>

               </div>
            </div>
         </div>
      </div>

         <hr>
         <div class="flex justify-content-end mt-2" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
            <small>Enrol <i class="bi bi-box-arrow-in-right"></i></small>
            <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
               role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
            </span>
            </button>
         </div>
      </form>
   </div>
</template>
<script setup>
   import {onMounted, reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import {useEnrolmentStore} from "@/main/dashboard/enrollment/store/enrollment.js"
   import VueDatePicker from '@vuepic/vue-datepicker';
   import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
   import useCommonsStore from "@/composables/useCommons.js";
   
   const commons = useCommonsStore()
     
   const  notificationStore  = useNotificationStore()
   const buttonLoader = ref(false)
   const errorMessage = ref(null)
   const enrolmentStore = useEnrolmentStore()
   const studentN = ref(null)
   const admissionStore = useAdmissionStore()
   
   const campusList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const school_number = ref(null)
   const assessmentStore = useAssessmentStore()
   const academicYearStore = useAcademicYearStore()
   const academicYearList = ref([])
   const studyPeriodList  = ref([])
   const classStore = useClassesStore()
   const streamList = ref([])
   const currentYear = ref((new Date()).getFullYear());
   const date = ref();
   const format = (date) => {
     const item = date.getDate();
     const month = date.getMonth() + 1;
     const year = date.getFullYear();
     return `Selected date is ${item}/${month}/${year}`;
   }
   
   const itemsData = ref([])
   const quantity = ref(null)
   const selectedItems = ref([])
   
   const props = defineProps({
     studN: String,
     studentNumber:String,
     adm:String
   })
   
   
   onMounted(() => {
           schoolStore.fetchSchools()
           enrolmentStore.fetchCheckListItems(props.adm)
       }
   )
   
       watch(
       () => enrolmentStore.checkListItemsResponse,
       async (data) => {
         if(data){
          itemsData.value=data.data
         }
       },
       {deep:true}
   )
   
     const form = reactive({
     student_number:props.studentNumber,
     academic_year_number: null,
     study_period_number: null,
     campus_class_number: null,
     campus_number: null,
     stream_number:null,
     school_number:null,
     enrollment_date:null,
     academic_year_number:null,
     status:"active",
     })
        
   
   //enrol student function
     const Enrol = () =>{
      buttonLoader.value=true

      const ItemDataToSubmit = {
    items: selectedItems.value
      .map(({ item_number, quantity, brought }) => ({
        item_number,
        quantity: parseInt(quantity, 10),
        brought
      }))
      .filter(item => item.item_number && item.quantity !== undefined && item.brought !== undefined)
   }
   
   let enrollmentData = reactive({
     student_number:props.studentNumber,
     academic_year_number:form.academic_year_number,
     study_period_number:form.study_period_number,
     campus_class_number:form.campus_class_number,
     campus_number:form.campus_number,
     stream_number:form.stream_number,
     school_number:form.school_number,
     enrollment_date:form.enrollment_date,
     academic_year_number:form.academic_year_number,
     status:"active",
     ...ItemDataToSubmit
   })

      //  alert(JSON.stringify(enrollmentData))
       enrolmentStore.newEnrolment(enrollmentData)
     }
   
     
     watch (
       () => enrolmentStore.newsEnrolmentResponse,
       async (data) => {
         if(data){
            buttonLoader.value=false
           notificationStore.successToast("Success", data.message)
         }
       },
       {deep:true}
     )
     
     watch (
       () => enrolmentStore.errorMessage,
       async (data) => {
         if(data){
           errorMessage.value = data.message
           notificationStore.errorToast("Error",data.message)
         }
       },
       {deep:true}
     )
   
     const fetchCampuses = (school_number) => {
       campusStore.fetchCampuses(school_number)
   }
   
   const fetchClasses = (campus_number) => {
       campusStore.fetchClassesByCampus(campus_number)
   }
   
   
   //fetchacadmicYear
   const fetchAcademicYear = (campusN) =>{
   // alert(campusN)
   academicYearStore.fetchAcademicYearByCampus(campusN)
   classStore.fetchClassStreams(campusN)
   
   }
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
       },
       {deep: true}
   )
   
   
   //selecting Item 
   const toggleSelection = (item) => {
   const index = selectedItems.value.findIndex(selected => selected.item_number === item.item_number);
   if (index === -1) {
    selectedItems.value.push({ ...item, brought: true });
   } else {
    selectedItems.value.splice(index, 1);
   }
   }
   
   const updateQuantity = (item, event) => {
   const selectedItem = selectedItems.value.find(selected => selected.item_number === item.item_number);
   if (selectedItem) {
    selectedItem.quantity = event.target.value;
   }
   }
   
   
   //watches
     
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
       () => campusStore.campusClassesResponse,
       async (data) => {
           if (data) {
               classList.value = data.data
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
<style scoped>
   .noFocus:focus {
   outline: none 0 !important;
   box-shadow: none;
   -moz-box-shadow: none;
   -webkit-box-shadow: none;
   }
</style>