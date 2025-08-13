<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import ComboBox from "@/components/ComboBox.vue";
import { Siren } from "lucide-vue-next";


const academicYearStore = useAcademicYearStore()
const commons = useCommonsStore()
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const campusStore = useCampusStore()
const studyPeriodStore = useStudyPeriodStore()
const classStore = useClassesStore()
const schoolNumber = routerData.currentRoute.value.query.sch
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const errorMessage = ref(null)
const academicYearList = ref([])
const loader = ref(false)
const campus_level_number = ref("")
const campusLevelList = ref([])
const study_period_number = ref(null)
const campusClassList = ref(null)
const date = ref();
const studyPeriodGroupNameList = ref( [])

const form = reactive({
  code:null,
  classes:[],
  academic_year_number:"",
  study_period_start_date:null,
  study_period_end_date:null,
  study_period_name_number	:"",
  next_term_begins_on:null,
  reporting_date: null
})


const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
}

const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  let data = {
    school_number:schoolNumber,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
}

const clearStudyPeriod = () => {
  form.code = null
  form.study_period_name = null
  form.academic_year_number = ""
  form.study_period_start_date = null
  form.study_period_end_date = null
  study_period_number.value = null,
      form.reporting_date = null
}

defineExpose({
  clearStudyPeriod
})


onMounted(
    () =>{
      classStore.fetchCampusLevel(campus_curriculum_number)
      studyPeriodStore.fetchStudyPeriodGroupName(schoolNumber)
      getnextTermBegins()
    }
)


const props = defineProps({
  nextTermBegins:String,
})

const  getnextTermBegins = () => {
  if(props.nextTermBegins){
    form.next_term_begins_on = props.nextTermBegins
  }
}

watch(
    () => props.nextTermBegins,
    async (data) => {
      if(data){
        getnextTermBegins()
      }
    }
)

const addStudyPeriod = () => {
  loader.value = true
  errorMessage.value = ""

  form.code = parseInt(form.code)
  form.study_period_start_date = commons.formatDate(form.study_period_start_date)
  form.study_period_end_date = commons.formatDate(form.study_period_end_date)
  form.next_term_begins_on = commons.formatDate(form.next_term_begins_on)
  form.reporting_date = commons.formatDate(form.reporting_date)

  if(study_period_number.value){
    form.study_period_number = study_period_number.value
    studyPeriodStore.editStudyPeriod(form)
  }else {
    form.code = parseInt(form.code)
    studyPeriodStore.newStudyPeriod(form)
  }

}


watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        let dataInfo = data?.data
        if(dataInfo && (dataInfo?.length > 0)){
          let arr = []
          dataInfo.forEach(item => {
            arr.push({text:item?.name+" [ "+item?.abbreviation+" ]" , value:item?.number})
          })
          campusClassList.value = arr
        }

      }
    }
)



watch(
    () => studyPeriodStore.studyPeriodGroupNameResponse,
    async (data) => {
      if(data){
        studyPeriodGroupNameList.value = data.data
      }
    }
)


watch(
    () => studyPeriodStore.editStudyPeriodResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    }
)


watch(
    () => studyPeriodStore.newStudyPeriodResponse,
    async (data) => {
      if(data){
        loader.value = false
        form.code = null
        form.study_period_name = null
        form.academic_year_number = ""
        form.study_period_date_range = null
        form.class_number=""
      }
    }
)

watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)


watch(
    () => studyPeriodStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)


watch(
    () => studyPeriodStore.studyPeriodDataResponse,
    async (data) => {
      if(data){
        let info = data.data
        form.code = info.code
        form.study_period_name = info.study_period_name
        form.academic_year_number = info.academic_year_number
        form.study_period_start_date = info.study_period_start_date
        form.study_period_end_date = info.study_period_end_date
        form.study_period_name_number	 = info.study_period_name_number
        form.classes = info.classes.map(classItem => classItem.number);
        campus_level_number.value = info.campus_level_number
        fetchAcademicYear(info.campus_level_number)
        study_period_number.value = info.study_period_number
        form.reporting_date = info.reporting_date

      }
    }
)

</script>
<template>


  <div>
    <form @submit.prevent="addStudyPeriod">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>Code</small></label>
        <input
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            type="text"
            v-model="form.code"
            @paste.prevent
            required
            class="form-control form-select-sm shadow-none">
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>Study Period Group Name</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.study_period_name_number"
        >
          <option disabled value="">--Select Study Period Group Name--</option>
          <option v-for="(list, index) in studyPeriodGroupNameList " :key="index" :value="list.study_period_name_number">{{list.name}}</option>
        </select>
      </div>


      <div class="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label class="text-sm"><small>Study Period Start Date</small></label>
          <VueDatePicker
              text-input
              auto-apply
              style="font-size: 7px;"
              v-model="form.study_period_start_date"
              :preview-format="format"
              :teleport="true"
          ></VueDatePicker>
        </div>
        <div>
          <label class="text-sm"><small>Study Period End Date</small></label>
          <VueDatePicker
              text-input
              auto-apply
              style="font-size: 7px;"
              v-model="form.study_period_end_date"
              :preview-format="format"
              :teleport="true"
          ></VueDatePicker>
        </div>
        <div>
          <label class="text-sm"><small>Next Term Begins</small></label>
<!--           {{ nextTermBegins }}-->
<!--          {{form.next_term_begins_on}}-->
          <VueDatePicker
              text-input
              auto-apply
              style="font-size: 7px;"
              v-model="form.next_term_begins_on"
              :preview-format="format"
              :teleport="true"
          ></VueDatePicker>
        </div>
        <div>
          <label class="text-sm"><small>Reporting Date</small></label>
          <VueDatePicker
              text-input
              auto-apply
              style="font-size: 7px;"
              v-model="form.reporting_date"
              :preview-format="format"
              :teleport="true"
          ></VueDatePicker>
        </div>
      </div>


      <div class="mb-2">
        <label class="text-sm"><small>Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_level_number"
            @change="fetchAcademicYear(campus_level_number)"
        >
          <option disabled value="">--Select Level--</option>
          <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="text-sm"><small>Academic Year</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.academic_year_number">
          <option disabled value="">--Select Academic Year--</option>
          <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
            {{list.code+". "+list.academic_year_name}}
          </option>
        </select>
      </div>

      
<!-- 
{{ form?.classes }} -->
      <div class="mb-2">
        <label class="text-sm"><small>Class</small></label>
        <combo-box
            v-model:optionResponse="form.classes"
            :optionList="campusClassList"
            :optionDraft="form?.classes"
        ></combo-box>
      </div>




      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
         {{study_period_number ? "Edit" : "Save"}}
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>

</template>


<style scoped>

</style>