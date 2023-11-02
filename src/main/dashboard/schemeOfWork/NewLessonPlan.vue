<template>
  <div>
    <!--  {{schemeDataInfo}} <br />-->
    <!--  -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;<br />-->


    <form @submit.prevent="addLessonPlan">

      <div class="row mx-auto">
        <div class="col-lg-4 content">

          <div class="mb-2">
            <label class="textColor text-sm">Code</label>
            <input
                @keypress="commons.numbersOnlyValidator($event)"
                maxlength="10"
                style="outline: none 0 !important; box-shadow: none;"
                type="text"
                v-model="form.code"
                required
                class="form-control form-control-sm">
          </div>


          <div class="mb-2">
            <label class="textColor"><small>Concept</small></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="form.lesson_concept_number"
            >
              <option disabled value="">Select Concept</option>
              <option v-for="(list, index) in conceptListData" :key="index" :value="list.number">{{ list.name }}
              </option>
            </select>
          </div>

        </div>
        <div class="col-lg-1 content"></div>
        <div class="col-lg-6 content">
          <div class="mb-3">
            <label class="textColor text-sm">
              Teaching steps
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

            <div v-for="(lst, idx) in steps" :key="idx">

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
                      @click="removeStep(idx)"
                      type="button"
                      class="btn-close btn-sm border-0">
                  </button>
                </div>
              </div>
            </div>

            <button
                @click="addStep"
                type="button"
                class="btn btn-sm btn-secondary border-0 mt-2">
              <i style="font-size: 15px;" class="bi-plus mr-1"></i>
              Add Step
            </button>


          </div>


        </div>
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
import {useSchemeOfWorkStore} from "@/main/dashboard/schemeOfWork/store/schemeOfWork.js";
import useCommonsStore from "@/composables/useCommons.js";

const schemeOfWorkStore = useSchemeOfWorkStore()
const conceptListData = ref([])
const commons = useCommonsStore()

const loader = ref(false)

const steps = ref([
  {
    code: "1",
    step: ""
  }
])

const form = reactive({
  sub_topic_scheme_number: "",
  code: "",
  lesson_concept_number: "",
})

const props = defineProps({
  schemeDataInfo: {}
})

const addStep = () => {

  let data = {
    code: (steps.value.length + 1),
    step: ""
  }
  steps.value.push(data)
}

const removeStep = (idx) => {
steps.value.splice(idx, 1)
}
const addLessonPlan = () => {
    form.steps = steps.value
    alert(JSON.stringify(form))
}

watch(
    () => props.schemeDataInfo,
    async (data) => {
      if (data) {
        form.sub_topic_scheme_number = props.schemeDataInfo.number
        await schemeOfWorkStore.fetchConceptsBySubTopic(props.schemeDataInfo.sub_topic_number)
      }
    },
    {deep: true}
)

watch(
    () => schemeOfWorkStore.conceptsBySubtopicResponse,
    async (data) => {
      if (data) {
        conceptListData.value = data.data
      }
    },
    {deep: true}
)


</script>
<style scoped>

</style>