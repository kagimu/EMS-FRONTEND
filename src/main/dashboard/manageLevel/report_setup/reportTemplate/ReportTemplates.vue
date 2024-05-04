<script setup>

import NewReportTemplate from "@/main/dashboard/manageLevel/report_setup/reportTemplate/NewReportTemplate.vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import AssignTemplateToClass from "@/main/dashboard/manageLevel/report_setup/reportTemplate/AssignTemplateToClass.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const schoolStore = useSchoolStore()
const schoolList = ref([])
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const reportTemplateList = ref(null)
const showReportTemplateModal = ref(false)
const showAssignModal = ref(false)
const school_number = ref(false)
onMounted(() => {
    reportSetupStore.fetchReportTemplate()
    schoolStore.fetchSchools()
    }
)

const filterReportTemplate = (schoolNumber) =>{
alert(schoolNumber)
reportSetupStore.fetchReportTemplate()
}

watch(
    () => reportSetupStore.reportTemplateListResponse,
    async (data) => {
      if(data){
       reportTemplateList.value = data.data
       //get classes added to report Template 

      }
    }
)

const addReportTemplate = () => {
  showReportTemplateModal.value = true
}

const assignClass = () => {
  showAssignModal.value = true
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

</script>

<template>

  <div>

    <AppModal title="Add Report Template" v-model="showReportTemplateModal" lg>
      <new-report-template></new-report-template>
    </AppModal>
    
    <AppModal title="Assign Class To Template1" v-model="showAssignModal" lg>
        <AssignTemplateToClass></AssignTemplateToClass>
    </AppModal>



    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Report Template</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addReportTemplate">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
              Add Template
          </button>
        </div>



        <div class="row">
            <div class="col-lg-6">
                <div class="mb-2">
            <label class="textSize"><small>School</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="school_number"
                    @change="filterReportTemplate(school_number)"
            >
                <option disabled value="">Select School</option>
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
                    class="bi-plus-circle cursor-pointer link-primary" @click="assignClass"></i></b>   
                    <li>Primary One [P1]<i
                    style="font-size: 13px;" class="bi-x cursor-pointer link-danger"></i> </li>
                    <li>Primary Two [P2] <i
                    style="font-size: 13px;" class="bi-x cursor-pointer link-danger"></i></li>
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
          <tr>
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
          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>

</template>

<style scoped>

</style>