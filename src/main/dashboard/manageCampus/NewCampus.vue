<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
import VueDatePicker from "@vuepic/vue-datepicker";
import useCommonsStore from "@/composables/useCommons.js";
import ComboBox from "@/components/ComboBox.vue";

const campusStore = useCampusStore()
const schoolStore = useSchoolStore()
const commons = useCommonsStore()
const routerData = useRouter()
const errorMessage = ref(null)
const loader = ref(false)
const schoolsList = ref( [])
const school = ref( null)
const levelStore = useLevelStore()
const levelList = ref([])
const curriculumList = ref([])




let schoolNumber = routerData.currentRoute.value.query.id
const curriculumStore = useCurriculumStore()


const campus_number = ref(null)

const form = reactive({
  name:null,
  email:null,
  phone:null,
  location:null,
  campus_curriculum:[],
  commencement_date:null,
})


const addCampus = () =>{

  loader.value = true
  form.school_number = schoolNumber

  if(campus_number.value){
    form.campus_number = campus_number.value
    campusStore.editCampusData(form)
  }else {
    campusStore.newCampusData(form)
  }

}

const props = defineProps({
  school: {},
})


const clearCampusForm = () => {
  form.name = null
  form.email = null
  form.phone = null
  form.location = null
  form.campus_curriculum = []
  form.commencement_date = null
  campus_number.value = null
}

defineExpose({
  clearCampusForm
});

onMounted(
    async () =>{
      await levelStore.fetchLevels()
      await curriculumStore.fetchSchoolCurriculum(schoolNumber)
    }
)

function handleInput() {
  if (form.phone.length > 15) {
    form.phone = form.phone.slice(0, 15);
  }
}

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
}

watch(
    () => props.school,
    async (data) => {
      if(data){
        school.value = data
      }
    },
    {deep:true}
)


watch(
    () => campusStore.campusInfoResponse,
    async (data) => {
      if(data){
        let info = data.data
        form.name = info.name
        form.phone = info.phone
        form.email = info.email
        form.location = info.location
        form.commencement_date = info.commencement_date
        campus_number.value = info.number

        let arr = []
        info.curriculum.forEach(lst => {
          arr.push(lst.school_curriculum_number)
        })

        form.campus_curriculum = arr

      }
    },
    {deep:true}
)


watch(
    () => campusStore.editCampusResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    },
    {deep:true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => levelStore.levelInfoResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => curriculumStore.schoolCurriculumResponse,
    async (data) => {
      if(data){
        let draft = data?.data
        if(draft && (draft.length > 0)){
          let arr = []
         draft.forEach(lst => {
          arr.push({text:lst?.name,value:lst?.number})
         })
         curriculumList.value = arr
        }
       

      }
    },
    {deep:true}
)



</script>
<template>
  <div>

    <form @submit.prevent="addCampus">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="row">
        <div class="col-6">
          <div class="mx-auto" style="width: 95%;">

          <div class="mb-2">
            <label class="text-sm"><small>Campus Name</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="text"
                v-model="form.name"
                required
                class="form-control form-select-sm">
          </div>

          <div class="mb-2">
            <label class="text-sm"><small>Phone</small></label>
            <vue-tel-input
                @input="handleInput"
                @keypress="commons.onlyNumberValidator($event)"
                style="padding:0; outline: none 0 !important; box-shadow: none;"
                class="form-control"
                :input-options="{placeholder: ''}"
                v-model="form.phone"
                :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
                :preferredCountries="['UG']"
                mode="international"></vue-tel-input>
          </div>

          <div class="mb-2">
            <label class="text-sm"><small>Email</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="email"
                v-model="form.email"
                required
                class="form-control form-select-sm">
          </div>


          <div class="mb-2">
            <label class="text-sm text-sm">Location</label>
            <textarea
                style="outline: none 0 !important; box-shadow: none; height: 60px"
                class="form-control noFocus form-control-sm"
                v-model="form.location"
                id="floatingTextarea2"></textarea>
          </div>
          </div>
        </div>
        <div   class="col-6">
          <div class="mx-auto" style="width: 95%;">


            <div class="mb-2">
              <label class="text-sm text-sm">Commencement Date</label>
              <VueDatePicker
                  text-input
                  auto-apply
                  style="font-size: 7px;"
                  v-model="form.commencement_date"
                  :preview-format="format"
                  :teleport="true"
              ></VueDatePicker>
            </div>


            <div class="mb-2">
              <label class="text-sm mt-3 mb-2"><small>Select Curriculum(s) to adopt to this campus</small></label>
              <!-- <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
                <li class="list-group-item" v-for="(lvl,idx) in curriculumList">
                  <input
                      v-model="form.campus_curriculum"
                      style="outline: none 0 !important; box-shadow: none;"
                      class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="idx">
                  <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
                </li>

              </ul> -->

              <combo-box
            v-model:optionResponse="form.campus_curriculum"
            :optionList="curriculumList"
            :optionDraft="form?.campus_curriculum"
        ></combo-box>
            </div>


          </div>
        </div>
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
          {{campus_number ? "Edit":"Save"}}
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>