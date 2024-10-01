<script setup>

import {onMounted, ref, watch} from "vue";

const props = defineProps({
  reportDetails:{},
  reportDataInfo:{}
})

const baseUrl = `${window.location.protocol}//${window.location.host}`;
const StudentImage =  baseUrl+"/src/assets/images/studentId.png";
const SchoolBadge = baseUrl+"/src/assets/images/victorius-budge.png";

const reportFilteredData = ref([])

onMounted(
    () => {
      filterReportData()
    }
)


watch(
    () => props.reportDetails,
    async (data) => {
      if(data){
        filterReportData()
      }
    }
)

const filterReportData = () => {
  let draft = props.reportDetails
  if(draft && draft?.learning_areas?.length > 0 ){
    let filterSubject = draft?.learning_areas
    let arr = []

    filterSubject.forEach(learningArea => {
      if(learningArea && learningArea?.assessments.length > 0){
        learningArea?.assessments?.forEach(subject => {
          arr.push(
              {
                subject:subject.name,
                report_scores:subject.report_scores,
                report_score_summary:subject.report_score_summary
              }
          )
        })
      }
    })

    reportFilteredData.value = arr
  }
}



const printableContent = ref(null);

// const printContent = () => {
//   const printContents = printableContent.value.innerHTML;
//   const originalContents = document.body.innerHTML;
//   const printWindow = window.open('', '', 'height=600,width=800');
//   printWindow.document.write('<html><head><title>Print</title>');
//   printWindow.document.write(
//     '<style>body { font-family: Arial, sans-serif; } </style>'); 
//   printWindow.document.write('</head><body>');
//   printWindow.document.write(printContents);
//   printWindow.document.write('</body></html>');
//   printWindow.document.close();
//   printWindow.print();
// }


</script>

<template>
<!-- {{reportDataInfo}} -->
<!-- {{ reportDetails.school.logo }} -->
<div ref="printableContent" class="printable">
  <table style="width: 100%;">
    <tr>
      <td style="text-align: center; width: 20%;">
        <div style="text-align: right; margin-top: 10px;">
          <img alt="logo" style="width: 130px; margin: 0 auto;" :src="reportDetails.school.logo"/>
        </div>
      </td>

      <td style="text-align: center;">
<!--        <div style="font-size: 35px; margin-bottom: 5px; color: #393f9f;">VICTORIOUS EDUCATION SERVICES</div>-->
        <div style="font-size: 30px; margin-bottom: 5px; color: #393f9f; text-transform: uppercase;">{{reportDetails?.school?.name}}</div>
        <div style="font-size: 20px; margin-top: 5px;color: #393f9f;text-transform: uppercase;">{{reportDetails?.campus?.name}}</div>
        <div style="color: #393f9f; margin-bottom: 10px;">DAY CARE . KINDERGARTEN . BOARDING AND PRIMARY SCHOOL</div>
