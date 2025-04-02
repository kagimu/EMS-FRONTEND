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
// import {usePromotionStore} from "@/main/settings/promotion/store/promotion.js"
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import AppModal from "@/components/AppModal.vue";
import FileUploader from "@/components/FileUploader.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import NewEnrollmentModel from "@/main/dashboard/enrollment/NewEnrollmentModel.vue"
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";

const studyPeriodStore = useStudyPeriodStore()

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const enrollmentList = ref( [])
const  notificationStore  = useNotificationStore()
const enrollmentStore = useEnrolmentStore()


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

const curriculumList = ref([])
const levelList = ref([])

const levelStore = useLevelStore()
const enrolDialog = ref(false)
const studentNum=ref(null)
const admissionInfoData = ref(null)
const studentData = ref(null)


const form = reactive({
  study_period_number: "",
  campus_number: "",
  stream_number:"",
  school_number:"",
  academic_year_number:"",
  class_number:"",
  status:"",
  curriculumNumber:"",
  level:""
})


onMounted(() => {
      schoolStore.fetchSchools()
      // doFetchEnrollent()
    }
)

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
  doFetchEnrollent()
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
  levelStore.fetchCampusCurriculum(campus_number)
  doFetchEnrollent()
}

const fetchAcademicYear = (classN) =>{
  academicYearStore.fetchAcademicYearByCampus(classN)
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

const fetchCampusLevel = (curriculumNumber) => {
  classStore.fetchCampusLevel(curriculumNumber)
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
    class_number:form.class_number,
    stream_number:form.stream_number,
    academic_year_number:form.academic_year_number,
    curriculum_number:form.curriculumNumber,
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
      class_number:form.class_number,
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

doFetchEnrollent()
}


watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)

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
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    }
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
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
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


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

const enrolStudent = (enrolData) => {
  // alert(JSON.stringify(enrolData))
  studentNum.value = enrolData.student_number
  studentData.value = enrolData
  enrolDialog.value = true
}

const closeDialog = () => {
  enrolDialog.value = false
}


</script>




