<template>
  <div>
    <form @submit.prevent="addSchemeOfWork">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>


      <div class="row">
        <div class="col-lg-4 content">

          <div class="mb-2">
            <label class="textColor text-sm">Scheme Title</label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="text"
                v-model="form.name"
                required
                class="form-control form-control-sm">
          </div>



      <div class="mb-2">
        <label class="textColor"><small>Class</small></label>
        <select
            :disabled="(schemeOfWorkList && (schemeOfWorkList.status === 'Pending'))"
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.class_number"
            @change="filterClasses(form.class_number)"
        >
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>


          <div class="mb-2">
            <label class="textColor"><small>Academic Year</small></label>
            <select
                :disabled="(schemeOfWorkList && (schemeOfWorkList.status === 'Pending'))"
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.academic_year_number"
            >
              <option disabled value="">Select Academic Year</option>
<!--              <option value="">All</option>-->
              <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">{{list.academic_year_name+" ["+list.level_name+"]"}}</option>
            </select>
          </div>


          <div class="mb-5">
            <label class="textColor"><small>Subject</small></label>
            <select
                :disabled="(schemeOfWorkList && (schemeOfWorkList.status === 'Pending'))"
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.subject_number"
                @click="filterSubject(form.subject_number)"
            >
              <option disabled value="">Select Subject</option>
              <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.name}}</option>
            </select>
          </div>


        </div>
      </div>


      <table class="table table-hover caption-top" style="font-size: 14px;">
        <thead>
        <tr>
          <th scope="col" style="width: 5%;">#</th>
          <th scope="col">Strand</th>
          <th scope="col">Topic</th>
          <th scope="col" style="width: 60%;">Sub Topic name</th>
          <th scope="col" style="width: 20%;">Code</th>
<!--          <th scope="col" class="text-end">Action</th>-->
        </tr>
        </thead>
        <tbody>
        <tr v-for="(lst,index) in subtopicList" :key="index" >
          <td scope="row">{{index+1}}</td>
          <td>
            {{lst.strand_name}}
          </td>
          <td>
            {{lst.topic_name}}
          </td>
          <td>
            {{lst.name}}
          </td>
          <td>
            <input
                type="text"
                style="outline: none 0 !important; box-shadow: none;"
                v-model="lst.sort_code"
                required
                class="form-control form-select-sm" />
          </td>
<!--          <td>
            <div class="float-end mr-2">
              <i
                  style="font-size: 13px;"
                  data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                  class="bi-pencil mr-2 cursor-pointer" @click="editClass(sbj)"></i>
              <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(sbj)"></i>
            </div>
          </td>-->
        </tr>
        </tbody>
      </table>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
           {{(schemeOfWorkList && (schemeOfWorkList.status === "Pending")) ? "Update":"Save"}}
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import {useSubtopicStore} from "@/main/dashboard/curriculum/subTopic/store/subTopic.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useSchemeOfWorkStore} from "@/main/dashboard/schemeOfWork/store/schemeOfWork.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";

const subtopicStore = useSubtopicStore()
const errorMessage = ref(null)
const name = ref(null)
const loader = ref(false)
const classList = ref([])
const subjectList = ref([])
const subtopicList = ref([])
// const nameRef = ref(null)
const routerData = useRouter()
const classStore = useClassesStore()

const learningAreaStore = useLearningAreaStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
const subjectStore = useSubjectStore()

const scheme_number = ref(null)
const academicYearList = ref([])


const form = reactive({
  name:"",
  class_number:"",
  subject_number:"",
  academic_year_number:"",
})


let classNumber = routerData.currentRoute.value.query.c
if(classNumber){
  form.class_number =  classNumber
}




const filterClasses = (classData) => {
  subtopicList.value = []
  subjectList.value = []
  subjectStore.fetchAcademicYearByClass(classData)
  subjectStore.fetchSubjectByClass(classData)

}

const filterSubject = (subjectNumber) => {
  subtopicList.value = []
  subtopicStore.fetchSubTopicsByClass({class_number:form.class_number, subject_number:subjectNumber})
}

onMounted(
    () =>{
      // subtopicStore.fetchSubTopics(classNumber ? classNumber : "")
    }
)


const props = defineProps({
  schemeOfWorkList: [],
})



const addSchemeOfWork = () =>{
  loader.value = true
  let topic = [...subtopicList.value]

  topic.forEach(lst => {
    lst.code = parseInt(lst.code)
    lst.sort_code = parseInt(lst.sort_code)
  })
  form.subtopicList = topic

  if(props.schemeOfWorkList && (props.schemeOfWorkList.status === "Pending")){
    form.scheme_number = scheme_number.value
    schemeOfWorkStore.updateSchemeOfWorkData(form)
  }else {
    schemeOfWorkStore.newSchemeOfWorkData(form)
  }


}



watch(
    () => props.schemeOfWorkList,
    async (data) => {
      if(data && (data.status === "Pending")){
        let info  = data
        scheme_number.value = info.number
        form.name = info.name
        form.class_number = info.class_number
        form.subject_number = info.subject_number
        form.academic_year_number = info.academic_year_number

        subtopicList.value = info.subtopic
      }
    },
    {deep:true}
)


watch(
    () => learningAreaStore.learningAreaInfResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.name = null
        form.code = null
      }
    },
    {deep:true}
)


watch(
    () => subtopicStore.subtopicByClassInfoResponse,
    async (data) => {
      if(data){
        if(!props.schemeOfWorkList.number) {
          subtopicList.value = data.data
        }
      }
    },
    {deep:true}
)

watch(
    () => schemeOfWorkStore.newSchemeOfWorkResponse,
    async (data) => {
      if(data){
       loader.value = false
      }
    },
    {deep:true}
)


watch(
    () => schemeOfWorkStore.updateSchemeOfWorkResponse,
    async (data) => {
      if(data){
       loader.value = false
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.subjectByClassResponse,
    async (data) => {
      if(data){
      subjectList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.academicYearByClassResponse,
    async (data) => {
      if(data){
      academicYearList.value = data.data
      }
    },
    {deep:true}
)



watch(
    () => classStore.classInfoResponse,
    async (data) => {
      if(data){
        let classInfo = data.data
        classList.value = classInfo
        if(classInfo && (classInfo.length > 0)){
          let classNo = classInfo[0].number
          let number = null
          if(!classNumber){
            number = classNo
          }else {
            number = classNumber
          }
          form.class_number = number
          await subjectStore.fetchSubjectByClass(number)
          // await subtopicStore.fetchSubTopicsByClass(number)
        }
      }
    },
    {deep:true}
)




</script>

<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>