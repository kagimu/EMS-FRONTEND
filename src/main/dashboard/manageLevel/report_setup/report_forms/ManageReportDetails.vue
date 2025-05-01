<script setup>

import {ref, watch,reactive} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import BabyClassReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/BabyClassReport.vue";
import PrimaryReportCopy from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/PrimaryReportCopy.vue";
import TopClassReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/TopClassReport.vue";
import VictoriousReportCard
  from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/victorious/VictoriousReportCard.vue";
import {usePrintStore} from "@/main/dashboard/print/print.js";
import AppModal from "@/components/AppModal.vue";
import NewClassTeacherOverallRemark
  from "@/main/dashboard/manageLevel/report_setup/comments/NewClassTeacherOverallRemark.vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";

const reportStore = useReportCardStore()
const printStore = usePrintStore()
const notificationStore = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()



const reportDetails = ref(null)
const showOverAllMarksModal = ref(false)


const props = defineProps({
  reportData:{}
})


watch(
    () => reportStore.reportDetailsResponse,
    async (data) => {
      if(data){
         reportDetails.value = data.data
      }
    }
)

const myDiv = ref(null)

const print = () => {
  let htmlContent = myDiv.value.innerHTML;
  
  let data  = {
   html: htmlContent.replace(/<!--v-if-->/g, '')
  }

  printStore.printReport(data)
}

const addRemarks = () => {
  showOverAllMarksModal.value = true
  /*let data = {
    report_template_name: reportDetails.value.report_template_name,
    student_number: props.reportData.student_number,
    class_teacher_remarks: props.reportData.class_teacher_remarks
  }
  printStore.addClassTeacherRemarks(data)*/
}

watch(
    () => printStore.printResponse,
    async (data) => {
      if(data){
        let base64Response = "data:application/pdf;base64,"+ data.message
        previewPdf(base64Response)
      }
    }
)

function previewPdf(base64Response) {

if(navigator.userAgent.indexOf("Firefox") !== -1 ) {
  
    window.open(base64Response, '_target')

} else {
    let a = document.createElement("a");
    a.href = base64Response;
    a.setAttribute('download', fileName)
    a.target = "_blank";
    document.body.appendChild(a)
    a.click();
}
}

watch(
    () => printStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error", data.message)
      }
    }
)

watch(
    () => reportStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error", data.message)
      }
    }
)

watch(
    () => teacherCommentStore.newOverallRemarkFromTeacherResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        showOverAllMarksModal.value = false
      }
    }
)

</script>

<template>

<div>

  <AppModal title="Add Class Teacher's Overall Remarks" v-model="showOverAllMarksModal" xl8>
    <new-class-teacher-overall-remark :reportDataInfo="reportData" :reportDetails="reportDetails"></new-class-teacher-overall-remark>
  </AppModal>


  <button class="btn btn-sm btn-success mb-2" @click="print"><i class="bi bi-printer"></i></button>

  <button
      v-if="
      (reportDetails?.report_template_name.trim() === 'wholesome-early-learning-report-baby-class') ||
      (reportDetails?.report_template_name.trim() === 'wholesome-report-primary')"
      class="btn btn-sm btn-primary mb-2 ml-3" @click="addRemarks">
        <i class="bi bi-pencil"></i>
        Add Class Teacher's Overall Remarks
  </button>

  <div ref="myDiv">

  <div v-if="reportDetails?.report_template_name.trim() === 'wholesome-early-learning-report-baby-class'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <baby-class-report :reportDataInfo="reportData" :reportDetails="reportDetails"></baby-class-report>
    <br />
  </div>


  <div v-if="reportDetails?.report_template_name.trim() === 'wholesome-early-learning-report-top-class'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <top-class-report :reportDataInfo="reportData" :reportDetails="reportDetails"></top-class-report>
    <br />
  </div>

  <div v-if="reportDetails?.report_template_name.trim() === 'wholesome-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <primary-report-copy :reportDataInfo="reportData" :reportDetails="reportDetails"></primary-report-copy>
  </div>

  <div v-if="reportDetails?.report_template_name.trim() === 'victorious-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <victorious-report-card :reportDetails="reportDetails" :reportDataInfo="reportData"></victorious-report-card>
  </div>
</div>
</div>
</template>

<style scoped>

</style>