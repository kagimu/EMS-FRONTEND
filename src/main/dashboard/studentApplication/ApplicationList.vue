<script setup>
  import {onMounted,reactive, computed,ref, watch} from "vue";
  import ApplicationDetails from './ApplicationDetails.vue';
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import AppModal from "@/components/AppModal.vue";
  import NewApplication from "@/main/dashboard/studentApplication/NewApplication.vue"
  import PaginationTemplate from "@/components/PaginationTemplate.vue";
  import {useLevelStore} from "@/main/settings/level/store/level.js";
  import useCommonsStore from "@/composables/useCommons.js";
  import DirectAdmit from "@/main/dashboard/studentApplication/DirectAdmit.vue"
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";

   
   const commons = useCommonsStore()

  const showingModal = ref(false)
  const showAppmodal = ref(false)
  const tableLoader = ref(true)
  const isStaff = ref("")
  const applicationN = ref(null)
  const showDirectAdmitModal = ref(false)
  const admissionStore = useAdmissionStore()
  const showDirectAppmodal = ref(false)

  const applicationModal = () =>{
  applicationN.value = ""
    resumeYes.value = ""
   showAppmodal.value = true
   isStaff.value = "staff"
  }

  const resumeYes = ref(null)
  const resumeApplicationModal = (application_number) =>{
   showAppmodal.value = true
    resumeYes.value = "resume"
   isStaff.value = "staff"
   applicationN.value = application_number

  }

  const resumeDirectApplicationModal = (application_number) =>{
    showDirectAdmitModal.value = true
    resumeYes.value = "resume"
    isStaff.value = "staff"
    applicationN.value = application_number

  }



  const applicationInfoList = ref( [])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  let shDialog = ref(false)
  const applications= ref(null)
  const applicationStore= useApplicationStore()
  const  notificationStore  = useNotificationStore()
  
  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const levelStore = useLevelStore()
  const academicYearStore = useAcademicYearStore()
  const academicYearList = ref([])
  const studyPeriodList  = ref([])
  const classStore = useClassesStore()
  const streamList = ref([])
  const loading = ref(false)
  const page = ref(1)
  const per_page = ref(20)
  const total_items = ref(0)
  const total_rows = ref(0)
  const levelList = ref([])
  const curriculumList = ref([])
 

  const form = reactive({
  academic_year: "",
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  interview_number:"",
  statusData:"",
  school_number:"",
  academic_year_number:"",
  curriculumNumber:"",
  level:""
  })

  const closeDialog = () => {
      showAppmodal.value = false
}



  onMounted(() => {
        // doFetchApplication()
        schoolStore.fetchSchools()


        let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
  let defaultCampusNo =   localStorage.getItem("defaultCampusNo")
  let defaultCampusCurriculumNo =   localStorage.getItem("defaultCampusCurriculumNo")


 if(defaultSchoolNo){
    form.school_number = defaultSchoolNo
    fetchCampuses(form.school_number)
  }

  if(defaultCampusNo){
    form.campus_number = defaultCampusNo
    fetchClasses(form.campus_number)
  }

  if(defaultCampusCurriculumNo){
    form.curriculumNumber = defaultCampusCurriculumNo
    fetchCampusLevel(form.curriculumNumber)
  }

  if(showDirectAdmitModal.value === false){
         localStorage.removeItem('application-id');
      } 

      }

  )
  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
    doFetchApplication()
  }
  
  const fetchClasses = (campus_number) => {
    doFetchApplication()
    campusStore.fetchClassesByCampus(campus_number)
    levelStore.fetchCampusCurriculum(campus_number)
  }

  const fetchCampusLevel = (curriculumNumber) => {
    doFetchApplication()
   classStore.fetchCampusLevel(curriculumNumber)
   updateDefaultFilters()
}
  
const updateDefaultFilters = () => {
  commons.updateDefaultFilters({
    schoolNumber: form.school_number,
    campusNumber: form.campus_number,
    campusCurriculumNumber: form.curriculumNumber
  })
}

  const fetchAcademicYear = (campusN) =>{
    doFetchApplication()
  academicYearStore.fetchAcademicYearByCampus(campusN)
  classStore.fetchClassStreams(campusN)
  }

  const fetchLevelClasses = (levelNumber) => {
    doFetchApplication()
   classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
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
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
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
      () => applicationStore.applicationListResponse,
      async (data) => {
        if(data){
          shDialog.value = false
          fetchApplications(data)
        }
      },
      {deep:true}
      )


  const doFetchApplication = () =>{

    if(!form.school_number){
      return
    }

   let data = {
      page: 1,
      per_page: per_page.value,   
      status: form.statusData,
     school_number:form.school_number,
     campus_number:form.campus_number,
     curriculum_number:form.curriculumNumber,
      level_number:form.level,
     campus_class_number:form.campus_class_number
     
   }
   loading.value = true;
   applicationInfoList.value = []
   applicationStore.fetchApplicationList(data).finally(() => {
    loading.value = false; 
  })

  }

  function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    let data = {
      page: (page.value+1),
      per_page: per_page.value,   
      status: form.statusData 
   }

   applicationStore.fetchApplicationList(data).finally(() => {
    loading.value = false; 
  })
  }
}


  const fetchApplications = (data) => {

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
    }
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
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
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
  
  
  
  
  const setApplicationNumber = (ap) =>{
    shDialog.value = true
    applications.value = ap
    showingModal.value = true
  }
  

  watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data 
      }
    }
)
      
      watch (
      () => applicationStore.errorMessage,
      async (data) => {
        if(data){
          shDialog.value = false
          buttonLoader.value = false
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
  
        }
      }
  )
  
  
  watch(
        () => applicationStore.addStudentToInterviewResponse,
        async (data) => {
            if (data) {
                shDialog.value = false,
                showingModal.value = false,
                doFetchApplication()
            }
        }
    )

    
