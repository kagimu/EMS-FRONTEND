
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
   import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
   import {useStudyModeStore} from "@/main/settings/mode-of-study/store/studyMode.js";
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
   import {useBillStore} from "@/main/settings/bills/store/bills.js";

   const modeStudyStore = useStudyModeStore()
   const modeOfSchoolData = ref([])
   const levelStore = useLevelStore()
   const studyPeriodStore = useStudyPeriodStore()
   const commons = useCommonsStore()
   const  notificationStore  = useNotificationStore()
   const buttonLoader = ref(false)
   const errorMessage = ref(null)
   const enrolmentStore = useEnrolmentStore()
   const studentN = ref(null)
   const admissionStore = useAdmissionStore()
   const cateringStore = useCateringStore()
   const feedingGroupData = ref([])
   const campusList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const assessmentStore = useAssessmentStore()
   const academicYearStore = useAcademicYearStore()
   const academicYearList = ref([])
   const studyPeriodList  = ref([])
   const classStore = useClassesStore()
   const streamList = ref([])
   const currentYear = ref((new Date()).getFullYear());
   const curriculumList = ref([])
   const levelList = ref([])
   const campusClassNumber = ref(null)
   const billStore = useBillStore()
   const billableData  = ref([])

   const format = (date) => {
     const item = date.getDate();
     const month = date.getMonth() + 1;
     const year = date.getFullYear();
     return `Selected date is ${item}/${month}/${year}`;
   }
   
   const itemsData = ref([])
   const quantity = ref(null)
   const selectedItems = ref([])
   const selectedBillableItems = ref([])

   
   const props = defineProps({
     studN: String,
     studentNumber:String,
     admissionData:{},
     studentDataInfo:[]
   })

   const form = reactive({
     student_number:props.studentNumber,
     academic_year_number: null,
     study_period_number: null,
     class_number: null,
     campus_number: null,
     stream_number:null,
     school_number:null,
     enrollment_date:null,
     status:"active",
     feeding_group_number:"",
     mode_of_study_number:"",
     curriculumNumber:"",
     bill_number:""
   })
   
   onMounted(() => {
           schoolStore.fetchSchools()
           enrolmentStore.fetchCheckListItems(props?.admissionData?.admission_number)
           getStudentInfoData()
           getModeOfStudyInfo()

       }
   )

   const getBillableDataInfo = () => {
   let data = {
      student_number:props.studentNumber,
      study_period_number: form.study_period_number,
     class_number: form.class_number                                                                    ,
     campus_number:form.campus_number,
     mode_of_study_number:form.mode_of_study_number,
     campus_curriculum_number:form.curriculumNumber
  }
  billStore.fetchDeterminateBillables(data)
   }

   const getModeOfStudyInfo = () =>{
  let data = {
    school_number:form.school_number,
  }
  modeStudyStore.fetchModeOfStudy(data)
}

   const getStudentInfoData = () => {
      let draftData = props.admissionData
      if(draftData.admission_number){
         form.school_number = draftData.campus.school_number

         campusStore.fetchCampuses(form.school_number)
         cateringStore.fetchFeedingGroup(form.school_number)
         if(form.school_number){
            form.campus_number = draftData.student.preferred_campus_number
         }

         if(form.campus_number){
            campusStore.fetchClassesByCampus(form.campus_number)
            form.class_number = draftData.class.number
            form.curriculumNumber = draftData.student.campus_curriculum_number
            fetchCurriculum(form.campus_number)

           
         }

         if(form.curriculumNumber){
            classStore.fetchCampusLevel(form.curriculumNumber)
            form.level = draftData.studyPeriod.campus_level_number
           
         }

         if(form.level){
            academicYearStore.fetchAcademicYearByLevel(form.level)
            form.academic_year_number = draftData.studyPeriod.academic_year_number
            let data = {
               school_number:form.school_number,
               campus_level_number:form.level
            }
            campusStore.fetchClassesBySchool(data)
            form.class_number = draftData.class.number
            campusClassNumber.value	= draftData.stream.campus_class_number
         }

         if(form.class_number){
            fetchStreamAndStudyPeriod(form.class_number)
            academicYearStore.fetchAcademicYearByCampus(form.class_number)
            classStore.fetchClassStreams(form.class_number)
            form.stream_number = draftData.stream.stream_number
            form.academic_year_number=draftData.studyPeriod.academic_year_number
            form.study_period_number=draftData.studyPeriod.study_period_number
         }
      }
   }
   
