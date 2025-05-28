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
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import SchemeOfWorkPdfTemplate from "@/main/dashboard/curriculum/schemeOfWork/SchemeOfWorkPdfTemplate.vue";
import AppModal from "@/components/AppModal.vue";
import api from "@/config/api.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const routerData = useRouter()

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
const classList = ref( [])
const levelList = ref( [])
const classStore = useClassesStore()
let selectedClass = ref( "")


let imagePath = api.defaults.baseURL + "/attachments/download/"


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const scheme_subject_number = ref(null)
const learningAreaRef = ref(null)
const schemeOfWorkList = ref([])
const schemeSubjectList = ref([])
const academicYearList = ref([])
const curriculumList = ref([])
const commons = useCommonsStore()
const levelStore = useLevelStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
const subjectStore = useSubjectStore()

let classNo = routerData.currentRoute.value.query.c
let campusNumber = routerData.currentRoute.value.query.id
let curriculumNo = routerData.currentRoute.value.query.crr
let levelNo = routerData.currentRoute.value.query.lv
const confirmationRef = ref(null);

if(classNo){
  selectedClass.value =  classNo
}

const addLessonPlan = (schemeData) => {
  schemeDataInfo.value = {...{class_number:selectedClass.value},...{subject_number:scheme_subject_number.value},...schemeData}
  lessonPlanDialog.value = true
}

const viewLessonPlan = (lst) => {
  lessonPlanDetailsDialog.value = true
  lessonPlanInfo.value = lst
}

const deactivateLessonPlan = async (lst) => {
  const agreed = await confirmationRef.value.confirm("This action will deactivate the Lesson plan and cannot be reversed. Are you sure you want to continue?");
  if (agreed) {
    await deactivateLessonPlanStatus(lst?.number)
  }
}

const  deactivateLessonPlanStatus = async (data) => {
  return await api.patch("main/lesson-plan/invalidate/"+data)
      .then((response) => {
        if(response && response.data){
          filterSchemeSubject()
          notificationStore.successToast("Success", response.data.message)
        }
      })
      .catch((response) => {
        if(response && response.response){
          notificationStore.errorToast("Error",response.response.data.message)
        }
      })
}


const addSchemeOfWork = () => {
  curriculumDialog.value = true
}

const deactivateSchemeOfWork = async () => {

  const agreed = await confirmationRef.value.confirm("This action will deactivate the scheme of work and cannot be reversed. Are you sure you want to continue?");
  if (agreed) {
     await deactivateSchemeOfWorkStatus(schemeOfWorkList.value?.number)
  }

}


const  deactivateSchemeOfWorkStatus = async (data) => {
  return await api.patch("main/scheme-of-work/invalidate/"+data)
      .then((response) => {
        if(response && response.data){
          filterSchemeSubject()
          notificationStore.successToast("Success", response.data.message)
        }
      })
      .catch((response) => {
        if(response && response.response){
          notificationStore.errorToast("Error",response.response.data.message)
        }
      })
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
    class_number:selectedClass.value
  }

  schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
}

onMounted(
    async () => {

      //fetch level after selecting curriculum
      if(curriculumNo) {
        curriculumNumber.value = curriculumNo
        await classStore.fetchCampusLevel(curriculumNo)
      }

      // fetch classes after selecting level
      if(levelNo){
        level.value = levelNo
        await classStore.fetchClassLevel({campusCurriculumNumber: curriculumNumber.value, campusLevelNumber: levelNo})
         fetchSchemeClasses(levelNo)
      }

      await levelStore.fetchCampusCurriculum(campusNumber)
      // await levelStore.fetchCampusLevelList(campusNumber)

      if(selectedClass.value) {
         fetchAcademicYrList(selectedClass.value)
        await subjectStore.fetchSchemeSubjectByClass(selectedClass.value)
      }
    }
)

const fetchAcademicYrList = (classNumber) => {
  subjectStore.fetchAcademicYearByClass(classNumber)
}

const fetchCampusLevel = (curriculumNumber) => {
  if(curriculumNumber){
    router.push({name:'scheme-of-work', query:{id:campusNumber,crr:curriculumNumber}})
  }
}

