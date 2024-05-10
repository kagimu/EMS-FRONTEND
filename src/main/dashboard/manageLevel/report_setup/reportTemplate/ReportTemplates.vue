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
const schoolNo = ref(null)
const repoId = ref(null)
const classListData = ref(null)

onMounted(() => {
    schoolStore.fetchSchools()
    }
)

const filterReportTemplate = (schoolNumber) =>{
reportSetupStore.fetchReportTemplate(schoolNumber)
schoolNo.value = schoolNumber
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

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)


const showClasses = (TemplateN) =>{
reportSetupStore.fetchClassesAddedReportTemplate(TemplateN,schoolNo.value)
repoId.value = TemplateN
}
</script>

<template>

  <div>

    <AppModal title="Add Report Template" v-model="showReportTemplateModal" lg>
      <new-report-template></new-report-template>
    </AppModal>
    
    <AppModal title="Assign Class To Template1" v-model="showAssignModal" lg>
        <AssignTemplateToClass :reportTemplateNumber="reportTemplateNumber"></AssignTemplateToClass>
    </AppModal>

    <AppModal title="Comfirm !" v-model="showClearClassModal" xs>
        <clearClassModal :classListData="classListData"></clearClassModal>
    </AppModal>


    <div class="row">

      <div class="col-12">
        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Report Template</div>
<!--          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addReportTemplate">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Add Template
          </button>-->
        </div>



        <div class="row ml-5 mx-auto mb-4">
            <div class="col-lg-6">
                <div class="mb-2">
            <label class="textSize"><small>School</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="school_number"
                    @change="filterReportTemplate(school_number)"
            >
                <option disabled value="">Filter By School</option>
                <option value="">All</option>
                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>
            </div>
            <div class="col-lg-6">

            </div>

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
           
                <ReportTemplateClasses :reportTemplateId="repoData.report_template_id"  :school_number="schoolNo"></ReportTemplateClasses>

                    
                </ol>
                
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
          <!-- <tr>
            <td>1</td>
            <td>Template Name2</td>
            <td>
                <ol>
                    <b><i
                    style="font-size: 10px;"
                    class="bi-plus-circle cursor-pointer link-primary" @click="assignClass"></i></b>   
                    <li>Primary Seven [P7]<i
                    style="font-size: 13px;" class="bi-x cursor-pointer link-danger"></i> </li>
                
                </ol>
                
            </td>
            <td>
             <div>
                <i
                    style="font-size: 13px;"
                    data-bs-toggle="modal" data-bs-target="#levelModal"
                    class="bi-pencil mr-2 cursor-pointer"></i> &nbsp;
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"></i>
              </div>
            </td>
          </tr> -->
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