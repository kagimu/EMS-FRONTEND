<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import EnrolModel from "@/main/dashboard/enrollment/EnrolModel.vue"
   import AppModal from "@/components/AppModal.vue";
   import {useEnrolmentStore} from "@/main/dashboard/enrollment/store/enrollment.js"
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import PaginationTemplate from "@/components/PaginationTemplate.vue";
   import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
   import StudentProfile from '@/main/teacher/students/StudentProfile.vue';

   import { useAbility } from '@casl/vue';
   import FileUploader from "@/components/FileUploader.vue";
   const { can } = useAbility()
   const studyPeriodStore = useStudyPeriodStore()
   const levelStore = useLevelStore()
   const  notificationStore  = useNotificationStore()
   const studentNum=ref(null)
   const enrolmentStore = useEnrolmentStore()
   const mymodal = ref(false)
   const studentData = ref(null)
   const tableLoader = ref(true)
   const uploadDialog = ref(false)
   const studentPhoto = ref(null)
   const studentNumber = ref(null)
   
   const showModal = (studentN,adm,stud) =>{
   studentNum.value = studentN
   admissionInfoData.value = stud
   studentData.value =stud
   mymodal.value = true
    }
   
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
   const admissionList = ref([])
   const admissionStore = useAdmissionStore()
   const admissionInfoData = ref(null)
   const loading = ref(false)
   const page = ref(1)
   const per_page = ref(20)
   const total_items = ref(0)
   const total_rows = ref(0)
   
   const curriculumList = ref([])
   const levelList = ref([])
   
   onMounted(() => {
     schoolStore.fetchSchools()
     doFetchAdmission()
    }
   )
   
   const form = reactive({
   study_period_number: "",
   class_number: "",
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
   
   
   const fetchClasses = (campus_level_number) => {
     levelStore.fetchCampusCurriculum(campus_level_number)
     doFetchAdmission()
   }
   
   watch(
     () => campusStore.schoolClassesResponse,
     async (data) => {
       if(data){
         classList.value = data.data
       }
     }
   )
   
   const fetchStreamsAndStudyPeriod = (classNumber) =>{
   let sData = {
      campus_number:form.campus_number,
      class_number:classNumber,
      campus_curriculum_number:form.curriculumNumber
     }
     classStore.fetchClassStreams(sData)

     studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:classNumber,
        school_number:form.school_number
      } )

     doFetchAdmission()
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
     () => academicYearStore.academicYearByLevelResponse,
     async (data) => {
       if(data){
         academicYearList.value = data.data
       }
     }
   )
   
   const fetchCampusLevel = (curriculumNumber) => {
    classStore.fetchCampusLevel(curriculumNumber)
   }
   
   
   
   const fetchLevelClasses = (levelNumber) => {
    let data = {
     school_number:form.school_number,
     campus_level_number:levelNumber
   }
   campusStore.fetchClassesBySchool(data)
   academicYearStore.fetchAcademicYearByLevel(levelNumber)
   }
   
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
       class_number:form.class_number,
       stream_number:form.stream_number,
       campus_class_number:form.campus_class_number,
       academic_year_number:form.academic_year_number
    }
    loading.value = true;
    admissionList.value = []
    admissionStore.fetchAdmissionByFilters(data)
   }
   
   
   
   function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
   if (scrollTop + clientHeight >= scrollHeight) {
     let data = {
       page: (page.value+1),
       per_page: per_page.value,
       study_period_number:form.study_period_number,
       school_number:form.school_number,
       campus_number: form.campus_number,
       campus_class_number:form.class_number,
       stream_number:form.stream_number,
       academic_year_number:form.academic_year_number
    }
   
    admissionStore.fetchAdmissionByFilters(data)
   
   
   }
   }
   
   
   const fetchAdmissions = (data) => {
     if(data) {
   
   
       let current_page = data.page
       page.value = current_page
       loading.value = false
   
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
   
           const index = admissionList.value.findIndex(object => object.admission_number === list.admission_number);
   
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
          await admissionStore.fetchAdmissionByFilters(form.study_period_number, form.interview_number, form.stream_number, form.campus_number, form.class_number)
         }
       },
       {deep:true}
     )
   
     watch (
        () => enrolmentStore.newsEnrolmentResponse,
        async (data) => {
          if(data){
             doFetchAdmission()
          }
        },
        {deep:true}
      )
   
   const uploadStudentPhoto = (adm) => {
     studentNumber.value = adm?.student?.number
     studentPhoto.value = adm?.student?.photo
     uploadDialog.value = true
   }
   
   const successUpload = (data) => {
     if(data){
       uploadDialog.value = false
       doFetchAdmission()
     }
   }

   const studentModal = ref(false)

const showStudentProfile = (std) => {
  studentNumber.value = std
  studentModal.value = true
}
</script>
<template>
    <AppModal title="Enrol" v-model="mymodal" xl6>
      <EnrolModel :studentNumber="studentNum" :admissionData="admissionInfoData" :studentDataInfo="studentData"></EnrolModel>
    </AppModal>
    <AppModal title="Upload Student Photo" v-model="uploadDialog" xl>
      <file-uploader ref="profileUploadComponents" v-on:nextAction="successUpload" :studentNumber="studentNumber" :imageUrl="studentPhoto"></file-uploader>
    </AppModal>
    <AppModal title="Student Profile" v-model="studentModal" xl6>
      <StudentProfile  :studentNum="studentNumber"></StudentProfile>
    </AppModal>
  
    <div>
      <h5 class="card-title mb-3" style="font-size: 14px; margin-top: 2px;">ADMISSION OFFERS</h5>
      <div class=" grid grid-cols-4 gap-4 mx-4 mt-3">
        <div v-for="(adm, index) in admissionList" :key="index" >
          <div class="card admission-card">
            <div class="card-body ">
              <div class="student-profile">
                <img v-if="adm?.student?.photo" alt="photo" class="mb-1 profile-image mx-auto" :src="adm?.student?.photo" />
                <div v-else class="m-auto">
                  <i class="bi-person-circle text-[45px] text-[#8a8888]"></i>
                </div>
                <h6 class="mt-2">{{ adm.student.surname + " " + adm.student.second_name + " " + adm.student.other_name }}</h6>
                <p class="mt-1">ADN: {{ adm.student.adn }}</p>
              </div>
              <div class="admission-details">
                <p><b>Campus:</b> {{ adm.campus.name }}</p>
                <p><b>Class:</b> {{ adm.student.campus_class }}</p>
                <p><b>Stream:</b> {{ adm.stream.name }}</p>
                <p><b>Study Period:</b> {{ adm.studyPeriod.study_period_name }}</p>
                <p><b>Status: </b><span class="status-text">{{ adm.status }}</span></p>
              </div>
              <div class="d-flex justify-content-center align-items-center mt-3">
             
                <button class="btn btn-primary btn-sm" @click="showStudentProfile(adm.student.number)">
                            View Profile
                      </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaginationTemplate
        @perPageChanged="doFetchAdmission"
        v-model:perPage="per_page"
        :per_page="per_page"
        :total_items="total_items"
        :total_rows="total_rows">
      </PaginationTemplate>
    </div>
</template>
<style scoped>
.student-profile {
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
}

.profile-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

.student-profile h6,
.student-profile p {
  margin: 0;
  font-size: 14px;
}

.admission-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.admission-details h6 {
  margin: 5px 0;

}

.status-text {
  text-transform: uppercase;
  color: green;
  font-weight: bold;
  font-size: 13px;
}
</style>
