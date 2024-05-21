<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import EnrolModel from "@/main/dashboard/enrollment/EnrolModel.vue"
  import AppModal from "@/components/AppModal.vue";
  import {useEnrolmentStore} from "@/main/dashboard/enrollment/store/enrollment.js"
  import {useLevelStore} from "@/main/settings/level/store/level.js";

  const levelStore = useLevelStore()
  const interviewStudentList = ref( [])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const  notificationStore  = useNotificationStore()
  const enrolDialog  = ref(null)
  const studentNum=ref(null)
  const enrolmentStore = useEnrolmentStore()
  const mymodal = ref(false)
  const showModal = (studentN,adm) =>{
  studentNum.value = studentN
  admissionNumber.value = adm
  mymodal.value = true
   }
  
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
  const admissionList = ref([])
  const admissionStore = useAdmissionStore()
  const studN = ref(null)
  const admissionNumber = ref(null)
  const loading = ref(false)
  const page = ref(1)
  const per_page = ref(15)
  const curriculumList = ref([])
  const levelList = ref([])
  
  onMounted(() => {
    schoolStore.fetchSchools()
    doFetchAdmission()
   }
  )
  
  const form = reactive({
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  school_number:"",
  academic_year_number:"",
  curriculumNumber:"",
  level:""
  })
  

  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
    doFetchAdmission()
  }
  



  const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
    levelStore.fetchCampusCurriculum(campus_number)
    doFetchAdmission()
  }

  const fetchAcademicYear = (campusN) =>{
  academicYearStore.fetchAcademicYearByCampus(campusN)
  classStore.fetchClassStreams(campusN)
  doFetchAdmission()
  }

  const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
}



const fetchLevelClasses = (levelNumber) => {
   classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
}

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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data ///---------------
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
   doFetchAdmission()
  }
  
  const filterByStudyPeriod = () => {
   doFetchAdmission()
  }

  const doFetchAdmission = () =>{
   let data = {
      page: 1,
      per_page: per_page.value,
      study_period_number:form.study_period_number,
      school_number:form.school_number,
      campus_number: form.campus_number,
      campus_class_number:form.campus_class_number,
      stream_number:form.stream_number,
      academic_year_number:form.academic_year_number
   }
   //   alert(JSON.stringify(data))
   //  admissionStore.fetchAdmissionByFilters(data)
   loading.value = true;
   admissionList.value = []
   admissionStore.fetchAdmissionByFilters(data).finally(() => {
    loading.value = false; 
  })

  }


  const fetchAdmissions = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content


      if(objArray && objArray.length > 0){
        objArray.forEach((list, i) => {

          list.key =  (current_page - 1) * per_page_item + i + 1

          const index = admissionList.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            admissionList.value.push(list);
          }

        })
      }


    }
  }


  watch (
    () => admissionStore.admissionByFiltersResponse,
    async (data) => {
      if(data){
        fetchAdmissions(data)
      }
    }
  )



  watch(
    () => classStore.classStreams,
    async (data) => {
        if (data) {
          streamList.value = data.data
        }
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
  
//   watch(
//     () => campusStore.campusClassesResponse,
//     async (data) => {
//         if (data) {
//             classList.value = data.data
//         }
//     },
//     {deep: true}
//   )
  
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
    () => admissionStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)      
          }
    },
    {deep: true}
  )
    
  watch (
      () => enrolmentStore.newsEnrolmentResponse,
      async (data) => {
        if(data){
         mymodal.value=false
         admissionStore.fetchAdmissionByFilters(form.study_period_number,form.interview_number,form.stream_number,form.campus_number,form.campus_class_number)

        }
      },
      {deep:true}
    )

</script>
<template>

<AppModal title="Enrol" v-model="mymodal" xl6>
   <EnrolModel :studentNumber="studentNum" :adm="admissionNumber"></EnrolModel>
