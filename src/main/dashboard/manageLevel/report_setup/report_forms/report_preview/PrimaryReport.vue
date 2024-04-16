<script setup>

import Badge from "@/assets/images/badge.png";
import StudentImage from "@/assets/images/pic.jpg";

const printReport = () => {
  alert("Print pdf now man")
}

const props = defineProps({
  reportDetails:{}
})


</script>

<template>
  <div>
    <div class="mx-auto mt-10" style="width: 98%">

      <div class="mt-4 mb-2 flex justify-content-between">
        &nbsp;
        <button type="button" @click="printReport" class="btn btn-primary btn-sm mr-3" style="border-radius: 0;">
          <i class="bi-printer"></i>
          Print Report
        </button>
      </div>

        <table style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px;">
        <tr>
          <td>



            <table style="width: 100%;">
              <tr>
                <td style="width: 20%; text-align: center;">
                  <img alt="logo" style="width: 150px; margin: 0 auto" :src="Badge"/>
                </td>
                <td style="width: 60%;" class="text-center">
                  <!--        <div style="font-size: 30px;"><b>NOREGRETS LIFE SCHOOL</b></div>-->
                  <div style="font-size: 30px;" class="uppercase"><b>{{reportDetails?.school?.name}}</b></div>

                  <!--        <div style="font-size: 20px; margin-top: 5px;">BUNAMWAYA CAMPUS</div>-->
                  <div style="font-size: 20px; margin-top: 5px;" class="uppercase">{{reportDetails?.campus?.name}}</div>

                  <div style="margin-top: 6px; margin-bottom: 10px;">
                    <small>
                      {{reportDetails?.campus?.location}} |
                      {{reportDetails?.campus?.phone}} |
                      {{reportDetails?.campus?.email}}
                      <!--            Bunamwaya, P.O.BOX 21671 Kampala | +256752698545 | mwesigwa.noregrets@gmail.com-->
                    </small></div>

                  <div style="background-color: green; color: #ffffff;">PROGRESS REPORT FOR KINDERGARTEN</div>
                </td>
                <td style="width: 20%;">
                  <div style="text-align: center; margin-top: 10px;">
                    <img alt="logo" style="width: 130px; margin: 0 auto;" :src="StudentImage"/>
                  </div>
                </td>
              </tr>
            </table>


          </td>
        </tr>
        <tr>
          <td>


            <table style="width: 100%; font-size: 13px; margin-top: 30px; margin-bottom: 30px;">
              <tr>
                <td style="width: 15%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;">Name:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Class:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"> Days Present:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Sex:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Age:</div>
                </td>
                <td style="width: 40%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span class="capitalize">{{reportDetails?.student?.surname}}</span> <span class="capitalize">{{reportDetails?.student?.second_name}}</span> <span class="capitalize">{{reportDetails?.student?.other_name}}</span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span>{{reportDetails?.class_abbreviation}}</span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">&nbsp;</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span class="capitalize">{{reportDetails?.student?.gender}}</span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">6yrs , 8mth</div>
                </td>
                <td style="width: 15%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;">Term:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">School Team:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Days Absent:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Date:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">&nbsp;</div>
                </td>
                <td style="width: 30%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;">{{reportDetails?.study_period}}</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">&nbsp;</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">&nbsp;</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">&nbsp;</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">&nbsp;</div>
                </td>
              </tr>
            </table>


          </td>
        </tr>





        <tr>
          <td>

            <table class="w-full text-[13px]" style="border: 1px solid #eef0f2" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width: 10%; border-right: 1px solid #eef0f2">&nbsp;</td>
                <td style="width: 30%; border-right: 1px solid #eef0f2; padding: 4px;"><div style="margin-left: 4px;">SUBJECT UNIT</div></td>
                <td style="width: 5%; border-right: 1px solid #eef0f2;" v-for="(column,column_index) in reportDetails?.report_columns" :key="column_index"><div style="margin-left: 4px;">{{column}}</div></td>
                <td style="width: 5%; border-right: 1px solid #eef0f2;"><div style="margin-left: 4px;">Average</div></td>
                <td style="width: 5%; border-right: 1px solid #eef0f2;"><div style="margin-left: 4px;">Aggr</div></td>
                <td style="width: 25%; border-right: 1px solid #eef0f2;"><div style="margin-left: 4px;">Remark</div></td>
                <td style="width: 5%; border-right: 1px solid #eef0f2;"><div style="margin-left: 4px;">Initial</div></td>
              </tr>

              <tr v-for="(learning_area,learning_area_index) in reportDetails?.learning_areas" :key="learning_area_index">
                <td
                    class="border-r border-t"
                    :rowspan="learning_area?.assessments.length"
                    style="
                    padding: 5px;
                    width: 10%;"
                >
                  <div
                      style="
                      margin-bottom: 15px;
                      transform: rotate(270deg);
                      white-space: nowrap;
                      font-size: 12px;"
                  >
                {{learning_area.name}}
                  </div>

                </td>

                <td :colspan="(5 + Number(reportDetails?.report_columns.length))">
                  <table cellspacing="0" cellpadding="0" style="width: 100%; font-size: 13px; border-top: 1px solid #eef0f2;">
                  <tr v-for="(assessment,assessment_index) in learning_area?.assessments" :key="assessment_index" style="border-bottom: 1px solid #f4f4f4;">
                    <td style="width: 30%; padding: 4px; border-right: 1px solid #eef0f2;"><div style="margin-left: 4px;">{{assessment.name}}</div></td>
                    <td style="width: 5%; padding: 4px; border-right: 1px solid #eef0f2;" v-for="(report_score,report_score_index) in assessment.report_scores" :key="report_score_index">
                      {{report_score.score >= 0 ? report_score.score : '-'}}
                    </td>
                    <td style="width: 5%; padding: 4px; border-right: 1px solid #eef0f2;">{{assessment.report_score_summary.summation}}</td>
                    <td style="width: 5%; padding: 4px; border-right: 1px solid #eef0f2;">{{assessment.report_score_summary.grade}}</td>
                    <td style="width: 25%; padding: 4px; border-right: 1px solid #eef0f2;">{{assessment.report_score_summary.comment}}</td>
                    <td style="width: 5%; padding: 4px; border-right: 1px solid #eef0f2;">M.O</td>
                  </tr>

                  </table>

                </td>
              </tr>


            </table>

