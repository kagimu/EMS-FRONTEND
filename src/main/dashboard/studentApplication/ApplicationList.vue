<script setup>
  import {onMounted,reactive, computed,ref, watch} from "vue";
  import ApplicationDetails from './ApplicationDetails.vue';
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import useNotificationStore from "@/composables/useNotification.js";
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import AppModal from "@/components/AppModal.vue";
  import NewApplication from "@/main/dashboard/studentApplication/NewApplication.vue"

  const showingModal = ref(false)
  const showAppmodal = ref(false)
  
  const applicationModal = () =>{
   showAppmodal.value = true
  }


  const applicationInfoList = ref( [])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const searchQuery = ref('')
  let shDialog = ref(false)
  const applications= ref(null)
  
  const applicationStore= useApplicationStore()
  const  notificationStore  = useNotificationStore()
  
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
  const loading = ref(false)
  const page = ref(1)
  const per_page = ref(15)
  
  const form = reactive({
  academic_year: "",
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  interview_number:"",
  statusData:"",
  school_number:"",
  academic_year_number:""
  })
  
  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
  }
  
  const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
  }
  
  const fetchAcademicYear = (campusN) =>{
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
  }
  
  
  
  const filterByStudyPeriod = () => {
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
        doFetchApplication()
        schoolStore.fetchSchools()
    }
  )
  
      watch(
      () => applicationStore.applicationListResponse,
      async (data) => {
        if(data){
          shDialog.value = false
         //  applicationInfoList.value = data.data
          fetchApplications(data)
         //  doFetchApplication()
        }
      },
      {deep:true}
      )


  const doFetchApplication = () =>{
   let data = {
      page: page.value,
      per_page: per_page.value,   
      status: form.statusData 
   }
   loading.value = true;
   applicationInfoList.value = []
   applicationStore.fetchApplicationList(data).finally(() => {
    loading.value = false; 
  })

  }

  const fetchApplications = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content


      if(objArray && objArray.length > 0){
        objArray.forEach((list, i) => {

          list.key =  (current_page - 1) * per_page_item + i + 1

          const index = applicationInfoList.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            applicationInfoList.value.push(list);
          }

        })
      }


    }
  }


  
  
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
  
  
  
  
  const setApplicationNumber = (ap) =>{
   // alert(ap)
    shDialog.value = true
    applications.value = ap
    showingModal.value = true
    
    // alert(shDialog.value)
  }
  
      
      watch (
      () => applicationStore.errorMessage,
      async (data) => {
        if(data){
          shDialog.value = false
          buttonLoader.value = false
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
  
        }
      },
      {deep:true}
  )
  
  
  watch(
        () => applicationStore.addStudentToInterviewResponse,
        async (data) => {
            if (data) {
                shDialog.value = false,
                showingModal.value = false,
                doFetchApplication()
            }
        },
        {deep: true}
    )

    
watch (
    () => applicationStore.newApplicationDetailsResponse,
    async (data) => {
      if(data){
        
         let dataa = {
      page: page.value,
      per_page: per_page.value,   
      status: form.statusData 
   }
   applicationStore.fetchApplicationList(dataa)
}
    },
    {deep:true}
)


watch (
    () => applicationStore.newApplicationDetailsLearnerResponse,
    async (data) => {
      if(data){
         // doFetchApplication()
      }
    },
    {deep:true}
)

  
</script>

