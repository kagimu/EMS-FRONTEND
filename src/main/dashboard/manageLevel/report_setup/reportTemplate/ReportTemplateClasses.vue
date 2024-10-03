<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import api from "@/config/api.js";
import clearClassModal from "@/main/dashboard/manageLevel/report_setup/reportTemplate/clearClassModal.vue";
import AppModal from "@/components/AppModal.vue";
import AssignTemplateToClass from "@/main/dashboard/manageLevel/report_setup/reportTemplate/AssignTemplateToClass.vue";

const reportSetupStore = useReportSetupStore()
const showClearClassModal = ref(false)
const classOnTemplateList = ref([])
const classListData = ref(null)
const reportTemplateNumber = ref(null)
const showAssignModal = ref(false)
const emit = defineEmits()

const props = defineProps({
    reportTemplateId:String,
    school_number:String
  })

  onMounted(() => {
  fetchTemplateClasses()
    }
)

watch (
  () => props.reportTemplateId,
  async (data) => {
    if(data){
        fetchTemplateClasses()
    }
  }
)

const fetchTemplateClasses = () =>{
 fetchClassesAddedReportTemplate(props.reportTemplateId,props.school_number)
}

const fetchClassesAddedReportTemplate = async (templateN,schoolN)  => {
        return await api.get("main/school/report-templates/by-class?template_number="+templateN+"&school_number="+schoolN)
            .then((response) => {
                if(response && response.data){
                    classOnTemplateList.value  = response.data
                }       
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    

watch(
    () => reportSetupStore.classesAddedToReportTemplateListResponse,
    async (data) => {
      if(data){
      classOnTemplateList.value = data;
      }
    }
)

const clearClass = (classInfo) => {
  showClearClassModal.value = true
  classListData.value = classInfo
}


watch (
    () => reportSetupStore.removeClassFromReportTemplateResponse,
    async (data) => {
      if(data){
        showClearClassModal.value = false
        fetchTemplateClasses()
      }
    }
)


watch (
    () => reportSetupStore.classToReportTemplateResponse,
    async (data) => {
      if(data){
        fetchTemplateClasses()
      }
    }
)

const assignClass = () => {
  reportTemplateNumber.value = props.reportTemplateId
  showAssignModal.value = true
}




</script>

<template>
<div>

  <AppModal title="Assign Class To Template" v-model="showAssignModal" lg>
    <AssignTemplateToClass :addedClasses="classOnTemplateList" :reportTemplateNumber="reportTemplateNumber"></AssignTemplateToClass>
  </AppModal>

    <AppModal title="Confirm !" v-model="showClearClassModal" xs>
        <clearClassModal :classListData="classListData"></clearClassModal>
    </AppModal>


    <div>
        <div v-for="(listD,index) in classOnTemplateList" :key="index">

        <ul v-for="(classInfo, classIndex) in listD.classes" :key="classIndex">
          <li>
            <span>{{classIndex+1}}.</span>{{classInfo.class_name}}
            <i style="font-size: 13px;" class="bi-x cursor-pointer link-danger"  @click="clearClass(classInfo)"></i>
          </li>
        </ul>

      </div>
   </div>

  <div>
    <button
        style="border: 1px solid #2c2f8c;"
        class="mr-2 rounded-md px-3 text-[#2c2f8c] hover:bg-primary-100 text-xs"
        @click="assignClass()">
                 <span>
                   <i  class="bi-plus cursor-pointer"></i>
                   Add Class
                 </span>
    </button>
  </div>

</div>


</template>

<style>

</style>