</AppModal>

  <div>

     <!-- end  -->
     <div class="row mt-4">
        <div class="col-12">
           <div class="card">
              <div class="card-body" style="padding: 0;">
                 <div class=" mx-3">
                    <div class="row">
                       <div class="col-lg-12">
                          <div class="">
                             <div class="card-body">
                                <div class="row">
                                   <div class="col-lg-11">
                                      <h5 style="font-size: 14px;margin-top: 2px;">ADMISSION OFFERS </h5>
                                   </div>
                                   <div class="col-lg-1">
                                      <i class="bi bi-printer" style="float: right;"> Print </i>
                                   </div>
                                </div>
                                <div class="row">
                                   <div class="col-12">
                                      <div class="mt-4">
                                         <div class="row mx-auto">
                                            <div class="row">
                                               <div class="col-3">
                                                  <div class="mb-2">
                                                     <!-- <label class="textColor"><small>School</small> </label> -->
                                                     <select
                                                        style="box-shadow: none;"
                                                        class="form-select form-select-sm" required
                                                        v-model="form.school_number"
                                                        @change="fetchCampuses(form.school_number)"
                                                        >
                                                        <option disabled  value="">-filter by School-</option>
                                                        <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                                                        </option>
                                                     </select>
                                                     
                                                  </div>
                                               </div>
                                               <div class="col-3">
                                                  <div class="mb-2">
                                                     <!-- <label class="textColor"><small>Campus</small>  </label> -->
                                                     <select
                                                        style="box-shadow: none;"
                                                        class="form-select form-select-sm"
                                                        v-model="form.campus_number" required
                                                        @change="fetchClasses(form.campus_number)"
                                                        >
                                                        <option disabled value="">-filter by Campus-</option>
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
                                                   <!-- {{ classList }} -->
                                                     <select
                                                        style="box-shadow: none;"
                                                        class="form-select form-select-sm" required
                                                        v-model="form.campus_class_number"
                                                        @change="fetchAcademicYear(form.campus_class_number)"
                                                        >
                                                      <option disabled value="">-filter by class-</option>
                                                      <template v-for="(classItem, index) in classList" :key="index">
                                                      <option v-for="(classDetail, indx) in classItem.classes" :key="indx" :value="classDetail.number">
                                                      {{ classDetail.name }}
                                                      </option>
                                                      </template>
                                                     </select>
                                                  </div>
                                               </div>
                                               <div class="col-3">
                                                  <div class="mb-2">
                                                     <!-- <label class="textColor"><small>Stream</small> </label> -->
                                                     <select
                                                        style="box-shadow: none;"
                                                        class="form-select form-select-sm" required
                                                        v-model="form.stream_number"
                                                        @change="filterByStream()"
                                                        >
                                                        <option disabled value="">-filter by Stream-</option>
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
                                                        @change="doFetchAdmission()"
                                                        >
                                                        <option disabled value="">-filter AcademicYear-</option>
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
                                                        <option disabled value="">filter by Study period -</option>
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

               <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>

              <div v-else-if="admissionList.length === 0" class="text-center my-4">
                <p>There is no data found</p>
              </div>

              <div v-else>
                    <table
                       id="datatable"
                       class="table table-hover caption-top mt-4 table-sm table-striped"
                       style="font-size: 14px !important;"
                       >
                       <thead >
                          <tr>
                             <!-- <th style="width: 2px;">#</th> -->
                             <th>ADN</th>
                             <!-- <th>Year</th>       -->
                             <th>Student</th>
                             <th>Campus</th>
                             <th>Class</th>
                             <th>Stream</th>
                             <th>Study Period</th>
                             <!-- <th>Status</th> -->
                             <th>Action</th>
                          </tr>
                          <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                             {{errorMessage}}
                             </div> -->
                       </thead>
                       <tbody>
                          <tr v-for="(adm , index) in admissionList" :key="index">
                             <!-- <td>
                                {{ index+1 }}
                             </td> -->
                             <td>{{ adm.Student.adn }}</td>
                             <!-- <td>{{ adm.AcademicYear.academic_year_name }}</td> -->
                             <td style="text-transform: capitalize !important;">{{ adm.Student.surname }}</td>
                             <td>{{ adm.Campus.name }}</td>
                             <td>{{ adm.Stream.class_name }}</td>
                             <td>{{ adm.Stream.name }}</td>
                             <td>{{ adm.StudyPeriod.study_period_name }}</td>
                             <!-- <td>{{ adm.status }}</td> -->
                             <!-- <span v-if="adm.status == 'Enrolled'" class="link link-primary"><i>{{ adm.status }}</i></span> -->
                             <td>
                                <!-- <button v-if="adm.status != 'Enrolled'" @click="showDialog(adm)" 
                                   data-bs-toggle="modal" data-bs-target="#admitMainModal" type="submit" class="btn btn-sm btn-primary mb-2 mr-4 "
                                   style="color: white;">
                                   <small>Enrol&nbsp;<i class="bi bi-box-arrow-in-right"></i></small>  
                                </button> -->
                                

                                <button v-if="adm.status != 'Enrolled'" @click="showModal(adm.Student.number,adm.number)" 
                                   type="button" class="btn btn-sm btn-primary mb-2 mr-4 "
                                   style="color: white;">
                                   <small>Enrol&nbsp;<i class="bi bi-box-arrow-in-right"></i></small>  
                                </button>


                                <router-link style="display: none;"
                                   class="text-decoration-none"
                                   :to="{name:'admission-details', query:{st_id:adm.Student.number}}">
                                   <button type="button"
                                      class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white"
                                      >view Details</button>
                                </router-link>
                                <span  v-if="adm.status == 'Enrolled'" class="link link-success"><i class="bi bi-check"></i>enrolled</span>
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