<template>
  <div class="card p-1">

    <AppModal title="Enrol" v-model="enrolDialog" xl6>
      <NewEnrollmentModel :studentNumber="studentNum" :studentDataInfo="studentData" @closeDialog="closeDialog"></NewEnrollmentModel>
    </AppModal>

    <AppModal title="Upload Student Photo" v-model="uploadDialog" xl>
      <file-uploader ref="profileUploadComponents" v-on:nextAction="successUpload"  :studentNumber="studentNumber" :imageUrl="studentPhoto"></file-uploader>
    </AppModal>

    <div id="promoteModal" :class="{ show: promDialog }" class="modal fade"  tabindex="-1">
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


              <div>
                <div class="row mt-4">
                  <h5 style="font-size: 14px;margin-top: 2px;">ENROLLED STUDENTS</h5>
                  <div class="row">
                    <div class="col-3">
                      <div class="mb-2">
                        <!-- <label class="text-sm"><small>School</small> </label> -->
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
                        <!-- <label class="text-sm"><small>Campus</small>  </label> -->
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
                        <select
                            style="box-shadow: none;"
                            class="form-select form-select-sm" required
                            v-model="form.academic_year_number"
                            @change=""
                        >
                          <option disabled value="">-filter AcademicYear-</option>
                          <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                        </select>
                      </div>
                    </div>

                    <div class="col-2">
                      <div class="mb-2">
                        <!-- {{ classList }} -->
                          <!-- {{ classList }} -->
                        <select
                            style="box-shadow: none;"
                            class="form-select form-select-sm" required
                            v-model="form.class_number"
                            @change="fetchStreamsAndStudyPeriod(form.class_number)"
                        >
                          <option disabled value="">-filter by class-</option>
                          <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
                            {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-2">
                      <div class="mb-2">
                        <!-- <label class="text-sm"><small>Stream</small> </label> -->
                        <select
                            style="box-shadow: none;"
                            class="form-select form-select-sm" required
                            v-model="form.stream_number"
                            @change="filterByStream()"
                        >
                          <option disabled value="">-filter by Stream-</option>
                          <option v-for="(slist, index) in streamList" :key="index" :value="slist.stream_number">{{ slist.name }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="col-2">
                      <div class="mb-2">
                        <select
                            style="box-shadow: none;"
                            class="form-select form-select-sm" required
                            v-model="form.study_period_number"
                            @change="filterByStudyPeriod()"
                        >
                          <option disabled value="">filter by Study period -</option>
                          <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

                        </select>
                      </div>
                    </div>


                    <div class="col-3">
                      <div class="mb-2">
<!--                        ///search input-->
                        <input
                            type="text"
                            v-model="searchQuery"
                            class="form-control"
                            placeholder="Search ....."
                        >

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
                      class="table table-hover caption-top mt-1 table-sm table-striped"
                      style="font-size: 13px !important;"
                  >
                    <thead >
                    <tr>
                      <th style="width: 2px;">#</th>
                      <th>ADN</th>
                      <th>Student</th>
                      <th>School</th>
                      <th>Campus</th>
                      <th>StudyPeriod</th>
                      <th>Class</th>
                      <th>EnrolledOn</th>
                      <th>Action</th>
                    </tr>

                    </thead>
                    <tbody>
                    <!-- {{ enrollmentList }} -->
                    <tr v-for="(enrolData,index) in enrollmentList" :key="index" >
                      <td>{{ index+1 }}</td>
                      <td>{{ enrolData.adn }}</td>
                      <td style="text-transform: capitalize;">
                        <div class="flex flex-row items-center">
                          <div class="text-center">
                            <img v-if="enrolData?.photo" :src="enrolData?.photo" alt="photo" class="w-[40px] h-[40px] border rounded-full"/>
                            <div v-else class="m-auto">
                              <i class="bi-person-circle text-[40px] text-[#8a8888]"></i>
                            </div>
                          </div>
                          <div class="ml-2">
                            <router-link :to="{name:'student-profile-details', query:{st_id:enrolData.student_number}}"
                                         class="link link-primary text-decoration-none">
                              {{ enrolData.student_surname + " "+ enrolData.student_second_name + " "  + enrolData.student_other_name }}
                            </router-link>
                          </div>
                        </div>

                      </td>
                      <td>{{enrolData.school }}</td>
                      <td>{{ enrolData.campus }}</td>
                      <td>{{ enrolData.study_period }}</td>
                      <td>{{ enrolData.class }}</td>
                      <td>{{ enrolData.enrollment_date }}</td>
                      <td>
<!--                           <div v-if="can('upload_student_photo','manage')" >-->
<!--                             <div class="mr-2 rounded-sm px-2 text-[#0d6dfa] cursor-pointer m-1" style="border: 1px solid #0d6dfa;" @click="uploadStudentPhoto(enrolData)">-->
<!--                               <i class="bi bi-card-image cursor-pointer mr-1"></i>-->
<!--                               Upload Photo-->
<!--                             </div>-->
<!--                             <router-link-->
<!--                                 v-if="can('view_profile','manage')"-->
<!--                                 :to="{name:'student-profile-details', query:{st_id:enrolData.student_number}}"-->
<!--                                 class="text-decoration-none">-->
<!--                                   <div class="mr-2 rounded-sm px-2 text-[#0d6dfa] cursor-pointer m-1" style="border: 1px solid #0d6dfa;">-->
<!--                                     <i class="bi bi-person cursor-pointer mr-1"></i>-->
<!--                                     View Profile-->
<!--                                   </div>-->
<!--                             </router-link>-->
<!--                           </div>-->



                        <div v-if="can('upload_student_photo','manage')" >
                          <div class="dropdown text-xs">
                            <button class="btn btn-outline-primary dropdown-toggle btn-sm" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                              -select-
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                              <li>
                                <div class="dropdown-item cursor-pointer" @click="uploadStudentPhoto(enrolData)">
                                  <i class="bi bi-card-image cursor-pointer mr-1"></i> Upload Photo
                                </div>
                              </li>
                              <li v-if="can('view_profile','manage')">
                                <router-link :to="{name:'student-profile-details', query:{st_id:enrolData.student_number}}" class="dropdown-item text-decoration-none">
                                  <i class="bi bi-person cursor-pointer mr-1"></i> View Profile
                                </router-link>
                              </li>

                              <li>
                                <div class="dropdown-item cursor-pointer" @click="enrolStudent(enrolData)">
                                  <i class="bi bi-people-fill cursor-pointer mr-1"></i> Enrol
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>

                      </td>

                    </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>


</template>



<style scoped>

</style>