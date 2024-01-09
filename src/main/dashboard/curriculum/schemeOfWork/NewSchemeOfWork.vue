<template>
  <div>
    <form @submit.prevent="addSchemeOfWork">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>


      <div class="row mx-auto">
        <div class="col-lg-6 content">

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
          <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>

          <div class="mb-5">
            <label class="textColor"><small>Academic Year</small></label>
            <select
                :disabled="(schemeOfWorkList && (schemeOfWorkList.status === 'Pending'))"
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.academic_year_number"
            >
              <option disabled value="">Select Academic Year</option>
              <!--              <option value="">All</option>-->
              <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                {{list.code+". "+list.academic_year_name+" ["+list.level_name+"]"}}
              </option>
            </select>
          </div>


        </div>
        <div class="col-lg-6 content">


          <div class="mb-2">
            <label class="textColor"><small>Subject</small></label>
            <select
                :disabled="(schemeOfWorkList && (schemeOfWorkList.status === 'Pending'))"
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.subject_number"
                @click="filterSubject(form.subject_number)"
            >
              <option disabled value="">Select Subject</option>
              <option v-for="(list, index) in subjectList" :key="index" :value="list.number">
                {{list.code+". "+list.name}}
              </option>
            </select>
          </div>


          <div class="mb-5">
            <label class="textColor"><small>Scheme by</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="type"
                @click="filterByType(type)"
            >
              <option disabled value="">Select type</option>
              <option v-for="(list, index) in schemeOptions" :key="index" :value="list.value">
                {{list.text}}
              </option>
            </select>
          </div>


        </div>
      </div>


      <div class="row mx-auto">
        <div class="col-lg-12 content">
          <hr v-if="type === 'template'" class="mb-2 mt-3" />
          <div v-if="type === 'template'">
            <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="downloadSchemeByTemplate">
              <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Download template
            </button>
            <button type="button"  class="btn btn-sm buttonStyle btn-success mr-2"  @click="uploadTemplate">
              <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Import template
            </button>



            <div v-if="showTemplateUpload">
              <div>

                      <ImportSchemeOfWork :schemeDetailsForm="form"></ImportSchemeOfWork>

              </div>

            </div>


          </div>
          <hr v-if="type === 'template' && !showTemplateUpload" class="mb-2 mt-3" />
        </div>
      </div>




      <table v-if="type === 'new'" class="table table-hover caption-top" style="font-size: 14px;">
        <thead>
        <tr>
          <th scope="col" style="width: 5%;">#</th>
          <th scope="col">Strand</th>
          <th scope="col">Topic</th>
          <th scope="col" style="width: 60%;">Sub Topic name</th>
          <th scope="col" style="width: 20%;">Code</th>
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



      <div v-if="type === 'new'" class="flex justify-content-end" style="width: 100%;">
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
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useSubtopicStore} from "@/main/dashboard/curriculum/curriculumSetup/subTopic/store/subTopic.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import useNotificationStore from "@/composables/useNotification.js";
import ImportSchemeOfWork from "@/main/dashboard/curriculum/schemeOfWork/ImportSchemeOfWork.vue";

const subtopicStore = useSubtopicStore()
const errorMessage = ref(null)
const name = ref(null)
const loader = ref(false)
const classList = ref([])
const subjectList = ref([])
const subtopicList = ref([])
const notificationStore  = useNotificationStore()
const routerData = useRouter()
const classStore = useClassesStore()

const learningAreaStore = useLearningAreaStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
const subjectStore = useSubjectStore()

const scheme_number = ref(null)
const academicYearList = ref([])
const showTemplateUpload = ref(false)

const type = ref("new")

const schemeOptions  = ref([
  {
    text:"New",
    value:"new"
  },
  {
    text:"Standard Scheme",
    value:"standard_scheme"
  },
  {
    text:"Template",
    value:"template"
  },
])





const form = reactive({
  name:"",
  class_number:"",
  subject_number:"",
  academic_year_number:"",
})

const filterByType = (type) => {
  if(type){
  //  alert(type)
  }
}


const downloadSchemeByTemplate = (event) => {
  event.preventDefault();
  subtopicList.value = []
  subtopicStore.downloadSchemeTemplateExcel({class_number:form.class_number, subject_number:form.subject_number})
}

const uploadTemplate = () => {
    showTemplateUpload.value = !showTemplateUpload.value
}

let classNumber = routerData.currentRoute.value.query.c
if(classNumber){
  form.class_number =  classNumber
}




const filterClasses = (classData) => {
  subtopicList.value = []
  subjectList.value = []
  subjectStore.fetchAcademicYearByClass(classData)
  subjectStore.fetchSchemeSubjectByClass(classData)
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
    () => schemeOfWorkStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.schemeSubjectByClassResponse,
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
    () => subtopicStore.subtopicByClassTemplateResponse,
    async (data) => {
      if(data){
        const pdfObj = document.createElement("a");
        pdfObj.href = data.data;
        pdfObj.click();
      }
    },
    {deep:true}
)



watch(
    () => classStore.classLevelInfoResponse,
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