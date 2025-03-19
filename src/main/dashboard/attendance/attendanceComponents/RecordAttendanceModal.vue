<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
import {usePromotionStore} from "@/main/settings/promotion/store/promotion.js"
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import {useAttendanceStore} from "@/main/dashboard/attendance/store/attendance.js";
import StudentAttendanceHistory from "@/main/dashboard/attendance/attendanceComponents/StudentAttendanceHistory.vue";


import { useAbility } from '@casl/vue';

const { can } = useAbility()

const time = ref("");
 
const enrollmentList = ref( [])
const  notificationStore  = useNotificationStore()
const enrollmentStore = useEnrolmentStore()
const promotionStore = usePromotionStore()
const attendanceStore = useAttendanceStore()
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
const total_items = ref(0)
const total_rows = ref(0)
const studentNumber = ref(null)
const isComment = ref(false)
const mymodal = ref(false)
const buttonLoader = ref(false)


const form = reactive({
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  school_number:"",
  academic_year_number:"",
  status:""
})

const props = defineProps({
     userNumber: String,
     studentNumber:String,
     attendance_number:String
   })


const formData = reactive({
  checkout_time: "",
  user_number: "",
  comment: "",
  date: "",
  student_number:""

})

const adn_no = ref(null)


onMounted(() => {
      schoolStore.fetchSchools()
      // doFetchEnrollent()
      getStudentInfo();
    }
)

const getStudentInfo = () => {
  if(props.studentNumber){
    formData.student_number = props.studentNumber
  }
  if(props.userNumber){
    formData.user_number = props.userNumber
    
  }
}


watch(
    () => props.studentNumber,
    async (data) => {
      if (data) {
       getStudentInfo()
      }
    }
)



const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
  // doFetchEnrollent()
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
  // doFetchEnrollent()
}

const fetchAcademicYear = (campusN) =>{
  academicYearStore.fetchAcademicYearByCampus(campusN)
  // classStore.fetchClassStreams(campusN)

  let sData = {
     campus_number:form.campus_number,
     class_number:classN,
     campus_curriculum_number:form.curriculumNumber

    }
    classStore.fetchClassStreams(sData)

  // doFetchEnrollent()
}



const filterByStream = () => {
  // doFetchEnrollent()
}

const filterByStudyPeriod = () => {
  doFetchEnrollent()
}


const doFetchEnrollent = () =>{
  if(!form.study_period_number){
    return
  }

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

        // const index = enrollmentList.value.findIndex(object => object.number === list.number);
        //
        // if (index === -1) {
        //   enrollmentList.value.push(list);
        // }


        const index = enrollmentList.value.findIndex(object => object.number === list.number);
        if (index === -1) {
          list.status = "";
          // isComment.value = false
          // formData.present="YES"
          // Add status property
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


const  setAttendanceStatus = (status,adn,userN,stdN) => {
  adn_no.value = adn
  formData.user_number = userN
  formData.student_number = stdN


  if(status === "present"){
    isComment.value = false
    formData.present="YES"
  }else {
    isComment.value = true
    formData.present="NO"
  }
}

const check = ref(null)
const check_inTime = ref(null)

const saveAttendanceData = () =>{
  formData.present="NO"
  formData.checkout_time = check_inTime
  formData.number = props.attendance_number
  buttonLoader.value = true
  
  // if(check.value == "checkIn"){
  //  formData.check_in_time = check_inTime
  // }else {
   
  // }


  // alert(JSON.stringify(formData))
  attendanceStore.updateStudentAttendance(formData)
}


watch(
    () => attendanceStore.updateStudentAttendanceResponse,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
        buttonLoader.value = false
      }
    }
)

watch(
    () => attendanceStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep: true}
)


const openRecordAttendance = (student) => {
  mymodal.value = true;
}


</script>



<template>
  <div>


    <div class="row">
        <div class="col-12">
          <div class="mt-2 ml-3">
      <!-- <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="scope-tab" data-bs-toggle="tab" data-bs-target="#scope" type="button" role="tab" aria-controls="scope" aria-selected="false"><small>CheckOut</small></button>
          <button class="nav-link navColor " id="details-tab" data-bs-toggle="tab" data-bs-target="#details" type="button" role="tab" aria-controls="scope" aria-selected="false"><small>Attendance History</small></button>
        </div>
      </nav> -->
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="scope" role="tabpanel" aria-labelledby="scope-tab" tabindex="0">
          <div class="row mb-2">
      <div class="col-12">
        <div class="">
          <div class="" style="padding: 0;">
            <div class="row">
              <div class="col-lg-6 mt-2">
                <div class="row">

<div class="col-lg-12 d-flex align-items-center gap-3">
  <!-- <div class="form-check">
    <input class="form-check-input" type="radio" name="check_option" id="check_in" v-model="check" value="checkIn" style="width: 20px; height: 20px;">
    <label class="ms-2 xs" for="check_in">Check In</label>
  </div> -->
  <!-- <div class="form-check">
    <input class="form-check-input" type="radio" name="check_option" id="check_out" v-model="check" value="checkOut" style="width: 20px; height: 20px;">
    <label class="ms-2 xs" for="check_out">Check Out</label>
  </div> -->
</div>



</div>

              </div>
              
              
  
              <div class="col-lg-12 " >
                <label><small>Date</small></label>
                <input  type="date" class="form-control form-control-sm" v-model="formData.date">
              </div>
              <div class="col-lg-12 mt-2" >
                <label><small>Time</small></label>
                <input  type="time" class="form-control form-control-sm" v-model="check_inTime">
              </div>
              <br>
              <div class="col-lg-12 mt-2" >
                <label>Reason</label>
                <textarea  class="form-control form-control-sm" v-model="formData.comment"></textarea>
              </div>


              <div class="col-lg-12 mt-2" >
                <button style="float: right;" class="btn btn-primary mb-2" @click="saveAttendanceData" >Submit</button>
                <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
               role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
            </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
        </div> 
        <div class="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab" tabindex="0">
           <StudentAttendanceHistory></StudentAttendanceHistory>
        </div> 
  
  
            </div>
          </div>
        </div>
  
  
      </div>



    <!-- end  -->
  


  </div>
</template>



<style scoped>

</style>