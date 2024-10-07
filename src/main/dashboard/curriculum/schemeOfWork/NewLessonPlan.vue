<script setup>
import {ref, watch} from "vue";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import useCommonsStore from "@/composables/useCommons.js";
import ImportLessonPlan from "@/main/dashboard/curriculum/schemeOfWork/ImportLessonPlan.vue";
import {useSubtopicStore} from "@/main/dashboard/curriculum/curriculumSetup/subTopic/store/subTopic.js";

const subtopicStore = useSubtopicStore()

const schemeOfWorkStore = useSchemeOfWorkStore()
const conceptListData = ref([])
const commons = useCommonsStore()

const loader = ref(false)

const scheme_sub_topic_number = ref(null)

const lessonPlanNumber = ref("")
const type = ref("new")

const showTemplateUpload = ref(false)

const LessonPlanOptions  = ref([
  {
    text:"New",
    value:"new"
  },
  {
    text:"Template",
    value:"template"
  },
])


const form = ref([{
  number: "",
  code: 1,
  lesson_plan_concept_number: "",
  concept_name: "",
  steps: [{
    number: "",
    code: "1",
    step: ""
  }]
}])

const props = defineProps({
  schemeDataInfo: {}
})

const addConcept = () => {

  let data = {
    number: "",
    code: (form.value.length + 1),
    lesson_plan_concept_number: "",
    concept_name: "",
    steps: [{
      number: "",
      code: "1",
      step: ""
    }]
  }

if((form.value.length + 1) <= (conceptListData.value.length)){
  form.value.push(data)
}


}



const addStep = (idx) => {
  let data = {
    number: "",
    code: (form.value[idx].steps.length + 1),
    step: ""
  }
  form.value[idx].steps.push(data)
}

const removeStep = (index,idx) => {
form.value[index].steps.splice(idx, 1)
}

const removeConcept = (index) => {
  form.value.splice(index, 1)
}


const addLessonPlan = () => {
    loader.value = true

    let formData = {}

  formData.scheme_sub_topic_number = scheme_sub_topic_number.value
  formData.concepts = form.value
  formData.lesson_plan_number = lessonPlanNumber.value

  if(formData.concepts && (formData.concepts.length > 0)){}
  formData.concepts.forEach(lst => {
    lst.code = parseInt(lst.code)
    lst.steps.forEach(list => {
      list.code = parseInt(list.code)
    })
  })

  schemeOfWorkStore.saveLessonPlan(formData)
}

watch(
    () => props.schemeDataInfo,
    async (data) => {
      if (data) {
        resetFormData()
        scheme_sub_topic_number.value = props.schemeDataInfo.number
        await schemeOfWorkStore.fetchConceptsBySubTopic(props.schemeDataInfo.sub_topic_number)
        // fetch lesson plan draftData
        await schemeOfWorkStore.fetchLessonPlanDetails(props.schemeDataInfo.number)
      }
    },
    {deep: true}
)

const resetFormData = () => {
   form.value = [{
    number: "",
    code: 1,
    lesson_plan_concept_number: "",
    concept_name: "",
    steps: [{
      number: "",
      code: "1",
      step: ""
    }]
  }]
}

watch(
    () => schemeOfWorkStore.conceptsBySubtopicResponse,
    async (data) => {
      if (data) {
        conceptListData.value = data.data

     /*   let obj = {}
        let arr = []
        if(conceptInfo && (conceptInfo.length > 0)) {
          form.value = []
          conceptInfo.forEach((lst, index) => {
            obj = {
              number: "",
              code: (index + 1),
              lesson_plan_concept_number: lst.number,
              concept_name: lst.name,
              steps: [{
                number:"",
                code: "1",
                step: ""
              }]
            }
            arr.push(obj)
          })
        }*/

        // form.value = arr


      }
    },
    {deep: true}
)

watch(
    () => schemeOfWorkStore.newLessonPlanResponse,
    async (data) => {
      if (data) {
        loader.value = false
      }
    },
    {deep: true}
)

watch(
    () => schemeOfWorkStore.errorMessage,
    async (data) => {
      if (data) {
        loader.value = false
      }
    },
    {deep: true}
)


watch(
    () => schemeOfWorkStore.lessonPlanResponse,
    async (data) => {
      if (data && data.data) {

        //lessonPlanDetailsInfo.value = data.data
        let lessonPlan = data.data
         lessonPlanNumber.value = lessonPlan.number ? lessonPlan.number : ""
        let conceptsInfo = lessonPlan.concepts
        if(conceptsInfo && (conceptsInfo.length > 0)){

          let arr = []
          let obj = {}

          conceptsInfo.forEach(lst => {
            let step = (lst.steps && (lst.steps.length > 0)) ? lst.steps : [{number:"", code: "1", step: ""}]
            obj = {
              number: lst.number,
              code: lst.code,
              lesson_plan_concept_number: lst.lesson_plan_concept_number,
              concept_name: lst.concept_name,
              steps: step
            }
            arr.push(obj)
          })
          form.value = arr
        }



      }
    },
    {deep: true}
)

const filterByType = (typ) => {
  type.value = typ
}