watch (
    () => applicationStore.newApplicationDetailsResponse,
    async (data) => {
              if(data){

          //  let data = {
          //     page: page.value,
          //     per_page: per_page.value,
          //     status: form.statusData
          //  }
          //  await applicationStore.fetchApplicationList(data)

          doFetchApplication()
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

  
  //delete
const deleteThisData = (applicationData) => {
  if(!confirm("Are you sure, you want to delete: " + applicationData.Student.surname+' '+applicationData.Student.second_name )){
    return
  }else{
    // delete endpoint
    let data = {
      application_number:applicationData.number
    }
    applicationStore.deleteApplication(data)
  }
}


watch (
    () => applicationStore.deleteApplicationResponse,
    async (data) => {
      if(data){
         doFetchApplication()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => applicationStore.submitApplicationResponse,
    async (data) => {
      if (data) {
         showAppmodal.value = false
         doFetchApplication()
      }
      
    }
);


watch(
  () => showAppmodal.value,
  async (data) => {
    if (!data) {  // Check if the popup is closed (false)
      localStorage.removeItem('application-id');
    }
  }
);

const columns = ref([
{ label: 'ADN', key: 'adn' },
  { label: 'Name', key: 'surname	' },
  { label: 'second_name	', key: 'second_name	' },
  { label: 'Gender', key: 'gender' },

]);



const exportToCSV = () => {
  const csvContent = [
    columns.value.map((col) => col.label).join(','),
    ...applicationInfoList.value.map((row) =>
      columns.value.map((col) => `"${row[col.key]}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.csv';
  link.click();
  URL.revokeObjectURL(url);
};

const directAdmit = () => {
  resumeYes.value = ""
  applicationN.value = ""
  showDirectAdmitModal.value = true
}

watch(
    () => admissionStore.directAdmitStudentResponse,
    async (data) => {
      if(data){
        showDirectAdmitModal.value = false
      }
    },
    {deep:true}
)

watch(
    () => showDirectAdmitModal.value,
    async (data) => {
      if(showDirectAdmitModal.value === false){
         localStorage.removeItem('application-id');
      }
    } )

</script>

<template>

<AppModal title="Application -> Admission" v-model="showDirectAdmitModal" xl4>
  <DirectAdmit :applicationNumb="applicationN" :applicationMode="isStaff" @closeDialog="closeDialog" :resume="resumeYes"></DirectAdmit>
  </AppModal> 

  <AppModal title="Application Details" v-model="showingModal" xl6>
    <application-details :application-number="applications"></application-details>
  </AppModal>

  <AppModal title="New Application" v-model="showAppmodal" xl4>
    <NewApplication :applicationNumb="applicationN" :applicationMode="isStaff" @closeDialog="closeDialog" :resume="resumeYes"></NewApplication>
  </AppModal>

  <div class="row ml-2 mt-3">
   <h5  class="ml-1" style="font-size: 14px;margin-top: 2px;">APPLICATIONS 
      <button @click="applicationModal" style="float: right;" class="btn btn-primary btn-sm ml-2 mb-2 mt-2 mr-2"><small>New Application</small></button>
    
      <button @click="directAdmit" style="float: right;" class="btn btn-success btn-sm ml-2 mb-2 mt-2 mr-2">
        <small>Direct Admission</small></button>

    </h5>

                 <div class="col-lg-12">
                    <div>
                       <div>
                          <div class="row">
                             <div class="col-12">
                                <div class="mt-0">
                                   <div class="row mx-auto">

                                         <div class="row">
                                       

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
                                                class="form-select form-select-sm"
                                                   v-model="form.curriculumNumber"  
                                                   @change="fetchCampusLevel(form.curriculumNumber)"                                         
                                                >
                                                   <option disabled value="" >--Select Curriculum--</option>
                                                   <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
                                                </select>
                                             </div>
                                             </div> 

                                             
                                            <div class="col-3" >
                                                <div class="mb-2">
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
                                                </div>
                                            <div class="col-3">
                                               <div class="mb-2">

                                              <select
                                                  style="box-shadow: none;"
                                                  class="form-select form-select-sm" required
                                                  v-model="form.campus_class_number"
                                                  @change="fetchAcademicYear(form.campus_class_number)">
                                                <option disabled value="">-filter by class-</option>
                                                  <template v-for="(classItem, index) in classList" :key="index">
                                                  <option v-for="(classDetail, indx) in classItem.classes" :key="indx" :value="classDetail.number">
                                                  {{ classDetail.name }}
                                                  </option>
                                                  </template>
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
                                           

                                            <div class="col-3">
                                               <div class="mb-2">
                                                  <select
                                                     style="box-shadow: none;"
                                                     class="form-select form-select-sm"
                                                     v-model="form.statusData"
                                                     @change="doFetchApplication()"
                                                     >
                                                     <option disabled value="">-filter By Status</option>
                                                     <option value="DRAFT">DRAFT</option>
                                                    <option value="SUBMITTED">SUBMITTED</option>
                                                    <option value="INTERVIEW_SCHEDULED">Scheduled For Interview</option>
                                                    <option value="ADMITTED" >Admitted</option>
                                                    <option value="ENROLLED">Enrolled</option>
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

<!--              <button @click="exportToCSV" class="link link-primary mr-4"> <i class="bi bi-filetype-csv"></i> CSV    -->
<!--              </button>-->

              <PaginationTemplate
                    @perPageChanged="doFetchApplication"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>

              <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>

              <div v-else-if="applicationInfoList.length === 0" class="text-center my-4">
                <p>There is no data found</p>
              </div>


                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll" v-else>
              <div >
              <table
                 id="datatable"
                 class="table table-striped"
                 style="font-size: 13px !important;"
                 >
<!--                {{applicationInfoList}}-->
                 <thead>
                    <tr>
                      <th>#</th>
                       <th>APN</th>
                       <th>Student</th>
                       <th>Gender</th>
                       <th>Class</th>
                       <th>Status</th>
                       <th>Payment</th>
                       <th style="width: 20%;">Action</th>
                    </tr>
                 </thead>
                 <tbody>
                    <tr v-for="(appList, index) in applicationInfoList" :key="index">
                      <td>{{ appList.key }}</td>
                       <td>{{ appList.Student.apn }}</td>
                       <td style="text-transform: capitalize;">{{ appList.Student.surname+ " "+ appList.Student.second_name+ " "+ appList.Student.other_name  }} </td>
                       <td>{{ appList.Student.gender }}</td>
                       <td>{{appList.Student.CampusClass.class_name	}}</td>
                       <td>
                          <span v-if="appList.status === 'INTERVIEW_SCHEDULED'">INTERVIEW SCHEDULED</span>
                          <span v-if="appList.status === 'DRAFT'">DRAFT</span>
                          <span v-if="appList.status === 'SUBMITTED'" style="font-size: 12px;">SUBMITTED</span>
                          <span v-if="appList.status === 'ADMITTED'" style="font-size: 12px;">ADMITTED</span>
                          <span v-if="appList.status === 'ENROLLED'" style="font-size: 12px;">ENROLLED</span>
                       </td>
                       <td>
                         {{ appList.application_fee_payment === false ? 'pending' : 'completed' }}
                       </td>
                       <td>
                          <button v-if="appList.status === 'SUBMITTED'" @click="setApplicationNumber(appList.number)"
                             class="btn btn-primary btn-sm text-sm" style="border-width: 0px;text-decoration: none;" title="View Details">
                            <small>
                              Schedule Interview
                            </small>
                          </button>

                          <button v-if="appList.status === 'ENROLLED'"  @click="setApplicationNumber(appList.number)"
                             class="btn btn-primary btn-sm mb-2" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
                          View Details
                          </small>
                          </button>
                          <button v-if="appList.status === 'INTERVIEW_SCHEDULED'"  @click="setApplicationNumber(appList.number)"
                             class="btn btn-primary btn-sm mb-2" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
                          View Details
                          </small>
                          </button>
                          <button v-if="appList.status === 'ADMITTED'" @click="setApplicationNumber(appList.number)"
                             class="btn btn-primary btn-sm mb-2" style="border-width: 0px;text-decoration: none;" title="View Details"><small>
                          View Details
                          </small>
                          </button>
                          <button v-if="appList.status === 'DRAFT' && appList.type === 'NEW'" @click="resumeApplicationModal(appList.number)"
                             class="btn btn-primary btn-sm text-sm" style="border-width: 0px;text-decoration: none;" title="Resume Application">
                            <small>
                            Resume
                            </small>
                          </button>

                         <button v-if="appList.status === 'DRAFT' && appList.type === 'direct-application'" @click="resumeDirectApplicationModal(appList.number)"
                                 class="btn btn-primary btn-sm text-sm ml-1" style="border-width: 0px;text-decoration: none;" title="Resume Direct Application">
                           <small>
                             Resume
                           </small>
                         </button>

                       </td>
                    </tr>
                 </tbody>
              </table>
            </div>
            </div>
         
  <div>




  </div>
</template>

<style scoped>
</style>