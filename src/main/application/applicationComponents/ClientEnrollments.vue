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
import StudentProfile from '@/main/teacher/students/StudentProfile.vue';


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
  enrollmentStore.fetchEnrolment(data)

}

function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {



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

const uploadStudentPhoto = (enrolData) => {
  studentNumber.value = enrolData?.student_number
  studentPhoto.value = enrolData?.photo
  uploadDialog.value = true
}

const successUpload = (data) => {
  if(data){
    uploadDialog.value = false
    doFetchEnrollent()
  }
}
const studentModal = ref(false)

const showStudentProfile = (std) => {
  studentNumber.value = std
  studentModal.value = true
}

</script>



<template>
  <div>
    <AppModal title="Upload Student Photo" v-model="uploadDialog" xl>
      <file-uploader ref="profileUploadComponents" v-on:nextAction="successUpload"  :studentNumber="studentNumber" :imageUrl="studentPhoto"></file-uploader>
    </AppModal>

    <AppModal title="Student Profile" v-model="studentModal" xl6>
      <StudentProfile  :studentNum="studentNumber"></StudentProfile>
    </AppModal>


    <div id="promoteModal" :class="{ show: promDialog }" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Promotion</h6>
            <button aria-label="Close" class="btn-close btn-sm" data-bs-dismiss="modal" style="margin-right: 5px;" type="button"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <PromoteStudent :studentNumber="studentNumber"></PromoteStudent>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12">
        <div class="">
          <div class="" style="padding: 0;">
            <div class="container mt-1 mx-2">
              <div class="row">
                <div class="col-lg-12">
                  <h5 style="font-size: 14px;margin-top: 2px;">ENROLLED STUDENTS</h5>
                </div>
              </div>

              <!-- Pagination Template -->
              <PaginationTemplate
                v-model:perPage="per_page"
                :per_page="per_page"
                :total_items="total_items"
                :total_rows="total_rows"
                @perPageChanged="doFetchEnrollent">
              </PaginationTemplate>

              <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              
              <div v-else-if="enrollmentList.length === 0" class="text-center my-4">
                <p>No students enrolled.</p>
              </div>

              <!-- Profile Grid Layout -->
              <div v-else class="grid grid-cols-4 gap-4 mx-4 mt-3">
                <div 
                  v-for="(enrolData, index) in enrollmentList" 
                  :key="index" 
                  class="profile-card ">
                  
                  <div class="profile-image-container">
                    <img 
                      v-if="enrolData?.photo" 
                      :src="enrolData?.photo" 
                      alt="Student photo" 
                      class="profile-image mx-auto">
                    <div v-else class="placeholder-icon">
                      <i class="bi-person-circle"></i>
                    </div>
                  </div>

                  <div class="profile-details">
                    <h6 class="student-name">
                      {{ enrolData.student_surname + " " + enrolData.student_second_name + " " + enrolData.student_other_name }}
                    </h6>
                    <p class="text-sm"><b>ADN:</b> {{ enrolData.adn }}</p>
                    <p class="text-sm"><b>School: </b>{{ enrolData.school }}</p>
                    <p class="text-sm"><b>Campus:</b> {{ enrolData.campus }}</p>
                    <p class="text-sm"><b>Study Period:</b> {{ enrolData.study_period }}</p>
                    <p class="text-sm"><b>Class: </b>{{ enrolData.class }}</p>
                    <p class="text-sm"><b>Enrolled On</b>: {{ enrolData.enrollment_date }}</p>

                    <div class="actions">
                      <div v-if="can('upload_student_photo','manage')" 
                        class="action-button" 
                        @click="uploadStudentPhoto(enrolData)">
                        <i class="bi bi-card-image"></i>
                        Upload Photo
                      </div>
                   
                      <router-link
                      :to="{name:'client_dashboard', query:{s:'student',st_id:enrolData.student_number}}"
                      
                        class="action- btn btn-primary btn-sm">
                        <i class="bi bi-person"></i>
                        View Details
                      </router-link>
                  
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
</template>



<style scoped>
/* .profile-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
} */

.profile-card {
  background-color: white;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

.profile-image-container {
  text-align: center;
  padding: 20px;
}

.profile-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #0d6dfa;
}

.placeholder-icon {
  font-size: 50px;
  color: #8a8888;
}

.profile-details {
  padding: 15px;
}

.student-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  text-transform: capitalize;
}

.text-sm {
  /* font-size: 14px; */
  margin-bottom: 5px;
  color: #666;
}

.actions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.action-button {
  display: inline-block;
  text-decoration: none;
  padding: 8px 12px;
  font-size: 14px;
  color: #0d6dfa;
  border: 1px solid #0d6dfa;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #0d6dfa;
  color: white;
}
</style>