<!--            <table  v-for="(lst,idx) in reportDetails?.learning_areas" :key="idx" class="w-full text-[13px] border">
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td class="w-[10%] bg-amber-200" rowspan="4" style="transform: rotate(270deg); white-space: nowrap;"> <small>{{lst.name}}</small></td>
                <td class="p-[5px]">
                 <table class="w-full">
                   <tr v-for="(list,idx) in lst?.assessments" :key="idx">
                     <td class="p-[5px] w-[10%]" style="padding: 5px;">
                       {{list.name}}
                     </td>
                     <td class="p-[5px] w-[10%]" v-for="(report_score,idx) in list?.report_scores" :key="idx" style="padding: 5px;">50</td>
                     <td class="p-[5px] w-[10%]">{{list.report_score_summary.summation}} &lt;!&ndash;aggregate&ndash;&gt;</td>
                     <td class="p-[5px] w-[10%]">{{list.report_score_summary.comment}} &lt;!&ndash;remarks&ndash;&gt;</td>
                     <td class="p-[5px] w-[10%]">M.O &lt;!&ndash;remarks&ndash;&gt;</td>
                   </tr>
                 </table>
                </td>

              </tr>
            </table>-->






<!--            <table  v-for="(lst,idx) in reportDetails?.learning_areas" :key="idx" class="w-full text-[13px] border">
&lt;!&ndash;              transform rotate-270 whitespace-nowrap&ndash;&gt;
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td class="w-[10%] bg-amber-200" style="transform: rotate(270deg); white-space: nowrap;">
                  <small>{{lst.name}} </small>
                </td>
                <td class="p-[5px] bg-blue-400 h-[40]">
                  <div v-for="(list,idx) in lst?.assessments" :key="idx">
                    {{list.name}}
                  </div>
                </td>
&lt;!&ndash;                <td style="padding: 5px;">50</td>&ndash;&gt;
&lt;!&ndash;                <td style="padding: 5px;">50</td>&ndash;&gt;
&lt;!&ndash;                <td style="padding: 5px;">89</td>&ndash;&gt;
&lt;!&ndash;                <td style="padding: 5px;">80</td>&ndash;&gt;
&lt;!&ndash;                <td style="padding: 5px;">D1</td>&ndash;&gt;
&lt;!&ndash;                <td style="padding: 5px;">Good</td>&ndash;&gt;
&lt;!&ndash;                <td style="padding: 5px;">M.O</td>&ndash;&gt;
              </tr>

            </table>-->