const getCampusN = (streamN) => {
let data = streamList.value

let no = streamN
campusClassNumber.value = data.find(item => item.stream_number === no)?.campus_class_number;

  }



       watch(
       () => enrolmentStore.checkListItemsResponse,
       async (data) => {
         if(data){
          itemsData.value=data.data
         }
       },
       {deep:true}
   )
   

        
   
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
     campus_class_number:campusClassNumber.value ,
     campus_number:form.campus_number,
     stream_number:form.stream_number,
     school_number:form.school_number,
     enrollment_date:form.enrollment_date,
     feeding_group_number:form.feeding_group_number,
     mode_of_study_number:form.mode_of_study_number,
     status:"active",
     bill_number:form.bill_number,
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
       cateringStore.fetchFeedingGroup(school_number)
       getModeOfStudyInfo()
   }
   
   const fetchCurriculum = (campus_number) => {
       campusStore.fetchClassesByCampus(campus_number)
       levelStore.fetchCampusCurriculum(campus_number)
   }
   

   const fetchLevelClasses = (levelNumber) => {
  academicYearStore.fetchAcademicYearByLevel(levelNumber)
  let data = {
    school_number:form.school_number,
    campus_level_number:levelNumber
  }
  campusStore.fetchClassesBySchool(data)

  classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
}

watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    }
)

   //fetchacadmicYear
   const fetchStreamAndStudyPeriod = (classN) =>{
   // academicYearStore.fetchAcademicYearByCampus(campusN)
   // classStore.fetchClassStreams(campusN)

   let sData = {
     campus_number:form.campus_number,
     class_number:classN,
     campus_curriculum_number:form.curriculumNumber

    }
    classStore.fetchClassStreams(sData)

    
    studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:classN,
        school_number:form.school_number
      } )

   }



   const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
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
   
   watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
      feedingGroupData.value = data.data
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
       () => campusStore.errorMessage,
       async (data) => {
             if (data) {
                 notificationStore.errorToast("Error", data.message)
             }
       },
       {deep: true}
   )

   watch(
    () => modeStudyStore.modeOfStudyInfoResponse,
    async (data) => {
      modeOfSchoolData.value = data.data
    },
    {deep: true}
)
watch(
    () => billStore.billableDeterminateResponse,
    async (data) => {
      if(data){
        let draftData = data.data 
        billableData.value = draftData.billable_items	
        form.bill_number = draftData.billable_number
      }
    },
    {deep:true}
)

