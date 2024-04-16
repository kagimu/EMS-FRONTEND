<template>
    <div>
        <div class="modal-content">
      <div class="modal-header text-sm p-0">
     <!-- {{ scaleD }} -->
        <h6 class="modal-title ml-3 mt-2 mb-2"><small>{{ title }}</small></h6>
        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="createScale()">
            <div class="row">
                <div class="col-8">
                <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input v-model="form.name" placeholder="First Grade, Second Grade ..." type="text" class="form-control">
                </div>
                </div>
                <div class="col-4">
                <div class="mb-2">
                <label class="textColor"><small>Abbreviation</small></label>
                <input v-model="form.abbreviation" placeholder="Division 1 / Result 1" type="text" class="form-control">
                </div>
                </div>
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
                      v-model="form.campus_class_number"
              >
                  <option disabled value="">Select class</option>
                  <option v-for="(list, index) in classList" :key="index" :value="list.number">{{ list.class_name }}
                  </option>
              </select>
          </div>

<!-- 
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
          </div> -->

          
      <div class="mb-2">
        <div class="row">
            <div class="col-lg-6">
                <label class="textColor"><small>Minimum Value</small></label>
               <input
                   maxlength="3"
                   @keypress="commons.numbersOnlyValidator($event)"
                   v-model="form.minimum_points"
                   type="text"
                   class="form-control"
               >
            </div>
            <div class="col-lg-6">
                <label class="textColor"><small>Maximum Value</small></label>
             <input
                 maxlength="3"
                 @keypress="commons.numbersOnlyValidator($event)"
                 v-model="form.maximum_points"
                 type="text"
                 class="form-control">
            </div>

        </div>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Description</small></label>
        <textarea v-model="form.description" class="form-control textColor">
        </textarea>
      </div>
      
      <div class="mb-2">
        <label class="textColor"><small>Remarks</small></label>
        <textarea v-model="form.remarks" class="form-control textColor">
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
import useCommonsStore from "@/composables/useCommons.js";
const commons = useCommonsStore()
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
const levelData = ref([])
const levelStore = useLevelStore()
let title = ref("Add Assessment Scale")


const form = reactive({
name : null,
maximum_points: null,
minimum_points: null,
campus_class_number: null,
description: null,
abbreviation: null,
remarks:null
})

const scaleDataList = ref(null)

const props = defineProps({
    scaleD:String
  })

  
  watch (
    () => props.scaleD,
    async (data) => {
      if(data){
        title.value = "UPDATE ASSESSMENT GRADE SCALE"
        scaleDataList.value =props.scaleD
        form.name = props.scaleD.name
        form.maximum_points=props.scaleD.maximum_points,
        form.minimum_points=props.scaleD.minimum_points,
        form.campus_class_number=props.scaleD.campus_class_number,
        form.grade=props.scaleD.Grade,
        form.description=props.scaleD.description,
        form.abbreviation=props.scaleD.abbreviation,
        form.remarks=props.scaleD.remarks
      }
    },
    {deep:true}
)
const createScale = () =>{
    // alert(JSON.stringify(form))
    if(props.scaleD.number){
        assessmentStore.updateAssessmentScale(form,props.scaleD.number)

    }else{
        assessmentStore.createAssessmentScale(form)
    }

}



onMounted(() => {
          assessmentStore.fetchAssessmentScale()
      }
  ) 


watch (
    () => assessmentStore.newAssessmentScaleResponse,
    async (data) => {
      if(data){
        assessmentStore.fetchAssessmentScale()
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        form.name = null,
        form.maximum_points=null,
        form.minimum_points=null,
        form.campus_class_number=null,
        form.grade=null,
        form.description=null,
        form.abbreviation=null,
        form.remarks=null
      }
    },
    {deep:true}
)



watch (
    () => assessmentStore.updateAssessmentScaleResponse,
    async (data) => {
      if(data){
        assessmentStore.fetchAssessmentScale()
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        form.name = null,
        form.maximum_points=null,
        form.minimum_points=null,
        form.campus_class_number=null,
        form.grade=null,
        form.description=null,
        form.abbreviation=null,
        form.remarks=null,
        form.school_number=null
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