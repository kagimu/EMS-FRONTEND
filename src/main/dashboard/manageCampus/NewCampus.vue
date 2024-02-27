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
            <label class="textColor"><small>Campus Name</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="text"
                v-model="form.name"
                required
                class="form-control form-select-sm">
          </div>

          <div class="mb-2">
            <label class="textColor"><small>Phone</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="tel"
                v-model="form.phone"
                required
                class="form-control form-select-sm">
          </div>

          <div class="mb-2">
            <label class="textColor"><small>Email</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="email"
                v-model="form.email"
                required
                class="form-control form-select-sm">
          </div>


          <div class="mb-2">
            <label class="textColor text-sm">Location</label>
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
              <label class="textColor text-sm">Commencement Date</label>
              <input
                  style="outline: none 0 !important; box-shadow: none;"
                  type="date"
                  v-model="form.commencement_date"
                  required
                  class="form-control form-control-sm">
            </div>


<!--            <div class="mb-2">
              <label class="textColor"><small>Curriculum</small></label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.school_curriculum_number"
                  @change="filterCurriculumLevel(form.school_curriculum_number)"
              >
                <option disabled value="">Select Curriculum</option>
                <option v-for="(list, index) in curriculumList" :key="index" :value="list.number">
                  {{list.name}}
                </option>
              </select>
            </div>-->

            <div class="mb-2">
              <label class="textColor mt-3 mb-2"><small>Select Curriculum(s) to adopt to this campus</small></label>
              <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
                <li class="list-group-item" v-for="(lvl,idx) in curriculumList">
                  <input
                      v-model="form.campus_curriculum"
                      style="outline: none 0 !important; box-shadow: none;"
                      class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="idx">
                  <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
                </li>

              </ul>
            </div>



<!--         <div>
           <label class="textColor mt-3 mb-2"><small>Select Class Levels</small></label>
           <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
             <li class="list-group-item" v-for="(lvl,idx) in curriculumLevelList">
               <input
                   v-model="form.curriculum_level_number"
                   style="outline: none 0 !important; box-shadow: none;"
                   class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="idx">
               <label class="form-check-label cursor-pointer" :for="idx">{{lvl.name}}</label>
             </li>
           </ul>
         </div>-->

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

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";

const routerData = useRouter()
const errorMessage = ref(null)
const name = ref(null)
const loader = ref(false)
const schoolsList = ref( [])
const school = ref( null)
const levelStore = useLevelStore()
const levelList = ref([])
const curriculumList = ref([])
// const curriculumLevelList = ref([])

const campusStore = useCampusStore()
const schoolStore = useSchoolStore()

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



onMounted(
    async () =>{
      await levelStore.fetchLevels()
      await curriculumStore.fetchSchoolCurriculum(schoolNumber)
    }
)

/*const filterCurriculumLevel = (school_curriculum_number) => {
  curriculumStore.fetchSchoolCurriculumLevel(school_curriculum_number)
}*/

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
          arr.push(lst.number)
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
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

/*watch(
    () => curriculumStore.schoolCurriculumLevelResponse,
    async (data) => {
      if(data){
        curriculumLevelList.value = data.data
      }
    },
    {deep:true}
)*/

</script>

<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>