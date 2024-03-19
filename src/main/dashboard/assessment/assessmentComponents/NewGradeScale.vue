<template>
    <div>
        <div class="modal-content">
      <div class="modal-header text-sm p-0">
        <h6 class="modal-title ml-3 mt-2 mb-2"><small>Add Aggregate Scale</small></h6>
        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="createScale()">
      <div class="mb-2">
        <label class="textColor"><small>Name</small></label>
       <input v-model="form.name" placeholder="D2" type="text" class="form-control">
      </div>
      <div class="mb-2">
              <label class="textColor"><small>School</small> <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="form.school_number"
                      @change="fetchCampuses(form.school_number)"
              >
                  <option disabled value="">Select School</option>
                  <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                  </option>
              </select>
          </div>


          <div class="mb-2">
              <label class="textColor"><small>Campus</small>  <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="form.campus_number" required
                      @change="fetchClasses(form.campus_number)"
              >
                  <option disabled value="">Select campus</option>
                  <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                  </option>
              </select>
          </div>


          <div class="mb-2">
              <label class="textColor"><small>Class</small> <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="form.class_number"
              >
                  <option disabled value="">Select class</option>
                  <option v-for="(list, index) in classList" :key="index" :value="list.class_number">{{ list.class_name }}
                  </option>
              </select>
          </div>


          <div class="mb-2">
              <label class="textColor"><small>Level</small> <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="form.level_number"
              >
                  <option disabled value="">Select Level</option>
                 <option v-for="(levelList,index) in levelData" :key="index" :value="levelList.number">{{ levelList.name }}</option>
                 <option></option>
              </select>
          </div>

          <div class="mb-2">
              <label class="textColor"><small>Grading Standard</small> <span class="star">*</span></label>
              <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="form.grading_standard_number"
              >
                  <option disabled value="">Select</option>
                 <option v-for="(gradeList,index) in gradeData" :key="index" :value="gradeList.number">{{ gradeList.name }}</option>
                 <option></option>
              </select>
          </div>

          
      <div class="mb-2">
        <div class="row">
            <div class="col-lg-4">
                <label class="textColor"><small>Minimum Value</small></label>
               <input v-model="form.min_value" type="number" class="form-control">
            </div>
            <div class="col-lg-4">
                <label class="textColor"><small>Maximum Value</small></label>
             <input v-model="form.max_value" type="number" class="form-control">
            </div>

            <div class="col-lg-4">
                <label class="textColor"><small>Weight</small></label>
             <input v-model="form.weight" type="number" class="form-control" placeholder="1">
            </div>
        </div>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Description</small></label>
        <textarea v-model="form.description" class="form-control">


        </textarea>
      </div>
     <div class="flex justify-content-end mt-2" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i> submit</small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
    </div>
    </div>
    </div>

</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { useAssessmentStore } from "../store/assessment";
import { useLevelStore } from "../../../settings/level/store/level";

const  notificationStore  = useNotificationStore()
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const school_number = ref(null)
const buttonLoader = ref(false)
const assessmentStore = useAssessmentStore()
const errorMessage = ref(null)
const aggregateData = ref([])
const levelData = ref([])
const levelStore = useLevelStore()
const gradeData = ref([])

const form = reactive({
name : null,
min_value: null,
max_value: null,
level_number: null,
weight: null,
description: null,
class_number: null,
school_number: null,
campus_number: null,
grading_standard_number:null
})

const createScale = () =>{
    // alert(JSON.stringify(form))
    assessmentStore.createAggregateScale(form)
}



watch (
    () => assessmentStore.newAggregateScaleResponse,
    async (data) => {
      if(data){
        assessmentStore.fetchAggregateScale()
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


onMounted(
    async () => {
      await assessmentStore.fetchGradeStandard()
    } )
    
watch (
    () => assessmentStore.gradeStandardResponse,
    async (data) => {
      if(data){
        gradeData.value = data.data
      }
    },
    {deep:true}
)


const fetchCampuses = (school_number) => {
      campusStore.fetchCampuses(school_number)
  }

  const fetchClasses = (campus_number) => {
      campusStore.fetchClassesByCampus(campus_number)
  }

  onMounted(() => {
          schoolStore.fetchSchools()
      }
  )

  watch(
      () => schoolStore.schoolsResponse,
      async (data) => {
          if (data) {
              schoolList.value = data.data
          }
      },
      {deep: true}
  )

  watch(
      () => campusStore.campusListResponse,
      async (data) => {
          if (data) {
              campusList.value = data.data
          }
      },
      {deep: true}
  )

  watch(
      () => campusStore.campusClassesResponse,
      async (data) => {
          if (data) {
              classList.value = data.data
          }
      },
      {deep: true}
  )

  watch(
      () => campusStore.errorMessage,
      async (data) => {
            if (data) {
                notificationStore.errorToast("Error", data.message)
            }
      },
      {deep: true}
  )

  onMounted(() => {
          levelStore.fetchLevels()
      }
  ) 
  watch(
      () => levelStore.levelInfoResponse,
      async (data) => {
          if (data) {
              levelData.value = data.data
          }
      },
      {deep: true}
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