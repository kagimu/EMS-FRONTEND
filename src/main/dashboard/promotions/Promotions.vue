<template>
    <div>
    

  
      <!-- end  -->
      <div class="row mt-3">
        <div class="col-12">
          <div class="card">
            <div class="card-body" style="padding: 0;">
    <div class="container mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <ul>
                  <h5 style="font-size: 14px;margin-top: 2px;">PROMOTIONS</h5>
                  <li>
                  </li>
                </ul>
  
                
        <div class="row">
      <div class="col-12">
        <div class="mt-4">
          <div class="row mx-auto">
        

              <div class="row">
                <div class="col-4">
                  <div class="mb-2">
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
                </div>
  
                <div class="col-3">
        <div class="mb-2">
            <label class="textColor"><small>Campus</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.campus_number" required
                    @change="fetchClasses(form.campus_number)"
            >
                <!-- <option disabled value="">Select campus</option> -->
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div></div>
  
  
        <div class="col-2">
          <div class="mb-2">
            <label class="textColor"><small>Class</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.campus_class_number"
                    @change="fetchAcademicYear(form.campus_class_number)"
            >
                <!-- <option disabled value="">Select class</option> -->
                <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                </option>
            </select>
        </div>
        </div>
  
        <!-- <div class="col-1">
          <div class="mb-2">
            <label class="textColor"><small>Stream</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.stream_number"
                    @change="filterByStream()"
             >  
                <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}
                </option>
            </select>
        </div>
        </div> -->
  
        <div class="col-2">
          <div class="mb-2">
            <label class="textColor"><small>Academic Year</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.academic_year"
            >
               <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
            </select>
        </div>
        </div>
  
        <!-- <div class="col-2">
          <div class="mb-2">
            <label class="textColor"><small>Study-Period</small> 
            </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.study_period_number"
                    @change="filterByStudyPeriod()"
            >
                <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
  
            </select>
        </div>
        </div> -->

        <!-- <div class="col-3">
            <div class="mt-4">
                <input type="text" class="form-control mt-1 mb-0" placeholder="Search..."> 
            </div>
       </div> -->

              </div>
    
  </div> 
        </div>
      </div>
    </div>
              </div>
            </div>
          </div>
        </div>
        
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 14px !important;"
      >
      <thead >
          <tr>
            <th style="width: 2px;">#</th>
            <th>ADN</th>
            <th>Academic Year</th>
            <th>Name</th>  
            <th>Previous Class</th>
            <th>Next Class</th>
            <th>Reason</th>
            <th>Action</th>
          </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div>
        </thead>
        <tbody>
          <tr v-for="(promotiontData,index) in promotiontList" :key="index" >
            <td>
              
                <input type="checkbox"   class="checkbox-primary">
            </td>
            <td>{{ promotiontData.Student.apn }}</td>
            <td>{{ promotiontData.CurrentAcademicYear.academic_year_name }}</td>
            <td>{{ promotiontData.Student.surname + " "+ promotiontData.Student.second_name + " "  + promotiontData.Student.other_name}}</td>
          
            <td>{{ promotiontData.PromotionSetting.previous_class.class_name }}</td>
            <td>{{ promotiontData.PromotionSetting.next_class.class_name }}</td>
            <td>{{promotiontData.reasons }}</td>
            <td>
                <button type="button" class="btn btn-primary btn-sm"> <i class="bi bi-eye"></i> View </button>
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
    
    <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
  import EnrolModel from "@/main/dashboard/enrollment/EnrolModel.vue"
  import PromoteStudent from "@/main/settings/promotion/PromoteStudent.vue";
  import {usePromotionStore} from "@/main/settings/promotion/store/promotion.js"
  
  const promotiontList = ref([])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const  notificationStore  = useNotificationStore()
  const enrollmentStore = useEnrolmentStore()
  const studentNumber = ref(null)
  const promotionStore = usePromotionStore()
  
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
  const promDialog = ref(false)
  
  
  const form = reactive({
  academic_year: "",
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  interview_number:""
  })
  
onMounted (
  () => { 
    promotionStore.fetchPromotions() 
  } 
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
  promotionStore.fetchPromotionByCampusClassNumber(campusN)
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
  
  
  const filterByStream = (a) => {
    //filterStream
  

  }
  
  const filterByStudyPeriod = () => {
    // filterByStudyPeriod

  }
  watch(
    () => classStore.classStreams,
    async (data) => {
        if (data) {
          streamList.value = data.data
        }
    },
    {deep: true}
  )
  
  
  onMounted(() => {
        schoolStore.fetchSchools()
    }
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
  
   



  watch (
    () => promotionStore.promotionsResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        promDialog.value = false;
        promotiontList.value = data.data
      }
    },
    {deep:true}
  )
  
  watch(
    () => promotionStore.errorMessage,
    async (data) => {
          if (data) {
             promDialog.value = false;
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )

const promModal = (a) =>{
promDialog.value = true;
studentNumber.value = a

  }
  watch(
    () => promotionStore.newPromotionsResponse,
    async (data) => {
        if (data) {
          promDialog.value = false;
        }
    },
    {deep: true}
)
    </script>
  

    
    <style scoped>
  
    </style>