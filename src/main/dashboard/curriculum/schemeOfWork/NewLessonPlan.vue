<template>
  <div>



    <form @submit.prevent="addLessonPlan">

      <div class="row mx-auto mb-4">
        <div class="col-lg-4 content">
          <label class="textColor"><small><b>Concept</b></small></label>
        </div>
        <div class="col-lg-1 content"></div>
        <div class="col-lg-6 content">
          <label class="textColor text-sm">
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
        <div class="col-lg-4 content">
<!--          <label class="textColor"><small>Concept</small></label>-->

<!--          <div class="mb-2">
            <label class="textColor text-sm">Code</label>
            <input
                disabled
                @keypress="commons.numbersOnlyValidator($event)"
                maxlength="10"
                style="outline: none 0 !important; box-shadow: none;"
                type="text"
                v-model="list.code"
                required
                class="form-control form-control-sm">
          </div>-->


          <div class="mb-2">
            <textarea
                style="outline: none 0 !important; box-shadow: none;"
                readonly
                v-model="list.concept_name"
                class="form-control noFocus"
                id="exampleFormControlTextarea1"
                rows="2"></textarea>
          </div>

        </div>
        <div class="col-lg-1 content"></div>
        <div class="col-lg-6 content">
          <div class="mb-3">


            <div v-for="(lst, idx) in list.steps" :key="idx">

              <div class="row">
                <div class="col-lg-3 content">
                  <input
                      @keypress="commons.numbersOnlyValidator($event)"
                      maxlength="10"
                      style="outline: none 0 !important; box-shadow: none;"
                      type="text"
                      v-model="lst.code"
                      required
                      class="form-control form-control-sm">
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


      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
          Save
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>
<script setup>


import {reactive, ref, watch} from "vue";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import useCommonsStore from "@/composables/useCommons.js";

const schemeOfWorkStore = useSchemeOfWorkStore()
const conceptListData = ref([])
const commons = useCommonsStore()

const loader = ref(false)

const scheme_sub_topic_number = ref(null)

const lessonPlanNumber = ref("")

const form = ref([{
  number: "",
  code: "",
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
const addLessonPlan = () => {
    loader.value = true

    let formData = {}

  formData.scheme_sub_topic_number = scheme_sub_topic_number.value
  formData.concepts = form.value
  formData.lesson_plan_number = lessonPlanNumber.value

  if(formData.concepts && (formData.concepts.length > 0)){}
  formData.concepts.forEach(lst => {
    lst.steps.forEach(list => {
      list.code = parseInt(lst.code)
    })
  })

  schemeOfWorkStore.saveLessonPlan(formData)
}

watch(
    () => props.schemeDataInfo,
    async (data) => {
      if (data) {
        scheme_sub_topic_number.value = props.schemeDataInfo.number
        await schemeOfWorkStore.fetchConceptsBySubTopic(props.schemeDataInfo.sub_topic_number)
        // fetch lesson plan draftData
        await schemeOfWorkStore.fetchLessonPlanDetails(props.schemeDataInfo.number)
      }
    },
    {deep: true}
)

watch(
    () => schemeOfWorkStore.conceptsBySubtopicResponse,
    async (data) => {
      if (data) {
      let conceptInfo = data.data


        conceptListData.value = conceptInfo

        let obj = {}
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
        }

        form.value = arr


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

/*watch(
    () => schemeOfWorkStore.errorMessage,
    async (data) => {
      if (data) {
        loader.value = false
      }
    },
    {deep: true}
)*/


watch(
    () => schemeOfWorkStore.lessonPlanResponse,
    async (data) => {
      if (data && data.data) {

        //lessonPlanDetailsInfo.value = data.data
        let lessonPlan = data.data
         lessonPlanNumber.value = lessonPlan.number ? lessonPlan.number : ""
        let conceptsInfo = lessonPlan.concepts
        if(conceptsInfo && (conceptsInfo.length > 0)){
          form.value = []
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



    /*    const form = ref([{
          code: "",
          lesson_plan_concept_number: "",
          concept_name: "",
          steps: [{
            number: "",
            code: "1",
            step: ""
          }]
        }])*/


      }
    },
    {deep: true}
)

</script>
<style scoped>

</style>