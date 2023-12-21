<template>
  <div>

    <div class="modal fade" id="schemeOfWorkModal" tabindex="-1" :class="{ show: curriculumDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2"> {{(schemeOfWorkList.number && (schemeOfWorkList.status === "Pending")) ? "Edit Scheme of work" : "Add Scheme of work"}}  </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-scheme-of-work :schemeOfWorkList="schemeOfWorkList" ref="schemeOfWorkRef"></new-scheme-of-work>
            </div>
          </div>
        </div>`
      </div>
    </div>


    <div class="modal fade" id="lessonPlanModal" tabindex="-1" :class="{ show: lessonPlanDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">New Lesson Plan: <b>{{schemeDataInfo.name}}</b> </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-lesson-plan :schemeDataInfo="schemeDataInfo" ref="lessonPlanRef"></new-lesson-plan>
            </div>
          </div>
        </div>`
      </div>
    </div>


    <div class="modal fade" id="lessonPlanDetailsModal" tabindex="-1" :class="{ show: lessonPlanDetailsDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Lesson Plan: <b>{{lessonPlanInfo.name}}</b> </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <lesson-plan-details :lessonPlanInfo="lessonPlanInfo"></lesson-plan-details>
            </div>
          </div>

        </div>
      </div>
    </div>


<p class="mt-3" style="font-size: 20px;">Scheme of work</p>

    <div class="card mt-3">
      <div class="card-body" style="padding: 0;">
        <level-info></level-info>
      </div>
    </div>


    <div class="row mt-5">
      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="level"
              @change="fetchSchemeClasses()"
          >
            <option disabled value="">Filter by Level</option>
            <option value="">All</option>
            <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
          </select>
        </div>
      </div>

    </div>


    <div class="row">


      <div class="col-3">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Classes</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <div
                  v-for="(item, idx) in  classList"
                  :key="idx"
                  class="list-group-item list-group-item-action cursor-pointer"
                  :class="item.number === selectedClass ? 'active' : ''"
                  @click="changeMenu(item.number)"
              >
                <small style="font-size:12px;">{{item.code+". "+item.name+" [ "+item.abbreviation+" ]"}}</small>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">


            <div class="flex justify-content-between mt-3">

              <div>
                <div class="ml-4"><b>Scheme of work</b></div>
                <div class="ml-7" v-if="schemeOfWorkList.name"><small><b>Title:</b> {{schemeOfWorkList.name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.academic_year_name"><small><b>Class:</b> {{schemeOfWorkList.academic_year_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.class_name"><small><b>Class:</b> {{schemeOfWorkList.class_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.subject_name"><small><b>Subject:</b> {{schemeOfWorkList.subject_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.status"><small><b>Status:</b> {{schemeOfWorkList.status}}</small></div>
              </div>

                <div>
                  <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addCurriculum" data-bs-toggle="modal" data-bs-target="#schemeOfWorkModal">
                    <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                    {{(schemeOfWorkList.number && (schemeOfWorkList.status === "Pending")) ? " Edit Scheme" : " Add Scheme"}}
                  </button>
                </div>

            </div>

            <hr />


            <div class="row mx-auto">
              <div class="col-3">
            <div class="mb-3">
              <label class="textColor"><small>Sort by Subject</small></label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="scheme_subject_number"
                  @click="filterSchemeSubject"
              >
                <option disabled value="">filter Subject</option>
                <option v-for="(list, index) in schemeSubjectList" :key="index" :value="list.number">
                  {{list.code+". "+list.name}}
                </option>
              </select>
            </div>
              </div>

              <div class="col-3">

                <div class="mb-2">
                  <label class="textColor"><small>Sort by Academic Year</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="academic_year_number"
                      @click="filterSchemeSubject"
                  >
                    <option disabled value="">Select Class</option>
<!--                    <option value="">All</option>-->
                    <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                      {{list.code+". "+list.academic_year_name+" ["+list.level_name+"]"}}
                    </option>
                  </select>
                </div>

              </div>

            </div>


            <hr />


            <div style="width: 100%; max-height: 600px; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;">
              <table class="table table-hover caption-top" style="font-size: 13px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Strand</th>
                <th scope="col">Topic</th>
                <th scope="col">Sequence</th>
                <th scope="col">Subtopic</th>
                <th scope="col">Estimated Time (Min)</th>
                <th scope="col">Lesson Plan (Concept(s))</th>
<!--                <th scope="col" class="text-end">Action</th>-->
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
                  {{lst.estimated_time}}
                </td>
                <td>

                  <div>


                    <div  class="ml-5 text-wrap" v-for="(lsn, idx) in lst.lesson_plan" :key="idx">
                      {{lsn.code+". "+lsn.concept_name}}
                    </div>

                    <div class="flex justify-between mt-4 mb-2" style="width: 350px;">
                      <button type="button"  class="btn btn-sm  btn-primary mr-2 m-0 py-0"  @click="addLessonPlan(lst)" data-bs-toggle="modal" data-bs-target="#lessonPlanModal">
                        <small class="m-0 p-0">Add lesson plan</small>
                      </button>

                      <button type="button"  class="btn btn-sm  btn-primary mr-2 m-0 py-0"  @click="viewLessonPlan(lst)" data-bs-toggle="modal" data-bs-target="#lessonPlanDetailsModal">
                        <small class="m-0 p-0">View lesson plan</small>
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
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchemeOfWork from "@/main/dashboard/curriculum/schemeOfWork/NewSchemeOfWork.vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import router from "@/config/router.js";
import {useRouter} from "vue-router";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import NewLessonPlan from "@/main/dashboard/curriculum/schemeOfWork/NewLessonPlan.vue";
import LessonPlanDetails from "@/main/dashboard/curriculum/schemeOfWork/LessonPlanDetails.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";

const level = ref( "")
const academic_year_number = ref( "")
const schemeDataInfo = ref( {})
const curriculumDialog = ref( false)
const lessonPlanDialog = ref( false)
const lessonPlanDetailsDialog = ref( false)
const lessonPlanInfo = ref( "")
const learningAreaList = ref( [])
const classList = ref( [])
const levelList = ref( [])
const classStore = useClassesStore()
const selectedClass = ref( null)
const routerData = useRouter()


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const scheme_subject_number = ref(null)
const learningAreaRef = ref(null)
const schemeOfWorkList = ref([])
const schemeSubjectList = ref([])
const academicYearList = ref([])
const commons = useCommonsStore()
const levelStore = useLevelStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
const subjectStore = useSubjectStore()
const academicYearStore = useAcademicYearStore()

let   subjectNo = routerData.currentRoute.value.query.c
let campusNumber = routerData.currentRoute.value.query.id

if(subjectNo){
  selectedClass.value =  subjectNo
}

const addLessonPlan = (schemeData) => {
  schemeDataInfo.value = {...{class_number:selectedClass.value},...{subject_number:scheme_subject_number.value},...schemeData}
  lessonPlanDialog.value = true
}

const viewLessonPlan = (lst) => {
  lessonPlanDetailsDialog.value = true
  lessonPlanInfo.value = lst
}

const addCurriculum = () => {
  curriculumDialog.value = true
}

const changeMenu = (value) => {
  selectedClass.value = value
  router.push({ name: "scheme-of-work", query:{id:campusNumber, c:value} })
}


const filterSchemeSubject = () => {
  schemeOfWorkList.value = []
  let data = {
    academic_year_number:academic_year_number.value,
    subject_number:scheme_subject_number.value,
    class_number:selectedClass.value
  }
  schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
}

onMounted(
    async () => {
      await levelStore.fetchCampusLevelList(campusNumber)
      await fetchSchemeClasses()
      if(selectedClass.value) {
        await subjectStore.fetchSchemeSubjectByClass(selectedClass.value)
        // await subjectStore.fetchAcademicYearByClass(selectedClass.value)
        await fetchAcademicYrList()
      }
    }
)

const fetchAcademicYrList = () => {
  // academicYearStore.fetchAcademicYear(level.value)
  subjectStore.fetchAcademicYearByClass(selectedClass.value)
}

const fetchSchemeClasses = () => {
/*  let data = {
    level:level.value,
    campus_number:campusNumber
  }
   classStore.fetchSchemeOfWorkClasses(data)*/
  classStore.fetchClassLevel({campusNumber: campusNumber, levelNumber: level.value})
  fetchAcademicYrList()
}

watch(
    // () => classStore.schemeClassInfoResponse,
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        let classInfo = data.data
       classList.value = classInfo
        if(classInfo && (classInfo.length > 0)){
          if(!selectedClass.value){
            let classNo = classInfo[0].number
            selectedClass.value = classNo
            await subjectStore.fetchSchemeSubjectByClass(classNo)
            // await subjectStore.fetchAcademicYearByClass(classNo)
            await fetchAcademicYrList()

            let data = {
              academic_year_number:academic_year_number.value,
              subject_number:scheme_subject_number.value,
              class_number:classInfo[0].number
            }

            await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
          }
        }
      }
    },
    {deep:true}
)


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
    // () => academicYearStore.academicYearResponse,
    async (data) => {
      if(data){
        let acd = data.data

        academicYearList.value = acd


       if(!academic_year_number.value) {
         let acdYrNo = acd[0].number
         academic_year_number.value =  acdYrNo



  /*       let data = {
           academic_year_number:acdYrNo,
           subject_number:scheme_subject_number.value,
           class_number:selectedClass.value
         }
         await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)*/

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

          let data = {
            subject_number:subjectNo,
            class_number:selectedClass.value,
            academic_year_number:academic_year_number.value,
          }
          await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)

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
    () => levelStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)

</script>

<style scoped>

</style>