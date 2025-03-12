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


const form = reactive({
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  school_number:"",
  academic_year_number:"",
  status:""
})



const formData = reactive({
  check_in_time: "",
  check_out_time: "",
  present: "",
  user_number: "",
  campus_class_number: "",
  campus_number: "",
  absence_reason: "",
  date: "",
  student_number:""

})

const adn_no = ref(null)


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
  // classStore.fetchClassStreams(campusN)

  let sData = {
     campus_number:form.campus_number,
     class_number:classN,
     campus_curriculum_number:form.curriculumNumber

    }
    classStore.fetchClassStreams(sData)

  doFetchEnrollent()
}



const filterByStream = () => {
  doFetchEnrollent()
}

const filterByStudyPeriod = () => {
  doFetchEnrollent()
}


const doFetchEnrollent = () =>{
  if(!form.school_number){
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


const saveAttendanceData = () =>{
  formData.school_number = form.school_number
  // alert(JSON.stringify(formData))
  attendanceStore.newStudentAttendance(formData)
}


watch(
    () => attendanceStore.newStudentAttendanceResponse,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep: true}
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




    <!-- end  -->
    <div class="row">
      <div class="col-12">
        <div class="">
          <div class="" style="padding: 0;">
            <div class="row">
              <div class="col-lg-12">
                <select class="form-control form-select mb-1">
                  <option value="">- select -</option>
                  <option value="check_in">Check In</option>
                  <option value="check_out">Check Out</option>
                </select>
              </div>
              <br>
              
  
              <div class="col-lg-12 mt-2" >
                <label>Time</label>
                <input v-on:blur="saveAttendanceData" type="time" class="form-control form-control-sm" v-model="formData.check_in_time">
              </div>
              <br>
              <div class="col-lg-12 mt-2" >
                <label>Comment</label>
                <textarea v-on:blur="saveAttendanceData" class="form-control form-control-sm" v-model="formData.absence_reason"></textarea>
              </div>


              <div class="col-lg-12 mt-2" >
                <button style="float: right;" class="btn btn-primary mb-2">Submit</button>
                
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