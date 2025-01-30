<script setup>

import useCommonsStore from "@/composables/useCommons.js";
import api from "@/config/api.js";

const commons = useCommonsStore()
let imagePath = api.defaults.baseURL + "/attachments/download/"

const props = defineProps({
  reportDetails:{},
  reportDataInfo:{}
})


</script>


<template>
  <div>
    <div class="mx-auto mt-10" style="width: 98%">
      <table style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px;">
        <tr>
          <td>

            <table style="width: 100%; text-align: center;">
              <tr>
                <td style="width: 20%; text-align: center;">
                  <img alt="img" style="width: 130px; margin: 0 auto;" :src="reportDetails?.school?.logo"/>
                </td>
                <td style="width: 60%;" class="text-center">
                  <!--        <div style="font-size: 30px;"><b>NOREGRETS LIFE SCHOOL</b></div>-->
                  <div style="font-size: 30px; text-transform: uppercase;text-align: center;"><b>{{reportDetails?.school?.name}}</b></div>

                  <!--        <div style="font-size: 20px; margin-top: 5px;">BUNAMWAYA CAMPUS</div>-->
                  <div style="font-size: 20px; margin-top: 5px;text-transform: uppercase;">{{reportDetails?.campus?.name}}</div>

                  <div style="margin-top: 6px; margin-bottom: 10px;">
                    <small>
                      {{reportDetails?.campus?.location}} |
                      {{reportDetails?.campus?.phone}} |
                      {{reportDetails?.campus?.email}}
                      <!--            Bunamwaya, P.O.BOX 21671 Kampala | +256752698545 | mwesigwa.noregrets@gmail.com-->
                    </small></div>

                  <!--                  <div style="background-color: green; color: #ffffff;">PROGRESS REPORT FOR KINDERGARTEN</div>-->
                  <div style="background-color: green; color: #ffffff; text-transform: uppercase; text-align: center;">PROGRESS REPORT FOR {{reportDetails?.level_name}}</div>
                </td>
                <td style="width: 20%;">
                  <div style="text-align: center; margin-top: 10px;padding-left:20px">
                    <!--                    <img alt="logo" style="width: 130px; margin: 0 auto;" :src="StudentImage"/>-->
                    <img alt="img" style="width: 130px;" :src="reportDataInfo?.photo"/>
                  </div>
                </td>
              </tr>
            </table>

          </td>
        </tr>
        <tr>
          <td>

            <table style="width: 100%; font-size: 13px; margin-top: 30px; margin-bottom: 30px; color: #45484c;">
              <tr>
                <td style="width: 15%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;">Name:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Class:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Sex:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Age:</div>
                </td>
                <td style="width: 40%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span class="capitalize">{{reportDetails?.student?.surname}}</span> <span class="capitalize">{{reportDetails?.student?.second_name}}</span> <span class="capitalize">{{reportDetails?.student?.other_name}}</span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span>{{reportDetails?.class_abbreviation}}<span v-if="reportDetails?.stream">, {{reportDetails?.stream}}</span></span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span class="capitalize">{{reportDetails?.student?.gender}}</span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><!--6yrs , 8mth-->{{commons.ageCalculator(reportDetails?.student?.date_of_birth)}}</div>
                </td>
                <td style="width: 15%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;">Term:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Stream:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Date:</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">Grade</div>
                </td>
                <td style="width: 30%;">
                  <div style="padding-left: 60px; padding-bottom: 10px;">{{reportDetails?.study_period}}</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">{{reportDetails?.stream	}}</div>
                  <div style="padding-left: 60px; padding-bottom: 10px;">{{new Date().toLocaleDateString()}}</div>
                  <div style="padding-left: 60px; padding-bottom: 10px; color:#008000;">{{reportDetails?.grade}}</div>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <tr>
          <td>


            <table style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px; font-size: 13px;">
              <tr>
                <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">KEY TO SCORES:</td>
                <td
                    v-for="(scale,idx) in reportDetails?.aggregate_scale" :key="idx"
                    style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;"
                >
                <div style="display: flex; flex-grow: 1; justify-content: space-between;">
                  <div style="text-transform: uppercase; margin-top: 10px;">{{scale?.name}}</div>
                  <div>
                    <img
                        v-if="scale?.illustration"
                        alt="img"
                        style="width: 40px;"
                        :src="imagePath+scale?.illustration"/>
                  </div>
                </div>
                </td>
<!--                <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">GOOD</td>-->
<!--                <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">FAIR</td>-->
<!--                <td style="width: 20%; padding: 7px;"><div>NEED IMPROVEMENT</div></td>-->
              </tr>
            </table>

