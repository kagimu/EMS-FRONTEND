<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import AppModal from "@/components/AppModal.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import { useAbility } from '@casl/vue';
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import NewSchemeOfWork from "@/main/dashboard/curriculum/schemeOfWork/NewSchemeOfWork.vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import NewLessonPlan from "@/main/dashboard/curriculum/schemeOfWork/NewLessonPlan.vue";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import SchemeOfWorkPdfTemplate from "@/main/dashboard/curriculum/schemeOfWork/SchemeOfWorkPdfTemplate.vue";
import ManageLessonPlanDetails from "./ManageLessonPlanDetails.vue";
import ManageLessonSessions from "./ManageLessonSessions.vue";
  
const levelStore = useLevelStore()
  const  notificationStore  = useNotificationStore()
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const classStore = useClassesStore()

  const { can } = useAbility()
  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const curriculumList = ref([])
  const levelList = ref([])


  const level = ref( "")
const curriculumNumber = ref( "")
const schemeOfWorkRef = ref( null)
const academic_year_number = ref( "")
const schemeDataInfo = ref( {})
const curriculumDialog = ref( false)
const exportLoader = ref( false)
const lessonPlanDialog = ref( false)
const lessonPlanDetailsDialog = ref( false)
const lessonPlanInfo = ref( "")
let selectedClass = ref( "")
const learningAreaStore = useLearningAreaStore()
const scheme_subject_number = ref("")
const learningAreaRef = ref(null)
const schemeOfWorkList = ref([])
const schemeSubjectList = ref([])
const academicYearList = ref([])
const commons = useCommonsStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
const subjectStore = useSubjectStore()

let classNo = ""
let campusNumber = ""
let curriculumNo = ""
let levelNo = ""