const downloadLessonPlanByTemplate = (event) => {
  let data = {
    token:localStorage.getItem("token"),
    scheme_sub_topic_number:props.schemeDataInfo.number
  }
 let  downloadUrl = "https://wholesome-api.noregrets.ug/main/lesson-plan/export-template/"+data.scheme_sub_topic_number+"?token="+data.token;
 
 const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute('download', downloadUrl)
  link.target="_blank"
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)

    // Google Docs Viewer URL
  let viewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(downloadUrl)}&embedded=true`;

document.getElementById('xlsViewer').src = viewUrl;

}




const sub_topic_number = ref(null)
const uploadTemplate = () => {
  sub_topic_number.value = props.schemeDataInfo.number
  showTemplateUpload.value = !showTemplateUpload.value
}

watch(
    () => schemeOfWorkStore.exportLessonPlanResponse,
    async (data) => {
      if (data) {
        loader.value = false
      }
    },
    {deep: true}
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
</script>

<template>
  <div>
    <!-- {{ schemeDataInfo }} -->
    <form @submit.prevent="addLessonPlan">
      <div class="mb-5" style="width: 300px;">
            <label class="text-sm"><small>Type</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="type"
                 @change="filterByType(type)"
            >
              <option disabled value="">--Select type--</option>
              <option v-for="(list, index) in LessonPlanOptions" :key="index" :value="list.value">
                {{list.text}}
              </option>
            </select>
          </div>

<div v-if="type === 'new'">
      <div class="row mx-auto mb-4" >
        <div class="col-lg-5 content">

          <label class="text-sm text-sm">
            <b>Concepts</b>
          </label>
          <div class="row mt-2">
            <div class="col-lg-4">
              <label class="text-sm text-sm">Code</label>
            </div>
            <div class="col-lg-8">
              <label class="text-sm text-sm">Concept</label>
            </div>
          </div>
        </div>
        <div class="col-lg-1 content"></div>
        <div class="col-lg-6 content">
          <label class="text-sm text-sm">
          <b>Teaching steps</b>
        </label>
          <div class="row mt-2">
            <div class="col-lg-3 content">
              <small>Code</small>
            </div>
            <div class="col-lg-3 content">
              <small>
                Step
              </small>
            </div>
          </div>
        </div>
      </div>


      <div v-for="(list, index) in form" :key="index">

      <div class="row mx-auto">
        <div class="col-lg-5 content">

          <div class="row">
            <div class="col-lg-4">
              <div class="mb-2">

                <input
                    @keypress="commons.codeValidator($event)"
                    maxlength="10"
                    type="text"
                    v-model="list.code"
                    @paste.prevent
                    required
                    class="form-control form-control-sm shadow-none">
              </div>
            </div>
            <div class="col-lg-8">
              <div class="mb-2 flex justify-content-between">
                <select
                    :disabled="!!form[0].number"
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="list.lesson_plan_concept_number"
                >
                  <option disabled value="">--Select Concept--</option>
                  <option v-for="(list, index) in conceptListData" :key="index" :value="list.number">
                    {{list.code+". "+list.name}}
                  </option>
                </select>
                <button
                    v-if="index !== 0 && !form[0].number"
                    @click="removeConcept(index)"
                    type="button"
                    class="btn-close btn-sm border-0 mt-1">
                </button>
              </div>
            </div>
          </div>







        </div>
        <div class="col-lg-1 content"></div>
        <div class="col-lg-6 content">
          <div class="mb-3">


            <div v-for="(lst, idx) in list.steps" :key="idx">

              <div class="row">
                <div class="col-lg-3 content">
                  <input
                      @keypress="commons.codeValidator($event)"
                      maxlength="10"
                      type="text"
                      v-model="lst.code"
                      @paste.prevent
                      required
                      class="form-control form-control-sm shadow-none">
                </div>
                <div class="col-lg-8 content">
                  <input
                      style="outline: none 0 !important; box-shadow: none;"
                      type="text"
                      v-model="lst.step"
                      required
                      class="form-control form-control-sm">
                </div>
                <div class="col-lg-1 content">
                  <button
                      v-if="idx !== 0"
                      @click="removeStep(index,idx)"
                      type="button"
                      class="btn-close btn-sm border-0">
                  </button>
                </div>
              </div>
            </div>

            <button
                @click="addStep(index)"
                type="button"
                class="btn btn-sm btn-secondary border-0 mt-2">
              <i style="font-size: 15px;" class="bi-plus mr-1"></i>
              Add Step
            </button>


          </div>


        </div>
      </div>
      <hr />
      </div>

      <button
          @click="addConcept"
          type="button"
          class="btn btn-sm btn-success border-0">
        <i style="font-size: 15px;" class="bi-plus mr-1"></i>
        Add Concept
      </button>


      <div class="flex justify-content-end mt-5" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
            {{form[0].number ? "Edit" : "Save"}}
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

  </div>

  <div class="row mx-auto" v-if="type == 'template'">
        <div class="col-lg-12 content">
          <div>
            <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="downloadLessonPlanByTemplate">
              <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
              Download template
            </button>
            <button type="button"  class="btn btn-sm buttonStyle btn-success mr-2"  @click="uploadTemplate">
              <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Import template
            </button>



            <div v-if="showTemplateUpload">
              <div>

                 <ImportLessonPlan :subTopicNumber="sub_topic_number"></ImportLessonPlan>

              </div>

            </div>


          </div>
       
        </div>


       <!-- iframe to open xls file?? -->

       <div class="col-lg-12 content mt-3">
          <iframe id="xlsViewer" style="width:100%; height:500px;" frameborder="0"></iframe>
        </div>
      </div>
    </form>


  </div>
</template>

<style scoped>

</style>