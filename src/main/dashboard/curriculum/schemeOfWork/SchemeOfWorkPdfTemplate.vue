<template>
  <div>

          <div>
            <div style="font-size: 8px;">
                <div><b>Scheme of work</b></div>
                <div v-if="schemeOfWorkList.name"><small><b>Title:</b> {{schemeOfWorkList.name}}</small></div>
                <div v-if="schemeOfWorkList.academic_year_name"><small><b>Class:</b> {{schemeOfWorkList.academic_year_name}}</small></div>
                <div v-if="schemeOfWorkList.class_name"><small><b>Class:</b> {{schemeOfWorkList.class_name}}</small></div>
                <div v-if="schemeOfWorkList.subject_name"><small><b>Subject:</b> {{schemeOfWorkList.subject_name}}</small></div>
                <div v-if="schemeOfWorkList.status"><small><b>Status:</b> {{schemeOfWorkList.status}}</small></div>
            </div>

            <hr />


              <table   style="width:100%; font-size: 7px;">

              <tr>
                <td>#</td>
                <td>Strand</td>
                <td>Topic</td>
                <td>Sequence</td>
                <td>Subtopic</td>
                <td>Estimated Time (Min)</td>
                <td>Lesson Plan (Concept(s))</td>
              </tr>

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

                  </div>


                </td>
              </tr>

            </table>


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
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";

const level = ref( "")
const academic_year_number = ref( "")
const learningAreaList = ref( [])
const classList = ref( [])
const levelList = ref( [])
const classStore = useClassesStore()
let selectedClass = ref( null)
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

let classNo = routerData.currentRoute.value.query.c
let campusNumber = routerData.currentRoute.value.query.id

if(classNo){
  selectedClass.value =  classNo
}


onMounted(
    async () => {
      await levelStore.fetchCampusLevelList(campusNumber)
      await fetchSchemeClasses()
      if(selectedClass.value) {
        await fetchAcademicYrList(selectedClass.value)
        await subjectStore.fetchSchemeSubjectByClass(selectedClass.value)
      }
    }
)

const fetchAcademicYrList = (classNumber) => {
  // academicYearStore.fetchAcademicYear(level.value)
  subjectStore.fetchAcademicYearByClass(classNumber)
}

const fetchSchemeClasses = () => {
  classStore.fetchClassLevel({campusNumber: campusNumber, levelNumber: level.value})
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
            await fetchAcademicYrList(classNo)

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