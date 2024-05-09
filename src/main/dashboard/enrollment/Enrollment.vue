<template>
    <div>
     

      <div class="modal fade" id="promoteModal" tabindex="-1"  :class="{ show: promDialog }">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header text-sm p-0">
              <h6 class="modal-title ml-3 mt-2 mb-2">Promotion</h6>
              <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mt-2 mb-2">
              <PromoteStudent :studentNumber="studentNumber"></PromoteStudent>
              </div>
            </div>
          </div>
        </div>
      </div>


  
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
                  <h5 style="font-size: 14px;margin-top: 2px;">ENROLLED STUDENTS</h5>
                  <li>
                  </li>
                </ul>
  
                
        <div class="row">
      <div class="col-12">
        <div class="mt-4">
          <div class="row mx-auto">
        

              <div class="row">
                <div class="col-2">
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
  
                <div class="col-2">
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
  
  
        <div class="col-1">
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
  
        <div class="col-1">
          <div class="mb-2">
            <label class="textColor"><small>Stream</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.stream_number"
                    @change="filterByStream()"
             >
                <!-- <option disabled value="">Select Stream</option> -->
                <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}
                </option>
            </select>
        </div>
        </div>
  
        <div class="col-1">
          <div class="mb-2">
            <label class="textColor"><small>Year</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.academic_year"
            >
                <!-- <option disabled value="">Select Year</option> -->
               <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
            </select>
        </div>
        </div>
  
        <div class="col-2">
          <div class="mb-2">
            <label class="textColor"><small>Study-Period</small> 
            <!-- {{ studyPeriodList }} -->
            </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.study_period_number"
                    @change="filterByStudyPeriod()"
            >
                <!-- <option disabled value="">Select</option> -->
                <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
  
            </select>
        </div>
        </div>

        <div class="col-3">
            <div class="mt-4">
                <input type="text" class="form-control mt-1 mb-0" placeholder="Search..."> 
            </div>
       </div>

              </div>
      



  
  </div> 
        </div>
      </div>
    </div>
              </div>
            </div>
          </div>
        </div>
        
  
  
  <p style="float: right;">
    <router-link :to="{name:'promotions'}" class="navbar-brand" style="margin-left:20px;font-size:14px;
           font-weight:400"><i class="bi bi-list"></i>&nbsp;<b>View Promotions</b>
  </router-link>
  </p>

  
 
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 14px !important;"
      >
      <thead >
          <tr>
            <th style="width: 2px;">#</th>
            <th>ADN</th>
            <th>StudyPeriod</th>
            <th>Student</th>
            <th>School</th>
            <th>Campus</th>
            <th>Class</th>
            <th>Enrolment Date</th>
            <!-- <th>Class</th> -->
            <th>Action</th>
          </tr>
    <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div> -->
        </thead>
        <tbody>
          <tr v-for="(enrolData,index) in enrollmentList" :key="index" >
            <td>
                <input type="checkbox"   class="checkbox-primary">
            </td>
            <td>{{ enrolData.adn }}</td>
            <td>{{ enrolData.study_period }}</td>
            <td style="text-transform: capitalize;">{{ enrolData.student_surname + " "+ enrolData.student_second_name + " "  + enrolData.student_other_name}}</td>
            <td>{{enrolData.school }}</td>
            <td>{{ enrolData.campus }}</td>
            <td>{{ enrolData.class }}</td>
            
            <td>{{ enrolData.enrollment_date }}</td>
            <td>
                <!-- <button><i class="bi bi-trash"></i></button> &nbsp;
                <button><i class="bi bi-pencil"></i></button> -->
                <!-- <button 
                 type="button" @click="promModal(enrolData.Student.number)"  class="btn btn-sm buttonStyle btn-primary mr-2"  data-bs-toggle="modal" data-bs-target="#promoteModal">
                  Promote
                </button> -->

         
                <router-link
                  class="text-decoration-none"
                  :to="{name:'student-profile-details', query:{st_id:enrolData.number}}">
                <button class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white">
                <small><i class="bi bi-person"></i> Student Profile</small>
                </button>
              </router-link>


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
  
  const enrollmentList = ref( [])
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
  
  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
    //addfilter
    let campusNumber="",campusClass="",StreamNumber="",studyPeriodN="";
    enrollmentStore.fetchEnrolment(school_number,campusNumber,campusClass,StreamNumber,studyPeriodN)
  }
  
  const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
    let campusNumber="",campusClass="",StreamNumber="",studyPeriodN="";
    // enrollmentStore.fetchEnrolment(school_number,campusNumber,campusClass,StreamNumber,studyPeriodN)
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
  
  
  const filterByStream = () => {
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
  
   
  onMounted(() => {
    enrollmentStore.fetchEnrolment()
    }
  )


  watch (
    () => enrollmentStore.enrolmentResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        promDialog.value = false;
        enrollmentList.value = data.data
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