<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

import {useRouter} from "vue-router";

const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()
const campusStore = useCampusStore()
const campusNumber = routerData.currentRoute.value.query.id
// const campus_curriculum_number = routerData.currentRoute.value.query.crr

const props = defineProps({
    reportTemplateNumber:String
  })


const errorMessage = ref("")
const loader = ref(false)
const classList = ref([])

const form = reactive({
  ReportTemplateNumber:props.reportTemplateNumber,
  CampusClasses:[]
})

const toggleClass = (selectedClass) => {
    const index = form.CampusClasses.indexOf(selectedClass);
    if (index === -1) {
        form.CampusClasses.push(selectedClass);
    } else {
        form.CampusClasses.splice(index, 1);
    }
}

onMounted(() => {
    campusStore.fetchClassesByCampus(campusNumber)
    }
)

const addClassToReportTemplate = () => {

  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  // alert(JSON.stringify(form))
  reportSetupStore.addClassToReportTemplate(form)
}


watch (
  () => reportSetupStore.classToReportTemplateResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
      reportSetupStore.fetchReportTemplate()
      loader.value=false
    }
  },
  {deep:true}
)

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
            //   reportSetupStore.fetchReportTemplate()
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

</script>

<template>
  <div>
    <!-- {{reportTemplateNumber}} -->
  <form @submit.prevent="addClassToReportTemplate">
    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="mb-2">
    <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

<li class="list-group-item" v-for="(list, index) in classList" :key="index" :value="list.number">
    <div class="row">
            <div class="col-lg-1" style="width: 5px;">
                <input
            v-model="form.CampusClasses"
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1 " type="checkbox" :value="list.number" :id="list.number">
            </div>
            <div class="col-lg-11" style="float: left;">
                <label class="textSize" :for="list.number"><small>{{list.class_name}} [{{ list.class_abbreviation }}]</small></label>
            </div>
    </div>
                
</li>

</ul>
</div>


    <div class="flex justify-content-end mt-4" style="width: 100%;">
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

<style scoped>
.textSize{
    font-size: 13px;
}
</style>