const fetchSchemeClasses = (levelNumber) => {
  if(curriculumNumber.value && levelNumber){
    if(campusNumber && curriculumNo){
      router.push({name:'scheme-of-work', query:{id:campusNumber,crr:curriculumNo,lv:levelNumber,c:classNo??''}})
    }
  }
}

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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
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
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)


</script>
<template>
  <div>

    <ConfirmationModal removeBorder="remove" title="Warning" ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="(schemeOfWorkList.number && (schemeOfWorkList.status === 'ACTIVE')) ? 'Edit Scheme of work' : 'Add Scheme of work'" v-model="curriculumDialog" xl8>
      <new-scheme-of-work :schemeOfWorkList="schemeOfWorkList" ref=""></new-scheme-of-work>
    </AppModal>

    <AppModal :title="'New Lesson Plan: '+ schemeDataInfo.name" v-model="lessonPlanDialog" xl8>
      <new-lesson-plan :schemeDataInfo="schemeDataInfo" ref="lessonPlanRef"></new-lesson-plan>
    </AppModal>

    <AppModal :title="'Lesson Plan: '+ lessonPlanInfo.name" v-model="lessonPlanDetailsDialog" xl8>
      <lesson-plan-details :lessonPlanInfo="lessonPlanInfo"></lesson-plan-details>
    </AppModal>


<p class="mt-3" style="font-size: 20px;">Scheme of work</p>

    <div class="card mt-3">
      <div class="card-body" style="padding: 0;">
        <level-info></level-info>
      </div>
    </div>


    <div class="row mt-5">
      <div :class="curriculumNo ? 'col-3' : 'col-6'">
        <div class="mb-2">
          <select
              class="form-select py-2 shadow-none"
              v-model="curriculumNumber"
              @change="fetchCampusLevel(curriculumNumber)"
          >
            <option value="" class="text-[12px]">--Select--</option>
            <option class="text-[12px]" v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
          </select>
          <div class="text-[12px]">Filter by Curriculum</div>
        </div>
      </div>

      <div class="col-3" v-if="curriculumNo">
        <div class="mb-2">
          <select
              class="form-select py-2 shadow-none"
              v-model="level"
              @change="fetchSchemeClasses(level)"
          >
            <option value="">--Select--</option>
            <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
          </select>
          <div class="text-[12px]">Filter by level</div>
        </div>
      </div>

    </div>


    <div class="row">


      <div :class="classNo ? 'col-3' : 'col-12'" v-if="level">
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

      <div v-if="classNo" class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">


            <div class="flex justify-content-between mt-3">

            <div>

            </div>

                <div>

                  <button v-if="schemeOfWorkList?.number" type="button"  class="btn btn-sm buttonStyle btn-danger mr-2"  @click="deactivateSchemeOfWork" data-bs-toggle="modal" data-bs-target="#schemeOfWorkModal">
                    <i style="font-size: 15px;"  class="bi-x mr-2"></i>
                    Deactivate
                  </button>

                  <button type="button"  class="btn btn-sm buttonStyle btn-success mr-2"  @click="exportSchemeOfWorkPdf">
                    <i style="font-size: 15px;"  class="bi-file-earmark-pdf mr-2"></i>
                    Export PDF
                    <div class="spinner-border spinner-border-sm" role="status" v-if="exportLoader">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>

                  <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSchemeOfWork" data-bs-toggle="modal" data-bs-target="#schemeOfWorkModal">
                    <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                    {{(schemeOfWorkList.number && (schemeOfWorkList.status === "ACTIVE")) ? " Edit Scheme" : " Add Scheme"}}
                  </button>

                </div>

            </div>



            <table style="width: 100%;">
              <tr>
                <td style="width: 14%;">

                  <span v-if="schemeOfWorkList?.school_badge">
                      <img alt="img" style="width: 120px; margin: 0 auto;" :src="imagePath+schemeOfWorkList?.school_badge"/>
                  </span>

                </td>
                <td>
                  <div style="font-size: 20px; text-transform: uppercase;"><b>{{schemeOfWorkList?.school_name}}</b></div>
                  <div style="font-size: 15px; margin-top: 1px;text-transform: uppercase;">{{schemeOfWorkList?.campus_name}}</div>

                  <div style="margin-top: 1px; margin-bottom: 1px;">
                    <small>
                      {{schemeOfWorkList?.campus_location ? schemeOfWorkList?.campus_location+" | " : ""	}}
                      {{schemeOfWorkList?.campus_phone ? schemeOfWorkList?.campus_phone+" | " : ""}}
                      {{schemeOfWorkList?.campus_email ? schemeOfWorkList?.campus_email+" | " : ""}}
                    </small>
                  </div>

                  <span v-if="schemeOfWorkList?.name" style="font-size: 15px; background-color: green; color: #ffffff; text-transform: uppercase; padding-left: 15px; padding-right: 15px;">
                     {{schemeOfWorkList?.name}}
                  </span>

                  <div style="display: flex; margin-bottom: 20px; margin-top: 15px;">
                    <div style="margin-right: 0px;"  v-if="schemeOfWorkList.academic_year_name"><small>{{schemeOfWorkList.academic_year_name}}</small> |</div>
                    <div style="margin-left: 10px;"  v-if="schemeOfWorkList.class_name"><small>{{schemeOfWorkList.class_name}}</small> |</div>
                    <div style="margin-left: 10px; "  v-if="schemeOfWorkList.subject_name"><small>{{schemeOfWorkList.subject_name}}</small> |</div>
                    <div style="margin-left: 10px; "  v-if="schemeOfWorkList.status"><small>{{schemeOfWorkList.status}}</small></div>
                  </div>

                </td>

              </tr>
            </table>







