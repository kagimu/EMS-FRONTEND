<script setup>

import {ref, watch,reactive} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
import BabyClassReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/BabyClassReport.vue";
import PrimaryReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/PrimaryReport.vue";
import TopClassReport from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/TopClassReport.vue";
import VictoriousReportCard
  from "@/main/dashboard/manageLevel/report_setup/report_forms/report_preview/victorious/VictoriousReportCard.vue";
import {usePrintStore} from "@/main/dashboard/print/print.js";
import ReportSummary from "./ReportSummary.vue";
const reportStore = useReportCardStore()
const printStore = usePrintStore()

const reportDetails = ref(null)


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


</script>

<template>

<div>


  <button class="btn btn-success mb-2 " @click="print"><i class="bi bi-printer"></i></button>
<div ref="myDiv">

  <div v-if="reportDetails?.report_template_name.trim() === 'wholesome-early-learning-report-baby-class'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <baby-class-report :reportDataInfo="reportData" :reportDetails="reportDetails"></baby-class-report>
    <br />
  </div>


  <div v-if="reportDetails?.report_template_name.trim() === 'wholesome-early-learning-report-top-class'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <top-class-report></top-class-report>
    <br />
  </div>

  <div v-if="reportDetails?.report_template_name.trim() === 'wholesome-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <primary-report :reportDataInfo="reportData" :reportDetails="reportDetails"></primary-report>
  </div>

  <div v-if="reportDetails?.report_template_name.trim() === 'victorious-report-primary'" class="mb-4 border-r border-l border-t border-b border-[#1062da]">
    <victorious-report-card :reportDetails="reportDetails" :reportDataInfo="reportData"></victorious-report-card>
  </div>
</div>
</div>
</template>

<style scoped>

</style>