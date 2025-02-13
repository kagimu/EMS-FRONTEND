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

const formData = ref({
  check_in_time: "",
  check_out_time: "",
  present: "",
  user_number: "",
  campus_class_number: "",
  campus_number: "", 
  absence_reason: "",
  school_number: "",
  date: "",

})


const saveAttendance = () => {
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


</script>



<template>
  <div> 


    <!-- end  -->
    <div class="row">
      <div class="col-12">
        <div class="">
          <div class="" style="padding: 0;">
            <div class="containe mt-1 mx-2">
              <div class="row">
                <div class="col-lg-12">
                  <div class="">
                    <div class="">
                      <div class="row">
                        <div class="col-12">
                          <div class="mt-1">
                            <div class="row mx-auto">

                              <div class="row">
                                <div class="col-3">
                                  <div class="mb-2">
                                    <select
                                        v-model="form.school_number"
                                        class="form-select form-select-sm" required
                                        style="box-shadow: none;"
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
                                        v-model="form.campus_number"
                                        class="form-select form-select-sm"
                                        required style="box-shadow: none;"
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
                                        v-model="form.campus_class_number"
                                        class="form-select form-select-sm" required
                                        style="box-shadow: none;"
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
                                        v-model="form.stream_number"
                                        class="form-select form-select-sm" required
                                        style="box-shadow: none;"
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
                                        v-model="form.academic_year_number"
                                        class="form-select form-select-sm" required
                                        style="box-shadow: none;"
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
                                        v-model="form.study_period_number"
                                        class="form-select form-select-sm" required
                                        style="box-shadow: none;"
                                        @change="filterByStudyPeriod()"
                                    >
                                      <option disabled value="">-Filter By StudyPeriod-</option>
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
                  v-model:perPage="per_page"
                  :per_page="per_page"
                  :total_items="total_items"
                  :total_rows="total_rows"
                  @perPageChanged="doFetchEnrollent"></PaginationTemplate>

              <div v-if="loading" class="text-center my-4">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div v-else-if="enrollmentList.length === 0" class="text-center my-4">
                <p>There is no data found</p>
              </div>
              <div v-else>
                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">
                  <table
                      class="table table-hover caption-top mt-4 table-sm table-striped"
                      style="font-size: 13px !important;"
                  >
                    <thead >
                    <tr>
                    
                      <th>Student</th>
                      <!-- <th>School</th> -->
                      <th>Campus</th>
                      <!-- <th>StudyPeriod</th> -->
                      <th>Class</th>
                      <th style="width: 15%;">Check In</th>
                      <th style="width: 15%;">Check Out</th>
                    </tr>

                    </thead>
                    <tbody>
                    <tr v-for="(enrolData,index) in enrollmentList" :key="index" >
                     
                      <td style="text-transform: capitalize;">
                        <div class="flex flex-row items-center">
                          <div class="text-center">
                            <img v-if="enrolData?.photo" :src="enrolData?.photo" alt="photo" class="w-[40px] h-[40px] border rounded-full"/>
                            <div v-else class="m-auto">
                              <i class="bi-person-circle text-[40px] text-[#8a8888]"></i>
                            </div>
                          </div>
                          <div class="ml-2">{{ enrolData.student_surname + " "+ enrolData.student_second_name + " "  + enrolData.student_other_name }}</div>
                        </div>

                      </td>
                      <!-- <td>{{enrolData.school }}</td> -->
                      <td>{{ enrolData.campus }}</td>
                      <!-- <td>{{ enrolData.study_period }}</td> -->
                      <td>{{ enrolData.class }}</td>
             
                      <td>
                          <input type="time" class="form-control form-control-sm" v-model="enrolData.check_in">
                        </td>

                      <td>
                        <input type="time" class="form-control form-control-sm" v-model="enrolData.check_out">     
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


  </div>
</template>



<style scoped>

</style>