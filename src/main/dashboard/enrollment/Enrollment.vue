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
  import AppModal from "@/components/AppModal.vue";
  import PaginationTemplate from "@/components/PaginationTemplate.vue";
  

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
  const loading = ref(false)
  const page = ref(1)
  const per_page = ref(20)
  const tableLoader = ref(true)
  const total_items = ref(0)
  const total_rows = ref(0)



  const form = reactive({
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  school_number:"",
  academic_year_number:"",
  status:""
  })
  
  
  onMounted(() => {
        schoolStore.fetchSchools()
        doFetchEnrollent()
    }
  )
  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
    doFetchEnrollent()
  }
  
  const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
    doFetchEnrollent()
  }
  
  const fetchAcademicYear = (campusN) =>{
  academicYearStore.fetchAcademicYearByCampus(campusN)
  classStore.fetchClassStreams(campusN)
  doFetchEnrollent()
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
    doFetchEnrollent()
  }
  
  const filterByStudyPeriod = () => {
    doFetchEnrollent()
  }

 
  const doFetchEnrollent = () =>{
   let data = {
      page: 1,
      per_page: per_page.value,
      study_period_number:form.study_period_number,
      school_number:form.school_number,
      campus_number: form.campus_number,
      campus_class_number:form.campus_class_number,
      stream_number:form.stream_number,
      academic_year_number:form.academic_year_number,
      status:form.status
   }
   loading.value = true;
   enrollmentList.value = []
   enrollmentStore.fetchEnrolment(data).finally(() => {
    loading.value = false; 
  })

  }

  function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    tableLoader.value = true
 
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      study_period_number:form.study_period_number,
      school_number:form.school_number,
      campus_number: form.campus_number,
      campus_class_number:form.campus_class_number,
      stream_number:form.stream_number,
      academic_year_number:form.academic_year_number,
      status:form.status
   }
   loading.value = true;
   enrollmentList.value = []
   enrollmentStore.fetchEnrolment(data).finally(() => {
    loading.value = false; 
  })
  }
}


  const fetchEnrollmentList = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page
      tableLoader.value = false

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
        // enrollmentList.value = data.data
        fetchEnrollmentList(data)
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
    <div class="containe mt-1 mx-2">
        <div class="row">
          <div class="col-lg-12">
            <div class="">
              <div class="">
                <ul>
                  <h5 style="font-size: 14px;margin-top: 2px;">ENROLLED STUDENTS</h5>
                  <li>
                  </li>
                </ul>
   
        <div class="row">
      <div class="col-12">
        <div class="mt-1">
          <div class="row mx-auto">
        

              <div class="row">
                <div class="col-3">
                  <div class="mb-2">
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.status"
                    @change="doFetchEnrollent()"
            >
                <option disabled value="">-Filter By Status-</option>
                <option value="ACTIVE">Active</option>
                <option value="TERMINATED">Terminated</option>
                <option value="SUSPENDED">Suspended</option>
            </select>
        </div>
                </div>
                <div class="col-3">
                  <div class="mb-2">
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.school_number"
                    @change="fetchCampuses(form.school_number)"
            >
                <option disabled value="">-Filter By School-</option>
                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>
                </div>
  
                <div class="col-3">
        <div class="mb-2">
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.campus_number" required
                    @change="fetchClasses(form.campus_number)"
            >
                <option disabled value="">-Filter By campus-</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div></div>
  
  
        <div class="col-3">
          <div class="mb-2">
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.campus_class_number"
                    @change="fetchAcademicYear(form.campus_class_number)"
            >
                <option disabled value="">-Filter By class-</option>
                <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                </option>
            </select>
        </div>
        </div>
  
        <div class="col-3">
          <div class="mb-2">
          
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.stream_number"
                    @change="filterByStream()"
             >
                <option disabled value="">-Filter By Stream-</option>
                <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}
                </option>
            </select>
        </div>
        </div>
  
        <div class="col-3">
          <div class="mb-2">
         
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.academic_year_number"
                    @change="doFetchEnrollent()"
            >
                <option disabled value="">-filter By AcademicYear</option>
               <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
            </select>
        </div>
        </div>
  
        <div class="col-3">
          <div class="mb-2">
       
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.study_period_number"
                    @change="filterByStudyPeriod()"
            >
                <option disabled value="">-Filter By Class-</option>
                <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
  
            </select>
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
        <PaginationTemplate
                    @perPageChanged="doFetchEnrollent"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>

        <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-else-if="enrollmentList.length === 0" class="text-center my-4">
                <p>There is no data found</p>
              </div>
              <div v-else>
      <table
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;"
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
            <th>EnrolledOn</th>
            <!-- <th>Class</th> -->
            <th style="width: 13%;">Action</th>
          </tr>
    <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div> -->
        </thead>
        <tbody>
          <tr v-for="(enrolData,index) in enrollmentList" :key="index" >
            <td>
               {{ index+1 }}
            </td>
            <td>{{ enrolData.adn }}</td>
            <td>{{ enrolData.study_period }}</td>
            <td style="text-transform: capitalize;">{{ enrolData.student_surname + " "+ enrolData.student_second_name + " "  + enrolData.student_other_name}}</td>
            <td>{{enrolData.school }}</td>
            <td>{{ enrolData.campus }}</td>
            <td>{{ enrolData.class }}</td>
            
            <td>{{ enrolData.enrollment_date }}</td>
            <td> 
                <router-link
                  class="text-decoration-none"
                  :to="{name:'student-profile-details', query:{st_id:enrolData.student_number}}">
                <button class="btn btn-outline-primary btn-sm mb-2">
                <small><i class="bi bi-person"></i>View Profile</small>
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
  
  
    </div>
    </template>
    
    
    
    <style scoped>
  
    </style>