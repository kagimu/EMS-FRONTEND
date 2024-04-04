<template>
  <div>

    <form @submit.prevent="addReference">

    <div class="row mx-auto">
      <div class="col-lg-10 content mx-auto">


    <div class="row mt-2">
      <div class="col-lg-3 content">
        <small>Code</small>
      </div>
      <div class="col-lg-3 content">
        <small>
          Learning Material
        </small>
      </div>
      <div class="col-lg-5 content">
      <small>
        Reference description
      </small>
    </div>
    </div>


    <div v-for="(lst, idx) in form" :key="idx">
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
        <div class="col-lg-3 content">


            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="lst.learningMaterialNumber"
            >
              <option disabled value="">--Select Material--</option>
              <option v-for="(list, index) in learningMaterialsList" :key="index" :value="list.number">
                {{list.code+". "+list.name}}
              </option>
            </select>

        </div>
        <div class="col-lg-5 content">
          <input
              style="outline: none 0 !important; box-shadow: none;"
              type="text"
              v-model="lst.description"
              required
              class="form-control form-control-sm">
        </div>
        <div class="col-lg-1 content">
          <button
              @click="removeRef(idx)"
              type="button"
              class="btn-close btn-sm border-0">
          </button>
        </div>
      </div>

    </div>
        <button
            @click="addRef"
            type="button"
            class="btn btn-sm btn-secondary border-0 mt-2">
          <i style="font-size: 15px;" class="bi-plus mr-1"></i>
          Add Reference
        </button>


        <div class="flex justify-content-end" style="width: 100%;">
          <button
              type="submit"
              class="btn btn-primary border-0">
               {{(form && form[0].number) ? 'Edit' : 'Save'}}
            <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
          </button>
        </div>


      </div>
    </div>





    </form>




  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
import {useLearningMaterialStore} from "@/main/settings/learning-materials/resources_store.js";
import useCommonsStore from "@/composables/useCommons.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const learningMaterialsList = ref([])
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const resourcesStore = useLearningMaterialStore()
const commons = useCommonsStore()

const classStore = useClassesStore()
const curriculumNumber = routerData.currentRoute.value.query.id

const subTopicData = ref(null)
const subTopicNumber = ref(null)


const form = ref([
  {
    number: "",
    code: 1,
    learningMaterialNumber: "",
    description: "",
  }
])


const addReference = () => {
  loader.value = true

  let formData =  form.value

  formData.forEach(lst => {
    lst.code = parseInt(lst.code)
  })

  let data = {}
  data.references = formData
  data.sub_topic_number = subTopicNumber.value

  resourcesStore.newCurriculumSubtopicReference(data)
}

const addRef = () => {

  let data = {
    code: (form.value.length + 1),
    learningMaterialNumber: "",
    description: "",
  }
  form.value.push(data)
}

const removeRef = (idx) => {
  form.value.splice(idx, 1)
}



const props = defineProps({
  subTopicInfo: {},
})


onMounted(
    () =>{
       resourcesStore.fetchLearningMaterials()
    }
)


watch(
    () => resourcesStore.learningMaterialsResponse,
    async (data) => {
      if(data){
         learningMaterialsList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => resourcesStore.curriculumSubtopicReferenceResponse,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.successToast("Error",data.message)
       await resourcesStore.fetchLearningMaterials()
      }
    },
    {deep:true}
)

watch(
    () => resourcesStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => props.subTopicInfo,
    async (data) => {
      if(data){

        subTopicData.value = data
        subTopicNumber.value = data.number
        let references = data.references

        form.value =   [{
          number: null,
          code: 1,
          learningMaterialNumber: "",
          description: "",
        }]

        if(references && (references.length > 0)){
          form.value = []
          let arr = []
          let obj = {}
          references.forEach(lst => {
            obj = {
              code: lst.code,
              learningMaterialNumber: lst.learning_material_number,
              description: lst.description,
              number: lst.number,
            }
            arr.push(obj)
          })
          form.value = arr
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