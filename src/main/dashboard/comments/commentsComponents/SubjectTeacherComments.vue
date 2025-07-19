<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import NewSubjectTeacherComment from "@/main/dashboard/comments/commentsComponents/NewSubjectTeacherComment.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);
import printJS from "print-js";

import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useRouter} from "vue-router";


const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()
const commentsList = ref(null)
const showCommentModal = ref(false)
const headTeacherCommentList = ref([])
const editMode = ref(false)

const levelStore = useLevelStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const routerData = useRouter()

const campusCurriculumDataInfo = ref(null)
const campus_level_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const class_number = ref("")
const campusLevelList = ref(null)
const academicYearList = ref(null)
const studyPeriodList = ref([])
const campusClassList = ref(null)
const schoolN = routerData.currentRoute.value.query.sch
const campusNumber = routerData.currentRoute.value.query.id
const schoolList = ref([])
const school_number = ref("")
const campus_number = ref("")
const campusList = ref([])
const curriculumList = ref([])
const curriculumNumber = ref("")
const campus_curriculum_number = routerData.currentRoute.value.query.crr
let  curriculumNumberParent = routerData.currentRoute.value.query.cr

onMounted(
    async () => {
      schoolStore.fetchSchools()
      fetchCampusLevel()

    }
)


const addComments = () => {
  headTeacherCommentList.value = ""
  editMode.value = false
  showCommentModal.value = true
}

const editComments = (comm) => {
  headTeacherCommentList.value = comm
  editMode.value = true
  showCommentModal.value = true
}



const deleteThisData = async (id,name) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
  if (agreed) {
    let data = {
      id : id
    }

    await teacherCommentStore.deleteHeadTeacherComment(data)
  }
}

watch(
    () => teacherCommentStore.newSubjectTeacherCommentResponse,
    async (data) => {
      if(data){
        showCommentModal.value = false
        await teacherCommentStore.fetchTeacherComments()
      }
    }
)



watch(
    () => teacherCommentStore.deleteHeadTeacherCommentResponse,
    async (data) => {
      if(data){
        await teacherCommentStore.fetchTeacherComments()
        notificationStore.successToast("success",data.message)
      }
    }
)

watch(
    () => teacherCommentStore.errorMessage,
    async (data) => {
      if(data){
        await teacherCommentStore.fetchTeacherComments()
        notificationStore.errorToast("error",data.error)

      }
    }
)

const printComments = () => {
  printJS({
    printable: "teacher-comments",
    type: "html",
    targetStyles: ["*"],
    scanStyles: false,
    style: `
      body {
        font-family: Arial, sans-serif;
        color: #000;
        margin: 20px;
      }
    `,
    documentTitle: `teacher-comments`,
    showModal: true,
  });
};
const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


const fetchClassesByLevel = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)

  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
}


const fetchCommentsAndStudyPeriod = (classNumber) =>{

  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:campus_curriculum_number,
        academic_year_number:academic_year_number.value,
        class_number:classNumber,
        school_number:schoolN
      }
  )

  fetchTeacherAllComments(classNumber)
}


const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
}


const fetchCurriculum = (campus_level_number) => {
  levelStore.fetchCampusCurriculum(campus_level_number)
}

watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
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
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
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
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data

      }
    }
)

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)

const fetchTeacherAllComments = (classN) => {
  let data = {
    campus_class_number:classN
  }
   teacherCommentStore.fetchSubjectTeacherComment(data)
}

watch(
    () => teacherCommentStore.subjectTeacherCommentResponse,
    async (data) => {
      if(data){
        commentsList.value = data.data
      }
    }
)

</script>

<template>

  <div>


    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode?'Edit Comment':'Add Subject Teachers Comment'" v-model="showCommentModal" lg>
      <NewSubjectTeacherComment :headTeacherCommentList="headTeacherCommentList"></NewSubjectTeacherComment>
    </AppModal>



    <div class="row">
      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Subject Teacher's Comments</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addComments">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add SubjectTeacher Comment
          </button>

          <button @click="printComments" style="padding: 5px 10px; background-color: #2e2487; color: white; border: none; border-radius: 5px; cursor: pointer;">
            <i class="bi bi-printer"></i> Print
          </button>
        </div>

        <div class="row bg-white mx-auto mt-2">
          <div class="col-3">
            <label class="text-sm"><small>Level</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="campus_level_number"
                @change="fetchClassesByLevel(campus_level_number)"
            >
              <option disabled value="">--Select Level--</option>
              <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
            </select>
          </div>

          <div class="col-3">
            <label class="text-sm"><small>Academic Year</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="academic_year_number"
            >
              <option disabled value="">--Select Academic Year--</option>
              <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                {{list.code+". "+list.academic_year_name}}
              </option>
            </select>
          </div>

          <div class="col-3">
            <label class="text-sm"><small>Class</small>
            </label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="class_number"
                @change="fetchCommentsAndStudyPeriod(class_number)"

            >
              <option disabled value="">Select</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list.name+" [ "+list.abbreviation+" ]"}}</option>
            </select>
          </div>

<!--          <div class="col-3">-->
<!--            <label class="text-sm"><small>Study Period</small>-->
<!--            </label>-->
<!--            <select-->
<!--                style="box-shadow: none;"-->
<!--                class="form-select form-select-sm" required-->
<!--                v-model="study_period_number"-->
<!--                @change="fetchAssessmentMetricbyStudy(study_period_number)"-->
<!--            >-->
<!--              <option disabled value="">Select</option>-->
<!--              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>-->
<!--            </select>-->
<!--          </div>-->
        </div>

        <div id="teacher-comments" style="margin: 0px; font-family: Arial, sans-serif;">
          <table class="table table-hover caption-top mt-5 table-sm text-sm"
                 style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #ccc;">
            <thead>
            <tr style="background-color: #f2f2f2; border-bottom: 2px solid #ccc;">
              <th style="text-align: left; border: 0px solid #ccc;">#</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Comment</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Class</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Academic Year</th>
              <th style="padding: 8px; text-align: left; border: 0px solid #ccc;">Study Period</th>
              <th style="padding: 8px; text-align: center; border: 0px solid #ccc;">#</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(com, index) in commentsList" :key="index"
                style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px; border: 0px solid #ccc;">{{ index+1}}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.comment }}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.class }}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.academic_year_name	 }}</td>
              <td style="padding: 8px; border: 0px solid #ccc;">{{ com.study_period }}</td>
              <td style="padding: 8px; text-align: center; border: 0px solid #ccc;">
                <button @click="editComments(com)"
                        style="background: none; border: none; cursor: pointer; margin-right: 6px;">
                  <i class="bi-pencil" style="font-size: 13px; color: #0520ab;"></i>
                </button>
                <button @click="deleteThisData(com.id, com.comment)"
                        style="background: none; border: none; cursor: pointer;">
                  <i class="bi-trash" style="font-size: 13px; color: #ca0b0b;"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>


      </div>
    </div>



  </div>

</template>

<style scoped>

</style>