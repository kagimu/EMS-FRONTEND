<script setup>

import NewReportTemplate from "@/main/dashboard/manageLevel/report_setup/reportTemplate/NewReportTemplate.vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import AssignTemplateToClass from "@/main/dashboard/manageLevel/report_setup/reportTemplate/AssignTemplateToClass.vue";
import clearClassModal from "@/main/dashboard/manageLevel/report_setup/reportTemplate/clearClassModal.vue";

import {useRouter} from "vue-router";
import SchoolReportPreviewTemplate
  from "@/main/dashboard/manageLevel/report_setup/reportTemplate/SchoolReportPreviewTemplate.vue";




const routerData = useRouter()
const reportSetupStore = useReportSetupStore()
const reportTemplateList = ref(null)
const showReportTemplateModal = ref(false)
const showAssignModal = ref(false)
const reportTemplateNumber = ref(null)
const showClearClassModal = ref(false)
const reportTemplatePreviewModal = ref(false)
const classOnTemplateList = ref([])
let schoolNumber = routerData.currentRoute.value.query.id
const classListData = ref(null)

const reportTemplateName = ref(null)


const props = defineProps({
  schoolData:{}
})

onMounted(() => {
    filterReportTemplate()
    }
)

const filterReportTemplate = () =>{
reportSetupStore.fetchReportTemplate(schoolNumber)
}

watch(
    () => reportSetupStore.reportTemplateResponse,
    async (data) => {
      if(data){
        showReportTemplateModal.value = false
        filterReportTemplate()
      }
    }
)

watch(
    () => reportSetupStore.reportTemplateListResponse,
    async (data) => {
      if(data){
      reportTemplateList.value = data;
      }
    }
)

watch(
    () => reportSetupStore.classesAddedToReportTemplateListResponse,
    async (data) => {
      if(data){
      classOnTemplateList.value = data;
      }
    }
)


const addReportTemplate = () => {
  showReportTemplateModal.value = true
}

const previewTemplate = (report) => {
  if(report){
    reportTemplateName.value = report.name
    reportTemplatePreviewModal.value = true
  }
}

</script>

<template>

  <div>

    <AppModal :title="'Add Report Template for: '+schoolData?.name" v-model="showReportTemplateModal" lg>
      <new-report-template></new-report-template>
    </AppModal>
    
    <AppModal title="Assign Class To Template1" v-model="showAssignModal" lg>
        <AssignTemplateToClass :reportTemplateNumber="reportTemplateNumber"></AssignTemplateToClass>
    </AppModal>

    <AppModal title="Comfirm !" v-model="showClearClassModal" xs>
        <clearClassModal :classListData="classListData"></clearClassModal>
    </AppModal>

    <AppModal title="PreviewReport" v-model="reportTemplatePreviewModal" xl6>
      <school-report-preview-template :reportTemplateName="reportTemplateName"></school-report-preview-template>
    </AppModal>


    <div class="row">

      <div class="col-12">
        <div class="flex justify-content-between mt-3">
          <div class="ml-4">School Report Templates</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addReportTemplate">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Add Template
          </button>
        </div>




        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">#</th>
            <th>Name</th>
            <th>Preview Template</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(report,index) in reportTemplateList" :key="index">
            <td>{{ index+1 }}</td>
            <td>{{ report.name }}</td>
            <td>
              <button class="bg-green-700 text-white text-sm px-3 rounded-md" @click="previewTemplate(report)" type="button">
                Preview
              </button>
            </td>
            <td>
             <div>
                <i
                    style="font-size: 13px;"
                    class="bi-pencil mr-2 cursor-pointer "></i> &nbsp;
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"></i>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>

</template>

<style scoped>
.textSize{
  font-size: 13px;
}
</style>