<!--        <div style="font-size: 20px;">END OF TERM REPORT</div>-->
        <div style="font-size: 20px; text-transform: uppercase; color: #393f9f;">{{reportDetails?.study_period}} report</div>
      </td>
      <td style="width: 20%">&nbsp;</td>
    </tr>
  </table>

  <table style="width: 100%;">

    <tr>

      <td style="width: 10%">

      </td>

      <td style="width: 80%">
        <hr />
      </td>

      <td style="width: 10%">

      </td>

    </tr>
  </table>


  <table style="width: 100%;">

    <tr>

      <td style="width: 5%">

      </td>

      <td style="width: 90%; ">


        <table style="width: 100%;">

          <tr>
            <td style="width: 10%">
              <img alt="logo" style="width: 130px;" :src="reportDataInfo.photo"/>
            </td>

            <td style="width: 80%">


             <div style="padding-left: 50px;">
               <table style="width: 100%; font-size: 13px; margin-top: 30px; margin-bottom: 30px;">
                 <tr>
                   <td style="width: 15%;">
                     <div style="padding-left: 5px; padding-bottom: 10px;">Name:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">Class:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;"> Days Present:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">Sex:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">Age:</div>
                   </td>
                   <td style="width: 40%;">
                     <div style="padding-left: 5px; padding-bottom: 10px;"><span class="capitalize">{{reportDetails?.student?.surname}}</span> <span class="capitalize">{{reportDetails?.student?.second_name}}</span> <span class="capitalize">{{reportDetails?.student?.other_name}}</span></div>
                     <div style="padding-left: 5px; padding-bottom: 10px;"><span>{{reportDetails?.class_abbreviation}}</span></div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;"><span class="capitalize">{{reportDetails?.student?.gender}}</span></div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">6yrs , 8mth</div>
                   </td>
                   <td style="width: 15%;">
                     <div style="padding-left: 5px; padding-bottom: 10px;">Term:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">School Team:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">Days Absent:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">Date:</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                   </td>
                   <td style="width: 30%;">
                     <div style="padding-left: 5px; padding-bottom: 10px;">{{reportDetails?.study_period}}</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                     <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                   </td>
                 </tr>
               </table>
             </div>


            </td>

          </tr>
        </table>





        <table style="width: 100%; border: 1px solid #b8babb; font-size: 13px;">

          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="width: 30%; padding: 5px;">SUBJECT</td>
            <td style="width: 10%; padding: 5px;" v-for="(column,column_index) in reportDetails?.report_columns" :key="column_index"><div style="margin-left: 4px;">{{column}}</div></td>
            <td style="width: 10%;"><div style="margin-left: 4px;">Average</div></td>
            <td style="width: 5%;"><div style="margin-left: 4px;">Aggr</div></td>
            <td style="width: 25%;"><div style="margin-left: 4px;">Remark</div></td>
            <td style="width: 5%;"><div style="margin-left: 4px;">Initial</div></td>
          </tr>

          <tr style="border-bottom: 1px solid #b8babb;"  v-for="(subject,subject_index) in reportFilteredData" :key="subject_index">
            <td style="padding: 5px;">{{subject?.subject}}</td>
            <td style="padding: 5px;" v-for="(score,score_index) in subject?.report_scores" :key="score_index"><div style="margin-left: 4px;">{{score?.average_score}}</div></td>
            <td style="width: 10%; padding: 4px;"><div style="margin-left: 4px;">{{subject?.report_score_summary?.summation}}</div></td>
            <td style="width: 5%; padding: 4px;"><div style="margin-left: 4px;">{{subject?.report_score_summary?.grade}}</div></td>
            <td style="width: 25%; padding: 4px;"><div style="margin-left: 4px;">{{subject?.report_score_summary?.comment}}</div></td>
            <td style="width: 5%; padding: 4px; border-right: 1px solid #eef0f2;"><div style="margin-left: 4px;">M.O</div></td>
          </tr>


          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="padding: 5px;">TOTAL/AGGREGATE</td>
            <td style="padding: 5px;">-</td>
            <td style="padding: 5px;">-</td>
            <td style="padding: 5px;">-</td>
            <td style="padding: 5px;">-</td>
            <td style="padding: 5px;" colspan="3" rowspan="2">&nbsp;</td>
          </tr>

          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="padding: 5px; ">DIVISION</td>
            <td style="padding: 5px; text-align: center;" colspan="2">DIVISION1 </td>
            <td style="padding: 5px; text-align: center;" colspan="2">DIVISION 1</td>
          </tr>

        </table>





        <table style="width: 100%; border: 1px solid #b8babb; font-size: 13px; margin-top: 10px;">

          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="width: 28%; padding: 5px;" rowspan="2">GRADING</td>
            <td style="width: 8%; padding: 5px; text-align: center;" v-for="(scale,idx) in reportDetails?.aggregate_scale" :key="idx">{{scale?.short_name}}</td>
