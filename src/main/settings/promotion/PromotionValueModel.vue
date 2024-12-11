<script setup>
  
import {onMounted, reactive, ref, watch,defineEmits} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {usePromotionStore} from "./store/promotion.js"
import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";

const emit = defineEmits();
const classError = ref(null)
const loader = ref(false)
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const promotionStore = usePromotionStore()
const assessmentStore = useAssessmentStore()
const isGrade = ref(null)
const subjectStore = useSubjectStore()

const promoSettingList = ref([])
const assessmentScaleData = ref([])
const subjectList = ref([])

const form = reactive({
  type:null,
  score:null,
  promotion_setting_number:null,
  assessment_grade_number:null
})

const theType = () => {
  isGrade.value = form.type
}

const addPromotionValue = () =>{
  loader.value = true
  promotionStore.newPromotionSettingValue(form)
} 




onMounted(() => {
        assessmentStore.fetchAssessmentGrades()
        promotionStore.fetchPromotionSetting()
        subjectStore.fetchAllSubjects()
    }
) 
watch(
  () => assessmentStore.assessmentScaleResponse,
  async (data) => {
    if(data){
      loader.value = false
      // notificationStore.successToast("Success", data.message)
      assessmentScaleData.value = data.data
    }
  },
  {deep:true}
)



watch(
  () => promotionStore.newPromotionSettingValueResponse,
  async (data) => {
      if (data) {
        loader.value = false
        notificationStore.successToast("Success", data.message)
        promotionStore.fetchPromotionSettingValue()
        form.type=null,
        form.score=null,
        form.promotion_setting_number=null,
        form.assessment_grade_number=null
      }
  },
  {deep: true}
)

watch(
  () => promotionStore.errorMessage,
  async (data) => {
        if (data) {
            notificationStore.errorToast("Error", data.message)
        }
  },
  {deep: true}

)

watch(
  () => promotionStore.PromotionSettingResponse,
  async (data) => {
      if (data) {
        promoSettingList.value = data.data
        // notificationStore.s`uccessToast("Success application submitted", data.message)
      }
  },
  {deep: true}
)


</script>


<template>
    <div>

      <form @submit.prevent="addPromotionValue">
  
        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
          {{ classError }}
        </div>

        <div class="mb-2">
            <label class="text-sm"><small>Promotion Setting</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.promotion_setting_number" required
            >
                <option disabled value="">Select Promotion Setting</option>
                <option v-for="(list, index) in promoSettingList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>

        <div class="mb-2">
            <label class="text-sm"><small>Type</small>  </label><br>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.type"
                    @change="theType()"
                  
            >
                <option disabled value="">Select Type</option>
                <option value="score">Score
                </option>
                <option value="aggregate">Aggregate
                </option>
                <option value="grade">Grade
                </option>
                <option value="assessment">Assessment Area
                </option>
            </select>
         
        </div>

        <div class="mb-2" v-if="isGrade == 'score' || isGrade=='aggregate'">
          <label class="text-sm"><small>Value</small></label>
          <input
              style="outline: none 0 !important; box-shadow: none;"
              type="number" v-model="form.score"
              required
              class="form-control form-select-sm">
        </div>

        
        <div class="mb-2" v-if="isGrade == 'grade'">
            <label class="text-sm"><small>Assessment Grade</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.assessment_grade_number" required
            >
                <option disabled value="">Assessment Grade</option>
                <option v-for="(list, index) in assessmentScaleData" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>


        <div class="mb-2" v-if="isGrade == 'assessment'">
            <label class="text-sm"><small>Assessment Area</small>  </label>
      
        </div>
       
  
        <div class="flex justify-content-end mt-2" style="width: 100%;">
          <button
              type="submit"
              class="btn btn-primary border-0">
              {{levelNumber ? "Edit" : "Save"}}
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