<!--            <hr />-->


            <div class="row">
              <div class="col-3">
                  <div class="mb-3">
              <label class="text-sm"><small>Sort by Subject</small></label>
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
                <div class="mb-2">
                  <label class="text-sm"><small>Sort by Academic Year</small></label>
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="academic_year_number"
                      @change="filterSchemeSubject"
                  >
                    <option disabled value="">--Select Class--</option>
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
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst,index) in schemeOfWorkList.subtopic" :key="index" >
                <td scope="row">{{index+1}}</td>
                <td>
                  <div v-html="lst?.strand_name"></div>
                </td>
                <td>
                  <div v-html="lst?.topic_name"></div>
                </td>
                <td>
                  {{lst?.code}}
                </td>
                <td>
                  <div style="width: 200px; white-space: break-spaces">
                    <div v-html="lst?.name"></div>
                  </div>
                </td>
                <td>
                  <div v-html="lst?.estimated_time"></div>
                </td>
                <td>

                  <div>


                    <div  class="ml-5 text-wrap" v-for="(lsn, idx) in lst.lesson_plan" :key="idx">
                      {{lsn.code+". "+lsn.concept_name}}
                    </div>

                    <div class="flex mt-4 mb-2" style="width: 350px;">
                      <button
                          type="button"
                          class="btn btn-sm  btn-primary mr-2 m-0 py-0"
                          @click="addLessonPlan(lst)"
                          v-tooltip.bottom="lst.concept_count+(lst.concept_count <1 ? ' Concept' : ' Concepts')"
                      >
                        <small class="m-0 p-0">Add lesson plan [ {{lst.concept_count}} ]</small>
                      </button>


                      <span class="mx-1">
                          <button type="button"  class="btn btn-sm  btn-primary mr-2 m-0 py-0"  @click="viewLessonPlan(lst)">
                            <small class="m-0 p-0">View lesson plan</small>
                          </button>
                      </span>


                      <span>
                        <button type="button"  class="btn btn-sm  btn-danger mr-2 m-0 py-0"  @click="deactivateLessonPlan(lst)">
                        <small class="m-0 p-0">Deactivate lesson plan</small>
                      </button>
                    </span>

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


    <div style="display: none">
        <div ref="schemeOfWorkRef">
          <SchemeOfWorkPdfTemplate
              :schemeOfWorkList="schemeOfWorkList"
          ></SchemeOfWorkPdfTemplate>
        </div>
    </div>



  </div>
</template>



<style scoped>
.buttonStyle{
  font-size: 12px;
  padding: 2px 7px;
}
</style>