<template>
    <div>
  
      <div class="row">
        <div class="modal fade" id="admitMainModal" tabindex="-1" :class="{ show: admitshow }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">Submit</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
           <AdmitModel :selectedStudentNumber="selectedStudentNumber"></AdmitModel>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
     
  
      <!-- end  -->
      <div class="row mt-3">
        <div class="col-12">
          <div class="card">
            <div class="card-body" style="padding: 0;">
    <div class="container mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <!-- {{student_number ? '' : 'disabbled'}} -->
                  <h5 style="font-size: 14px;margin-top: 2px;">Student List{{ interviewM }} </h5>
                 <div class="col-12">
                  <div class="ant-alert-action mt-3">
                  <button  @click="showDialog" data-bs-toggle="modal" :data-bs-target="selectedStudentNumber.length > 0 ? '#' : ''" type="submit"
                   class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " 
                   style="float: rigt;"><i></i>Register Meal</button>
                </div>
  
                 </div>
              </div>
            </div>
          </div>
        </div>
        
  
  <!-- {{ selectedStudentNumber }} -->
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 14px !important;"
      >
      <thead >
          <tr>
            <th style="width: 5px;"><input type="checkbox"   class="checkbox-primary"></th>
            <th>ADN</th>
            <th>Student</th>
            <th>Gender</th>     
          </tr>
    <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div> -->
        </thead>
        <tbody>
          <tr v-for="(student, index) in interviewStudentList" :key="index">
            <td><input type="checkbox"  v-model="selectedStudents[index]" class="checkbox-primary"></td>
            <td>{{ student.Student.apn }}</td>
            <td> 
              {{ student.Student.surname + " " + student.Student.second_name + " " + student.Student.other_name}} </td>
            <td>
              {{  student.Student.gender }}
            </td>
            
            <td>
                    
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
    </template>
    
    <script setup>
  import {onMounted,reactive, ref,computed, watch} from "vue";
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useRouter} from "vue-router";
  import { useStudentApplicationStore } from "@/main/dashboard/studentApplication/store/student_application"
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  
  import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";
  import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";

  
  const enrollmentStore = useEnrolmentStore()
  const enrollmentList = ref( [])

  const interviewStudentList = ref( [])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const applicationStore= useApplicationStore()
  const  notificationStore  = useNotificationStore()
  const routerData = useRouter()
  const gradeDialog = ref( false)
  const admissionStore = useAdmissionStore()
  
  let  interviewNumber = routerData.currentRoute.value.query.interview_id
  let assessmentricsNumber = routerData.currentRoute.value.query.assessment_metric_id
  let interviewM = routerData.currentRoute.value.query.interview
  const studentOnInterviewId= ref(null)
  const studentData=ref(null)
  
  const selectedStuds = ref([])
  
  const studentNumber = ref(null)
  const studentApplicationStore = useStudentApplicationStore()
  const assessmentMetricsData = ref([])
  
  const enterScoreDialog = ref(false)
  const scoreDataList = ref([])
  
  
  
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
  
  
  const selectedStudents = ref([])
  const admitshow  = ref(false)
  
    
  
  const setStudentOnInterviewID = (id,studa) =>{
    studentOnInterviewId.value = id
    studentData.value=studa
    
  }
  const ScoreData = reactive ({
    score:null
  })
  
  onMounted(
      () => {
        applicationStore.fetchStudentsOnInterview(interviewNumber)
        enrollmentStore.fetchEnrolment()
      }
  )
  
  onMounted(
      () => {
        studentApplicationStore.fetchAssessmentMetricsOnInterview(interviewNumber)
      }
  )
  
  watch(
      () => applicationStore.StudentsOnInterviewResponse,
      async (data) => {
        if(data){
          // notificationStore.successToast("Success", data.message)
          interviewStudentList.value = data.data
        }
      },
      {deep:true}
  )



  watch (
    () => enrollmentStore.enrolmentResponse,
    async (data) => {
      if(data){
     notificationStore.successToast("Success", data.message)

        interviewStudentList.value = data.data
      }
    },
    {deep:true}
  )
  
  watch (
      () => applicationStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
        }
      },
      {deep:true}
  )
  
  watch (
        () => applicationStore.interviewResultesponse,
        async (data) => {
          if(data){     
            gradeDialog.value = false
            applicationStore.fetchStudentsOnInterview(interviewNumber)
  
          }
        },
        {deep:true}
    )
  
  
    watch(
      () => studentApplicationStore.assessmentMetricsOnInterviewResponse,
      async (data) => {
        if(data){
          // notificationStore.successToast("Success", data.message)
          assessmentMetricsData.value = data.data
        }
      },
      {deep:true}
  )
  const showD = (student) => {
    studentNumber.value = student
    // alert(studentNumber.value)
    enterScoreDialog.value = true
    // endpoint ===========
  
  }
  
  
  
  watch (
      () => studentApplicationStore.interviewAssessmentResultResponse,
      async (data) => {
        if(data){
          enterScoreDialog.value = false
        }
      },
      {deep:true}
  )
  
  const viewMark = (student,a) => {
    studentNumber.value = student
    // alert(studentNumber.value)
    ScoreData.score = student
    // endpoint ===========for view assessment
    studentApplicationStore.fetchAssessmentByStudent(ScoreData.score,assessmentricsNumber)
  }
  watch (
      () => studentApplicationStore.assessmentByStudentResponse,
      async (data) => {
        if(data){
         
            scoreDataList.value = data.data
        
        
        }
      },
      {deep:true}
  )
  
  const form = reactive({
  academic_year: null,
  study_period_number: null,
  campus_class_number: null,
  campus_number: null,
  stream_number:null,
  school_number:null
  })
  
  
    const selectedStudentNumber = computed(() => {
    const selectedNames = [];
    selectedStudents.value.forEach((isSelected, index) => {
      if (isSelected) {
        selectedNames.push(interviewStudentList.value[index].Student.number);
      }
    });
    return selectedNames;
  })
    
  
  
  
  
  const Admit = () => {
    const selectedStudentsData = selectedStudents.value
      .map((isSelected, index) => {
        if (isSelected) {
          const student = interviewStudentList.value[index];
          return student.Student.number;
        }
        return null;
      })
      .filter(data => data !== null);
  
  
      if (selectedStudentsData.length === 0) {
    notificationStore.errorToast("Error", "Please select at least one student to admit.");
    return;
  }
  
  // const confirmMessage = `Are you sure you want to admit the selected students: ${selectedStudentsData.join(', ')}?`;
    const confirmMessage = `Are you sure you want to admit the selected students ?`;
    if (window.confirm(confirmMessage)) {
      const formData = {
        student_number: selectedStudentsData,
        campus_class_number: form.campus_class_number, 
        campus_number: form.campus_number, 
        stream_number: form.stream_number, 
        study_period_number: form.study_period_number, 
        interview_number: interviewNumber, 
        academic_year_number:form.academic_year,
        school_number:form.school_number,
      };
      alert(JSON.stringify(formData))
     //endpoint to submit
    //  admissionStore.admitStudent(formData)
  
    } else {
      // User clicked Cancel, do nothing
      // Optionally, you can clear the selected students array or perform other actions
    }
  
  }
  
  
  watch (
  () => admissionStore.admitStudentResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
    }
  },
  {deep:true}
  )
  
  watch (
  () => admissionStore.errorMessage,
  async (data) => {
    if(data){
      errorMessage.value = data.message
      notificationStore.errorToast("Error",data.message)
    }
  },
  {deep:true}
  )
  
  
  
  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
  }
  
  const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
  }
  
  
  //fetchacadmicYear
  const fetchAcademicYear = (campusN) =>{
  // alert(campusN)
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
        schoolStore.fetchSchools()
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
  
  
  const showDialog = () => {
    // admitshow.value = true
    if (selectedStudentNumber.value.length === 0) {
      admitshow.value=false
      notificationStore.errorToast("Error", "Please select at least one student to offer admission.");
    } else {
      admitshow.value = true;
    }
  }
  
  
    </script>
  
  
    
    <style scoped>
  
    </style>