if(classNo){
  selectedClass.value =  form.class_number
}


  onMounted(() => {
    schoolStore.fetchSchools()
   }
  )

  const getSubjects = (classN) => {
    subjectStore.fetchAcademicYearByClass(classN)
    subjectStore.fetchSchemeSubjectByClass(classN)
  }
  
  const form = reactive({
  class_number: "",
  campus_class_number: "",
  campus_number: "",
  school_number:"",
  curriculumNumber:"",
  level:""
  })
  
  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
  }
  
  const fetchClasses = (campus_level_number) => {
    levelStore.fetchCampusCurriculum(campus_level_number)
  }
  

  const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
  }
  
  const fetchLevelClasses = (levelNumber) => {
    classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
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
  
  


const addLessonPlan = (schemeData) => {
  schemeDataInfo.value = {...{class_number:selectedClass.value},...{subject_number:scheme_subject_number.value},...schemeData}
  lessonPlanDialog.value = true
}

const schoolInfo = ref(null)

const viewLessonPlan = (lst) => {
  let schoolData = {
  class_number: form.class_number,
  campus_class_number: form.campus_class_number,
  campus_number: form.campus_number,
  school_number:form.school_number,
  curriculumNumber:form.curriculumNumber,
  level:form.level,
  subject_number:scheme_subject_number.value
  }
  schoolInfo.value = schoolData


  lessonPlanDetailsDialog.value = true
  lessonPlanInfo.value = lst
}

const addSchemeOfWork = () => {
  curriculumDialog.value = true
}

const exportSchemeOfWorkPdf = () => {
  if(schemeOfWorkList.value && schemeOfWorkList.value.length < 1){
    notificationStore.warningToast("Warning", "No details found on scheme of work")
    return
  }
  exportLoader.value = true
  schemeOfWorkStore.exportPdf(commons.initializePdfData("Scheme Of Work", schemeOfWorkRef.value.innerHTML));
}


const changeMenu = (classNo) => {
  if(classNo){
    router.push({name:'scheme-of-work', query:{id:campusNumber,crr:curriculumNo,lv:levelNo,c:classNo}})
  }

}


const filterSchemeSubject = () => {
  schemeOfWorkList.value = []
  let data = {
    academic_year_number:academic_year_number.value,
    subject_number:scheme_subject_number.value,
    class_number:form.class_number
  }
  schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
}


const fetchAcademicYrList = (classNumber) => {
  subjectStore.fetchAcademicYearByClass(classNumber)
}



watch(
    () => schemeOfWorkStore.newSchemeOfWorkResponse,
    async (data) => {
      if(data){
        if(selectedClass.value) {
          let data = {
            academic_year_number:academic_year_number.value,
            subject_number:scheme_subject_number.value,
            class_number:selectedClass.value
          }
          await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
        }
        notificationStore.successToast("Success",data.message)
      }
    },
    {deep:true}
)

watch(
    () => schemeOfWorkStore.schemeOfWorkByClassResponse,
    async (data) => {
      if(data){
        schemeOfWorkList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => subjectStore.academicYearByClassResponse,
    async (data) => {
      if(data){
        let acd = data.data

        academicYearList.value = acd


        if(!academic_year_number.value) {
          let acdYrNo = acd[0].number
          academic_year_number.value =  acdYrNo

          // fetch scheme of work
          if(scheme_subject_number.value && selectedClass.value) {
            let data = {
              academic_year_number: acdYrNo,
              subject_number: scheme_subject_number.value,
              class_number: selectedClass.value
            }
            await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
          }

        }

      }
    },
    {deep:true}
)


watch(
    () => schemeOfWorkStore.updateSchemeOfWorkResponse,
    async (data) => {
      if(data){
        if(selectedClass.value) {
          let data = {
            academic_year_number:academic_year_number.value,
            subject_number:scheme_subject_number.value,
            class_number:selectedClass.value
          }
          await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
        }
        notificationStore.successToast("Success",data.message)
      }
    },
    {deep:true}
)


watch(
    () => subjectStore.schemeSubjectByClassResponse,
    async (data) => {
      if(data){
        let subjectInfo = data.data
        schemeSubjectList.value = subjectInfo
        if(!scheme_subject_number.value){
          let subjectNo = subjectInfo[0].number
          scheme_subject_number.value = subjectNo

          if(selectedClass.value && academic_year_number.value){
            let data = {
              subject_number:subjectNo,
              class_number:selectedClass.value,
              academic_year_number:academic_year_number.value,
            }
            await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
          }


        }
      }
    },
    {deep:true}
)


watch(
    () => schemeOfWorkStore.newLessonPlanResponse,
    async (data) => {
      if (data) {
        let data = {
          subject_number:scheme_subject_number.value,
          class_number:selectedClass.value,
          academic_year_number:academic_year_number.value,
        }

        await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
        notificationStore.successToast("Success",data.message)
      }
    },
    {deep: true}
)




watch(
    () => schemeOfWorkStore.exportPdfResponse,
    async (data) => {
      if(data){
        exportLoader.value = false
      }
    },
    {deep:true}
)



watch(
    // () => classStore.schemeClassInfoResponse,
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        let classInfo = data.data[0].classes
        classList.value = classInfo
        if(classInfo && (classInfo.length > 0)){
          if(!selectedClass.value){
            let classNo = classInfo[0].number
            // selectedClass.value = classNo
            await subjectStore.fetchSchemeSubjectByClass(classNo)
            // await subjectStore.fetchAcademicYearByClass(classNo)
             fetchAcademicYrList(classNo)

            // fetch scheme of work
            if(academic_year_number.value && scheme_subject_number.value) {
              let data = {
                academic_year_number: academic_year_number.value,
                subject_number: scheme_subject_number.value,
                class_number: classInfo[0].number
              }
              await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
            }
          }
        }
      }
    },
    {deep:true}
)



</script>
<template>


  <div class="bg-white border rounded-md py-3 px-2">
    <div class="row mt-1">
      <div class="col-lg-11">
        <h5 style="font-size: 14px;margin-top: 2px;">SCHEME OF WORK</h5>
      </div>
      <div class="col-lg-1">
        
        </div>
    </div>
    <div class="row">
      <div class="col-3">
        <div class="mb-2">
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
      <div class="col-2">
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
      <div class="col-2" >
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
      <div class="col-2">
        <div class="mb-2">
          <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="form.class_number"
            @change="getSubjects(form.class_number)"
            >
            <option disabled value="">-filter by class-</option>
            <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
              {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
            </option>
          </select>
        </div>
      </div>
      <div class="col-3">
                    <div class="mb-3">            
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="scheme_subject_number"
                  @change="filterSchemeSubject"
              >
                <option disabled value="">--filter Subject--</option>
                <option v-for="(list, index) in schemeSubjectList" :key="index" :value="list.number">
                  {{list.code+". "+list.name}}
                </option>
              </select>
            </div>
            </div>
                 <div class="col-3">
                    <div class="mb-3">
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="academic_year_number"
                      @change="filterSchemeSubject"
                  >
                    <option disabled value="">--Select Academic Year--</option>
                    <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                      {{list.code+". "+list.academic_year_name+" ["+list.level_name+"]"}}
                    </option>
                  </select>
                </div>
                </div>


    </div>


        <div class="mt-3">
          <div class="" style="padding: 0;">
            <div class="flex justify-content-between mt-3">

              <div>
           
                <div class="ml-7" v-if="schemeOfWorkList.name"><small><b>Title:</b> {{schemeOfWorkList.name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.academic_year_name"><small><b>Class:</b> {{schemeOfWorkList.academic_year_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.class_name"><small><b>Class:</b> {{schemeOfWorkList.class_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.subject_name"><small><b>Subject:</b> {{schemeOfWorkList.subject_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.status"><small><b>Status:</b> {{schemeOfWorkList.status}}</small></div>
              </div>
            </div>

      

            <div class="row mt-3">
              

                <div class="col-12">

            <div style="width: 100%; max-height: 600px; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;">
              <table class="table table-hover caption-top" style="font-size: 13px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Strand</th>
                <th scope="col">Topic</th>
                <th scope="col">Sequence</th>
                <th scope="col">Subtopic</th>

                <th scope="">#</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst,index) in schemeOfWorkList.subtopic" :key="index" >
                <td scope="row">{{index+1}}</td>
                <td>
                  {{lst.strand_name}}
                </td>
                <td>
                  {{lst.topic_name}}
                </td>
                <td>
                  {{lst.code}}
                </td>
                <td>
                  <div style="width: 200px; white-space: break-spaces">
                    {{lst.name}}
                  </div>
                </td>
           
                <td>

                  <div>


                    <div  class="ml-5 text-wrap" v-for="(lsn, idx) in lst.lesson_plan" :key="idx">
                      {{lsn.code+". "+lsn.concept_name}}
                    </div>

                    <div class="flex justify-between mt-4 mb-2" style="width: 350px;">
                      <button type="button"  class="btn btn-sm  btn-primary mr-2 m-0 py-0"  @click="viewLessonPlan(lst)" data-bs-toggle="modal" data-bs-target="#lessonPlanDetailsModal">
                        <small class="m-0 p-0">View lesson sessions</small>
                      </button>
                    </div>
                  </div>


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


    <app-modal v-model="lessonPlanDetailsDialog" :itle="'Lesson Plan:'+ lessonPlanInfo.name" xl6>
      <ManageLessonSessions :lessonPlanInfo="lessonPlanInfo" :schoolInfo="schoolInfo"></ManageLessonSessions>
    </app-modal>

    

</template>
<style scoped></style>