</script>
<template>
   <div>
   <!-- {{ admissionData }} -->
      <form @submit.prevent="Enrol()">
         <div class="row">
            <div class="col-4">
               <label class="alert alert-primary p-1 textSize" style="" ><small>Please , Choose a class to enroll
                  <span style="text-transform: capitalize; color:#0d6efd;">
                  <b>{{ studentDataInfo.student.surname +" "+ studentDataInfo.student.second_name }}</b>
                  </span> !</small> 
               </label>
               <div class="mb-2 ">
                  <label class="textSize"><small>School</small> </label>
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
                  <label class="textSize"><small>Campus</small>  </label>
                  <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm"
                     v-model="form.campus_number" required
                     @change="fetchCurriculum(form.campus_number)"
                     >
                     <option disabled value="">Select campus</option>
                     <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                     </option>
                  </select>
               </div>

          <div class="mb-2">
          <label class="textSize"><small>Curriculum</small></label>
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
            <label class="textSize"><small>Level</small></label>
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
                  <label class="textSize"><small>Academic Year</small> </label>
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
                  <label class="textSize"><small>Class</small> </label>
                  <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm" required
                     v-model="form.class_number"
                     @change="fetchStreamAndStudyPeriod(form.class_number)"
                     >
                     <option disabled value="">Select class</option>
                     <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
                        <!-- {{ claslist.class_name }} -->
                        {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
                     </option>

                 

                  </select>
               </div>

                   <!-- {{ modeOfSchoolData }} -->
        
               <div class="mb-2">
                  <label class="textSize"><small>Stream</small> </label>
           
                  <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm" required
                     v-model="form.stream_number"
                      @change="getCampusN(form.stream_number)"
                     >
                     <option disabled value="">Select Stream</option>
                     <option v-for="(slist, index) in streamList" :key="index" :value="slist.stream_number">{{ slist.name }}
                     </option>
                  </select>
               </div>
           
               <div class="mb-2">
                  <label class="textSize">
                     <small>Study Period</small> 
                     <!-- {{ studyPeriodList }} -->
                  </label>
                  <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm" required
                     v-model="form.study_period_number"
                     
                     >
                     <option disabled value="">Select</option>
                     <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
                  </select>
               </div>
               <div class="mb-2">
                  <label class="textSize"><small>Enrolment Date</small> 
                  </label>
                  <input type="date" class="form-control" v-model="form.enrollment_date">
               </div>

               <div class="mb-2">
              <label class="textSize"><small>Mode Of Study</small>  <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="form.mode_of_study_number" required
                      @change="getBillableDataInfo"
              >
                  <option disabled value="">Select Mode Of Study</option>
                  <option v-for="(list, index) in modeOfSchoolData" :key="index" :value="list.mode_of_study_number">{{ list.name }}
                  </option>
              </select>
          </div>
            </div>
            <div class="col-8">
               <div class="col-12">
                  <div class="mb-2">
                     <table class="table table-hover caption-top mt-1 table-sm table-striped" style="font-size: 13px;">
                        <thead>
                           <tr>
                              <th style="width: 2px;">#</th>
                              <th>Billable Items</th>
                              <th>Cost</th>
                              <th>Quantity</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="(itemData, indx) in billableData" :key="indx" 
                           >
                              <td>
                                 <input v-model="selectedBillableItems" 
                                    class="form-check-input shadow-none"
                                    type="checkbox" 
                                    checked
                                    disabled
                                    style="width: 15px; height: 15px; font-size: 13px; text-align: center;"
                                    />
                              </td>
                              <td style="font-size: 12px;">{{ itemData.item_name }}</td>
                              <td style="font-size: 12px;">{{ itemData.unit_cost }}</td>
                              <td>
                                 <input type="text" 
                                    @keypress="commons.numbersOnlyValidator($event)" 
                                    maxlength="10"
                                    class="form-control shadow-none disabbled"
                                    placeholder="1"
                                    style="width: 50px; font-size: 13px; text-align: center;" 
                                    v-model="itemData.quantity" 
                                 >
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  <div class="mb-2 mt-5">
                     <label class="alert alert-primary p-1 textSize"  ><small>Tick off  <i class="bi bi-check" style="color:red"> </i>items  brought by the student </small> </label>
                     <table class="table table-hover caption-top mt-1 table-sm " style="font-size: 13px;">
                        <thead>
                           <tr>
                              <th style="width: 2px;">#</th>
                              <th>Other Items</th>
                              <th>Cost</th>
                              <th>Quantity</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr v-for="(item, indx) in itemsData" :key="indx">
                              <td>
                                 <input v-model="selectedItems" 
                                    class="form-check-input shadow-none"
                                    type="checkbox" 
                                    :value="item.item_number" 
                                    @change="toggleSelection(item)"
                                    aria-label="..." 
                                    style="width: 15px; height: 15px; font-size: 13px; text-align: center;"/>
                              </td>
                              <td style="font-size: 12px;">{{ item.item_name }}</td>
                              <td style="font-size: 12px;">{{ item.cost }}</td>
                              <td>
                                 <input type="text" 
                                    @keypress="commons.numbersOnlyValidator($event)" 
                                    maxlength="10"
                                    class="form-control shadow-none"
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
               <div class="mb-2 ">
                  <label class="textSize alert alert-primary p-1"><small>Which Feeding Group ?</small> </label>
                  <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm" required
                     v-model="form.feeding_group_number"
                     >
                     <option disabled value="">Select feeding Group</option>
                     <option v-for="(list, index) in feedingGroupData" :key="index" :value="list.number">{{ list.name }}
                     </option>
                  </select>
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
<style scoped>
   .noFocus:focus {
   outline: none 0 !important;
   box-shadow: none;
   -moz-box-shadow: none;
   -webkit-box-shadow: none;
   }
   .textSize {
      font-size: 13px I !important;
   }
</style>