<!--            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">

              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 10%; padding: 5px;">&nbsp;</td>
                <td style="width: 20%; padding: 5px;">SUBJECT UNIT</td>
                <td style="width: 10%; padding: 5px;">ROC</td>
                <td style="width: 10%; padding: 5px;">End of Term</td>
                <td style="width: 10%; padding: 5px;">Quarter Term</td>
                <td style="width: 10%; padding: 5px;">Average</td>
                <td style="width: 10%; padding: 5px;">Aggr</td>
                <td style="width: 10%; padding: 5px;">Remark</td>
                <td style="width: 10%; padding: 5px;">Initial</td>
              </tr>

              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td rowspan="4" style="transform: rotate(270deg); white-space: nowrap;"> <small>MENTAL STUDIES </small></td>
                <td style="padding: 5px;">
                  Mathematics
                </td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>

              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Language</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>


              <tr style="border-bottom: 1px solid #f4f4f4;">

                <td style="padding: 5px;">History</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Geography</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>


              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td rowspan="5" style="transform: rotate(270deg); white-space: nowrap;"> <small> PHYSICAL STUDIES</small></td>
                <td style="padding: 5px;">Science</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>


              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Games and Athletics</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Celebrate: Performing Arts</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Art and Design</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Creative Work and Resources</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>


              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td rowspan="5" style="transform: rotate(270deg); white-space: nowrap;"> <small> RELIGIOUS STUDIES </small></td>
                <td style="padding: 5px;">Praise and Worship</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>

              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Prayer</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">God's Purpose and Plan</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Divinity and Religion</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Bible Study and Reasoning</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>

              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td rowspan="5" style="transform: rotate(270deg); white-space: nowrap;"> <small>SOCIAL STUDIES</small></td>
                <td style="padding: 5px;">Personal Discipline</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>

              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Character Formation</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Law and Government</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Service and Enterprise</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Family and Community</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">50</td>
                <td style="padding: 5px;">89</td>
                <td style="padding: 5px;">80</td>
                <td style="padding: 5px;">D1</td>
                <td style="padding: 5px;">Good</td>
                <td style="padding: 5px;">M.O</td>
              </tr>

            </table>-->


          </td>
        </tr>

        <tr>
          <td>

            <div style="background-color: green; color: #ffffff; text-align: center; margin-top: 16px; margin-bottom: 16px;">
              CLASS TEACHER'S OVERALL REMARKS:
            </div>

          </td>
        </tr>


        <tr>
          <td>

            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px; margin-bottom: 20px;">
              <tr style="text-align: center; border-bottom: 1px solid #f4f4f4;">
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON MENTAL STUDIES</td>
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON PHYSICAL STUDIES</td>
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON RELIGIOUS STUDIES</td>
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON SOCIAL STUDIES</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px; border-right: 1px solid #f4f4f4;">&nbsp;</td>
                <td style="padding: 5px; border-right: 1px solid #f4f4f4;">great work done</td>
                <td style="padding: 5px; border-right: 1px solid #f4f4f4;">&nbsp;</td>
                <td style="padding: 5px;">&nbsp;</td>
              </tr>
            </table>

          </td>
        </tr>


        <tr>
          <td>

            <table style="width: 100%; font-size: 13px; margin-top: 20px; margin-bottom: 30px;">
              <tr>
                <td style="width: 25%;">
                  <div style="padding-left: 5px; padding-bottom: 10px;">CLASS TEACHER'S SIGNATURE:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">HEAD TEACHER'S SIGNATURE:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">NEXT TERM BEGINS:</div>
                </td>

                <td>

                  <div style="padding-left: 5px; padding-bottom: 10px;"> ________________________________________________________________</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;"> ________________________________________________________________</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;"> 18th/May/2020</div>

                </td>
              </tr>
            </table>

          </td>
        </tr>

        <tr>
          <td>
            <div style="text-align: center; margin-bottom: 15px;">
              <small><i>This report is valid if it bears the Head Teacher's Signature and school seal.</i></small>
            </div>
          </td>
        </tr>


      </table>



    </div>


  </div>
</template>



<style scoped>

</style>