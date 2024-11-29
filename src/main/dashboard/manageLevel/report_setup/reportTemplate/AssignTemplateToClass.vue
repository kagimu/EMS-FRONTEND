<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";


const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()
const campusStore = useCampusStore()
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const schoolN = routerData.currentRoute.value.query.sch
const campusLevelList = ref([])
const classStore = useClassesStore()
const campus_level_number = ref("")
const addedClassData = ref([])

const props = defineProps({
    reportTemplateNumber:String,
    addedClasses:{}
  })

  onMounted(() => {
    fetchCampusLevel()
    filterAddedClasses()
    }
)


watch(
    () => props.addedClasses,
    async (data) => {
      if(data){
        filterAddedClasses()
      }
    }
)

const filterAddedClasses = () => {
  let draft = props.addedClasses
  if(draft) {
    addedClassData.value = draft[0]?.classes?.map(item => item.number);
  }
}

const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}
const errorMessage = ref("")
const loader = ref(false)
const classList = ref([])

const form = reactive({
  report_template_number:props.reportTemplateNumber,
  classes:[],
  campus_number:campusNumber
})

const toggleClass = (selectedClass) => {
    const index = form.classes.indexOf(selectedClass);
    if (index === -1) {
        form.classes.push(selectedClass);
    } else {
        form.classes.splice(index, 1);
    }
}



const addClassToReportTemplate = () => {
  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  reportSetupStore.addClassToReportTemplate(form)
}


const fetchClasses = (campus_level_number) => {
  let data = {
    school_number:schoolN,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
}


watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    }
)


watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    },
    {deep:true}
)


watch (
  () => reportSetupStore.classToReportTemplateResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
      loader.value=false
    }
  }
)

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
          if (data) {
              loader.value=false
              notificationStore.errorToast("Error", data.message)
          }
    }
)





</script>

<template>
  <div>

  <form @submit.prevent="addClassToReportTemplate">

    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="mb-2">
      <label class="text-sm"><small>Level</small></label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="campus_level_number"
          @change="fetchClasses(campus_level_number)"
      >
        <option disabled value="">--Select Level--</option>
        <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
      </select>
    </div>

    <div class="mb-2">
    <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
<li class="list-group-item" v-for="(list, index) in classList" :key="index" :value="list.number">
    <div class="row">
            <div class="col-lg-2 mr-2" style="width: 5px;">
                <input
            v-model="form.classes"
            style="outline: none 0 !important; box-shadow: none;width: 20px;height: 20px;"
            class="form-check-input form-control mr-2" type="checkbox" :value="list.number" :id="list.number"
            >
            </div>
            <div class="col-lg-10" style="float: left;">
                <label class="text-sm" :for="list.number"><small>{{list.name}} [{{ list.abbreviation }}]</small></label>
            </div>
    </div>
                
</li>

</ul>
</div>


    <div class="flex justify-content-end mt-4" style="width: 100%;">
      <button
          type="submit"
          class="btn btn-primary border-0">
        Submit
        <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
      </button>
    </div>

  </form>
  </div>
</template>

<style scoped>
.text-sm{
    font-size: 13px;
}
</style>