<!--            <td style="width: 8%; padding: 5px; text-align: center;">D2</td>-->
<!--            <td style="width: 8%; padding: 5px; text-align: center;">C3</td>-->
<!--            <td style="width: 8%; padding: 5px; text-align: center;">C4</td>-->
<!--            <td style="width: 8%; padding: 5px; text-align: center;">C5</td>-->
<!--            <td style="width: 8%; padding: 5px; text-align: center;">C6</td>-->
<!--            <td style="width: 8%; padding: 5px; text-align: center;">P7</td>-->
<!--            <td style="width: 8%; padding: 5px; text-align: center;">P8</td>-->
<!--            <td style="width: 8%; padding: 5px; text-align: center;">F9</td>-->
          </tr>
          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="width: 8%; padding: 5px; text-align: center;" v-for="(scale,idx) in reportDetails?.aggregate_scale" :key="idx">{{scale?.min+" - "+scale?.max}}</td>
<!--            <td style="width: 8%; padding: 5px; text-align: center;">95-100</td>
            <td style="width: 8%; padding: 5px; text-align: center;">80-94</td>
            <td style="width: 8%; padding: 5px; text-align: center;">70-9</td>
            <td style="width: 8%; padding: 5px; text-align: center;">65-69</td>
            <td style="width: 8%; padding: 5px; text-align: center;">60-64</td>
            <td style="width: 8%; padding: 5px; text-align: center;">55-59</td>
            <td style="width: 8%; padding: 5px; text-align: center;">50-54</td>
            <td style="width: 8%; padding: 5px; text-align: center;">40-49</td>
            <td style="width: 8%; padding: 5px; text-align: center;">0-39</td>-->
          </tr>

        </table>




        <table style="width: 100%; font-size: 13px; margin-top: 20px;">
          <tr>
            <td style="width: 20%; padding: 5px;">Class Teacher's Remarks:</td>
            <td style="padding: 5px; text-align: center;">{{reportDetails?.teacher_comment ?? ""}}</td>
          </tr>
          <tr>
            <td style="width: 20%; padding: 5px;"></td>
            <td style="padding: 5px; text-align: center;">Signature _____________________________________________</td>
          </tr>
        </table>


        <table style="width: 100%; font-size: 13px; margin-top: 20px;">
          <tr>
            <td style="width: 20%; padding: 5px;">Head Teacher's Remarks:</td>
            <td style="padding: 5px; text-align: center;">{{reportDetails?.head_teachers_comment ?? ""}}</td>
          </tr>
          <tr>
            <td style="width: 20%; padding: 5px;"></td>
            <td style="padding: 5px; text-align: center;">Signature _____________________________________________</td>
          </tr>
        </table>


        <table style="width: 100%; font-size: 13px; margin-top: 20px;">
          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="width: 30%; padding: 5px;"><b>Promotion Status</b></td>
            <td style="padding: 5px; text-align: center;"></td>
          </tr>
          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="padding: 5px;">Next Term Begins on</td>
            <td style="padding: 5px;">
              Monday, May 27, 2024
            </td>
          </tr>

        </table>


        <table style="width: 100%; font-size: 13px; margin-top: 5px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #b8babb;">
            <td style="text-align: center; color: #393f9f; font-size: 14px;">
             <div> THIS REPORT IS NOT VALID WITHOUT THE HEADTEACHER'S STAMP AND SIGNATURE</div>
             <div> <b>GOD IS ABLE</b></div>
            </td>
          </tr>
        </table>





      </td>

      <td style="width: 5%">

      </td>

    </tr>
  </table>




</div>
</template>


<style scoped>

.printable {
  padding: 0px;
  /* border: 1px solid #2e0404;? */
  margin-top: 0px;
}

img {
  display: block;
  margin-top: 20px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.capitalize{
  text-transform: capitalize !important;
}
</style>