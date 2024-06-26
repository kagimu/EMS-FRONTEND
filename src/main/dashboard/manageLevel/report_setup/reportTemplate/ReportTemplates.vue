<script setup>

import NewReportTemplate from "@/main/dashboard/manageLevel/report_setup/reportTemplate/NewReportTemplate.vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import AssignTemplateToClass from "@/main/dashboard/manageLevel/report_setup/reportTemplate/AssignTemplateToClass.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import clearClassModal from "@/main/dashboard/manageLevel/report_setup/reportTemplate/clearClassModal.vue";
import ReportTemplateClasses from "./ReportTemplateClasses.vue";
import {useRouter} from "vue-router";

const routerData = useRouter()
const schoolStore = useSchoolStore()
const schoolList = ref([])
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const reportTemplateList = ref(null)
const showReportTemplateModal = ref(false)
const showAssignModal = ref(false)
const school_number = ref(false)
const reportTemplateNumber = ref(null)
const showClearClassModal = ref(false)
const classOnTemplateList = ref([])
const repoId = ref(null)
const classListData = ref(null)
const schoolNumber = routerData.currentRoute.value.query.sch
const reportTemplateDataInfo = ref([])
const reportName = ref(null)
const editMode = ref(false)

onMounted(() => {
  filterReportTemplate()
    }
)

const filterReportTemplate = () =>{
reportSetupStore.fetchReportTemplate(schoolNumber)
}

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
  reportTemplateDataInfo.value = ""
  editMode.value = false
  showReportTemplateModal.value = true
}

const editReportTemplate = (repoData,name) => {
  reportTemplateDataInfo.value = repoData
  editMode.value = true
  reportName.value = name
  showReportTemplateModal.value = true
}

const assignClass = (repId) => {
  // alert(repId)
  reportTemplateNumber.value = repId
  showAssignModal.value = true
}

const clearClass = (classInfo) => {
  showClearClassModal.value = true
  classListData.value = classInfo
}


const showClasses = (TemplateN) =>{
reportSetupStore.fetchClassesAddedReportTemplate(TemplateN,schoolNumber)
repoId.value = TemplateN
}


watch (
  () => reportSetupStore.reportTemplateResponse,
  async (data) => {
    if(data){
      showReportTemplateModal.value = false
      reportSetupStore.fetchReportTemplate()
    }
  },
  {deep:true}
)

const deleteThisData = (id,name) => {
  if(!confirm("Are you sure, you want to delete: " + name)){
    return
  }else{

  }

}

</script>

<template>

  <div>

    <AppModal :title="editMode ?'Edit Report Template ' +reportName :'Add Report Template'" v-model="showReportTemplateModal" lg>
      <new-report-template :reportTemplateDataInfo="reportTemplateDataInfo"></new-report-template>
    </AppModal>
    
    <AppModal title="Assign Class To Template" v-model="showAssignModal" lg>
        <AssignTemplateToClass :reportTemplateNumber="reportTemplateNumber"></AssignTemplateToClass>
    </AppModal>

    <AppModal title="Comfirm !" v-model="showClearClassModal" xs>
        <clearClassModal :classListData="classListData"></clearClassModal>
    </AppModal>


    <div class="row">

      <div class="col-12">
        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Add Class to Report Template</div>
        </div>


        <div class="flex justify-content-between mt-3">
          <div class="ml-4"></div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addReportTemplate">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Add Report Column
          </button>
        </div>

        <table class="table table-hover caption-top mt-5 table-sm text-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th class="w-[10%]" scope="col">#</th>
            <th>Name</th>
            <th>Assigned Class</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(repoData,index) in reportTemplateList" :key="index">
            <td>{{ index+1 }}</td>
            <td>{{ repoData.name }}</td>
            <td>
                <ol>
                    <b><i
                    style="font-size: 10px;"
                    class="bi-plus-circle cursor-pointer link-primary" @click="assignClass(repoData.report_template_id)"></i></b> 
           
                      <ReportTemplateClasses :reportTemplateId="repoData.report_template_id"  :school_number="schoolNumber"></ReportTemplateClasses>


                </ol>
                
            </td>
            <td>
             <div>
                <i
                    style="font-size: 13px;"
                    class="bi-pencil mr-2 cursor-pointer " @click="editReportTemplate(repoData,repoData.name)"></i> &nbsp;
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer" @click="deleteThisData(repoData.number,repoData.name)"></i>
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