<!--            <table style="width: 100%; border: 1px solid #b8babb; font-size: 13px; margin-top: 10px;">

              <tr style="border-bottom: 1px solid #b8babb;">
                <td style="width: 28%; padding: 5px;" rowspan="2">GRADING</td>
                <td style="width: 8%; padding: 5px; text-align: center;" v-for="(scale,idx) in reportDetails?.aggregate_scale" :key="idx">
                  {{scale?.short_name}}
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #b8babb;">
                <td style="width: 8%; padding: 5px; text-align: center;" v-for="(scale,idx) in reportDetails?.aggregate_scale" :key="idx">
                  {{scale?.min+" - "+scale?.max}}
                </td>
              </tr>

            </table>-->

          </td>
        </tr>

        <tr>
          <td>

            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
              <tr>
                <td style="width: 40%; padding: 5px;">SCORE:</td>
                <td style="width: 60%; padding: 5px;">SPECIFIC REMARKS:</td>
              </tr>
            </table>

          </td>
        </tr>


        <tr>
          <td>


            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;" v-for="(item,idx) in reportDetails?.learning_areas" :key="idx">
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td colspan="3" style="text-align: center; padding: 5px; text-transform: uppercase;font-weight: bold;">{{item?.name}}</td>
              </tr>
              <tr v-for="(lst,index) in  item?.assessments"  style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">{{lst?.name}}</td>
                <td style="width: 10%; padding: 5px;">
                  <img
                      v-if="lst?.report_score_summary?.illustration"
                      alt="img"
                      style="width: 40px;"
                      :src="imagePath+lst?.report_score_summary?.illustration"/>
<!--                  {{lst.report_scores.illustration}}-->
                </td>
                <td style="width: 60%; padding: 5px;">{{lst?.report_score_summary?.comment}}</td>
              </tr>
<!--
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Story</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Listening Closely</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Paying Attention</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Reading & Vocabulary</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Writing</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Numeracy</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;">He can write numbers from 0 to 200</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Overall Remark</td>
                <td colspan="2" style="padding: 5px;">great work on this</td>
              </tr>-->

            </table>

<!--

            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td colspan="3" style="text-align: center; padding: 5px;">MENTAL STUDIES</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Looking Carefully</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;">He has learnt to settle down during class room time</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Story</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Listening Closely</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Paying Attention</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Reading & Vocabulary</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Writing</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Numeracy</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;">He can write numbers from 0 to 200</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Overall Remark</td>
                <td colspan="2" style="padding: 5px;">great work on this</td>
              </tr>

            </table>

            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td colspan="3" style="text-align: center; padding: 5px;">PHYSICAL STUDIES</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Feeding Pattern</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;">He has learnt to settle down during class room time</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Personal Hygiene</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Communal Hygiene</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Play</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Performing Arts</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Creative Work and Take Care</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Overall Remark</td>
                <td colspan="2" style="padding: 5px;">great work on this</td>
              </tr>

            </table>


            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td colspan="3" style="text-align: center; padding: 5px;">RELIGIOUS STUDIES</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Praise and Worship</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;">He has learnt to settle down during class room time</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Prayer</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Rules and Obedience</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%;padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Bible Reading</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Problem Solving</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Overall Remark</td>
                <td colspan="2" style="padding: 5px;">great work on this</td>
              </tr>

            </table>

            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td colspan="3" style="text-align: center; padding: 5px;">SOCIAL STUDIES</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Handling Acceptance</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;">He has learnt to settle down during class room time</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Handling Rejection</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Respect for People</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Serving People</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Sharing and Compassion</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="width: 30%; padding: 5px;">Family and Community</td>
                <td style="width: 10%; padding: 5px;">Flower</td>
                <td style="width: 60%; padding: 5px;"></td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px;">Overall Remark</td>
                <td colspan="2" style="padding: 5px;">great work on this</td>
              </tr>

            </table>
-->


          </td>
        </tr>




        <tr>
          <td>

            <table style="width: 100%; font-size: 13px; margin-top: 20px; margin-bottom: 30px;">
              <tr>
                <td style="width: 25%;">
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;">CLASS TEACHER'S SIGNATURE:</div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;">HEAD TEACHER'S SIGNATURE:</div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;">NEXT TERM BEGINS:</div>
                </td>

                <td>

                  <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top: 12px;"></div>
                  <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top: 12px;"> {{reportDetails?.head_teachers_comment}}</div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;"> <!--18th/May/2020--> {{reportDetails?.next_term_begins	}}</div>

                </td>
              </tr>
            </table>

<!--            <table style="width: 100%; font-size: 13px; margin-top: 20px; margin-bottom: 30px;">
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
            </table>-->

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