<template>
  <div class="row ml-2 mt-3">
   <h5  class="ml-1" style="font-size: 14px;margin-top: 2px;">APPLICATIONS 
      <button @click="applicationModal" style="float: right;" class="btn btn-primary btn-sm ml-2 mb-2 mt-2 mr-2"><small>New Application</small></button></h5>

                 <div class="col-lg-12">
                    <div>
                       <div>
                          <div class="row">
                             <div class="col-12">
                                <div class="mt-0">
                                   <div class="row mx-auto">
                                      <form @submit.prevent="Admit()">
                                         <div class="row">
                                          <div class="col-3">
                                               <div class="mb-2">
                                                  <select
                                                     style="box-shadow: none;"
                                                     class="form-select form-select-sm"
                                                     v-model="form.statusData"
                                                     @change="doFetchApplication()"
                                                     >
                                                     <option disabled value="">-filter By Status</option>
                                                    <option value="SUBMITTED">SUBMITTED</option>
                                                    <option value="INTERVIEW_SCHEDULED">Scheduled For Interview</option>
                                                    <option value="ADMITTED" >Admitted</option>
                                                    <option value="ENROLLED">Enrolled</option>
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
                                                     <option disabled value=""> -Filter By School-</option>
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
                                                     <option disabled value="">-filter By Campus-</option>
                                                     <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                                                     </option>
                                                  </select>
                                               </div>
                                            </div>
                                            <div class="col-3">
                                               <div class="mb-2">
                                                  <select
                                                     style="box-shadow: none;"
                                                     class="form-select form-select-sm" required
                                                     v-model="form.campus_class_number"
                                                     @change="fetchAcademicYear(form.campus_class_number)"
                                                     >
                                                     <option disabled value="">-filter By class-</option>
                                                     <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                                                     </option>
                                                  </select>
                                               </div>
                                            </div>
                                            <div class="col-3" style="display: none">
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
                                         
                                                
                                            <div class="col-3" style="display: none">
                                               <div class="mb-2">
                                                  <select
                                                     style="box-shadow: none;"
                                                     class="form-select form-select-sm" required
                                                     v-model="form.academic_year_number"
                                                     >
                                                     <option disabled value="">-Filter By AcademicYear-</option>
                                                     <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                                                  </select>
                                               </div>
                                            </div>
                                            <div class="col-3" style="display: none">
                                               <div class="mb-2">
                                                  <select
                                                     style="box-shadow: none;"
                                                     class="form-select form-select-sm" required
                                                     v-model="form.study_period_number"
                                                     @change="filterByStudyPeriod()"
                                                     >
                                                     <option disabled value="">-Filter By StudyPeriod-</option>
                                                     <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
                                                  </select>
                                               </div>
                                            </div>
                                            </div>
                                      </form>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>

              <div v-else-if="applicationInfoList.length === 0" class="text-center my-4">
                <p>There is no data found</p>
              </div>

              <div v-else>
              <table
                 id="datatable"
                 class="table table-striped"
                 style="font-size: 13px !important;"
                 >
                 <thead>
                    <tr>
                      <th>#</th>
                       <th>APN</th>
                       <th>Student</th>
                       <th>Gender</th>
                       <!-- <th>DOB</th> -->
                       <th>Status</th>
                       <th>Payment</th>
                       <th style="width: 20%;">Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr v-for="(applist, index) in applicationInfoList" :key="index">
                      <td>{{ index+1 }}</td>
                       <td>{{ applist.Student.apn }}</td>
                       <td style="text-transform: capitalize;">{{ applist.Student.surname+ " "+ applist.Student.second_name+ " "+ applist.Student.other_name  }} </td>
                       <td>{{ applist.Student.gender }}</td>
                       <!-- <td>{{ applist.Student.date_of_birth }}</td> -->
                       <td><span v-if="applist.status == 'INTERVIEW_SCHEDULED'">INTERVIEW SCHEDULED</span>
                          <span v-if="applist.status == 'SUBMITTED'" style="font-size: 12px;">SUBMITTED</span>
                          <span v-if="applist.status == 'ADMITTED'" style="font-size: 12px;">ADMITTED</span>
                          <span v-if="applist.status == 'ENROLLED'" style="font-size: 12px;">ENROLLED</span>
                       </td>
                       <td>{{ applist.application_fee_payment === false ? 'pending' : 'completed' }}</td>
                       <td>
                          <button v-if="applist.status === 'SUBMITTED'" @click="setApplicationNumber(applist.number)"
                             class="btn btn-primary btn-sm mb-2" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
                          Schedule Interview
                          </small>
                          </button>
                          <button v-if="applist.status === 'ENROLLED'"  @click="setApplicationNumber(applist.number)"
                             class="btn btn-primary btn-sm mb-2" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
                          View Details
                          </small>
                          </button>
                          <button v-if="applist.status === 'INTERVIEW_SCHEDULED'"  @click="setApplicationNumber(applist.number)"
                             class="btn btn-primary btn-sm mb-2" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
                          View Details
                          </small>
                          </button>
                          <button v-if="applist.status === 'ADMITTED'" @click="setApplicationNumber(applist.number)"
                             class="btn btn-primary btn-sm mb-2" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
                          View Details
                          </small>
                          </button>
                          <!-- <RouterLink :to="{name : 'admit-student', query:{id:applist.number} }" class="link-danger" style="text-decoration: none;"  >
                             <i class="bi bi-eye"></i>  
                             </RouterLink>   -->
                       </td>
                    </tr>
                 </tbody>
              </table>
            </div>
         
  <div>
     <!-- <div class="modal fade" tabindex="-1" id="infoModal"   aria-hidden="true" :class="{ show: shDialog }">
        <div class="modal-dialog modal-xl">
           <application-details :application-number="applications"></application-details>
        </div>
     </div> -->

     <AppModal title="Application Details" v-model="showingModal" xl6>
        <application-details :application-number="applications"></application-details>
     </AppModal>

     <AppModal title="New Application" v-model="showAppmodal" xl>
      <NewApplication></NewApplication>
     </AppModal>

  </div>
</template>

<style scoped>
</style>