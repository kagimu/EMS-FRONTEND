<script setup>

import useCommonsStore from "@/composables/useCommons.js";
import api from "@/config/api.js";
import {onMounted,ref} from "vue";

const nextTermBegins = ref(null)

const commons = useCommonsStore()
let imagePath = api.defaults.baseURL + "/attachments/download/"

const printReport = () => {
  // alert("Print pdf now man")
}

const props = defineProps({
  reportDetails:{},
  reportDataInfo:{}
})


onMounted(
    () =>{
  const rawDate = props.reportDetails?.next_term_begins;
  const formattedDate = rawDate.split(' ')[0];
  nextTermBegins.value = formattedDate
    }
)

</script>

<template>

  <!-- {{ reportDataInfo }} -->
<!--   {{ reportDetails }}-->
<div>
  <div class="mx-auto mt-10" style="width: 98%">

    <table ref="reportContent" style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px;">
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
                <div style="padding-left: 60px; padding-bottom: 10px;"><span>{{reportDetails?.class_abbreviation}}<!--<span v-if="reportDetails?.stream">, {{reportDetails?.stream}}</span>--></span></div>
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
                <div style="padding-left: 60px; padding-bottom: 10px;">{{reportDetails?.study_period_end_date}}</div>
                <div style="padding-left: 60px; padding-bottom: 10px; color:#008000;">{{reportDetails?.grade}}</div>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <tr>
        <td>

<!--          <table style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px; font-size: 13px;">
            <tr>
              <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">KEY TO SCORES:</td>
              <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">EXCELLENT</td>
              <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">GOOD</td>
              <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">FAIR</td>
              <td style="width: 20%; padding: 7px;"><div>NEED IMPROVEMENT</div></td>
            </tr>
          </table>-->

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

<!--          <table style="width: 100%; border: 1px solid #b8babb; font-size: 13px; margin-top: 10px;">

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
            <tr style="text-align: center; border-bottom: 1px solid #f4f4f4;">
              <td v-for="(item,idx) in reportDetails?.learning_areas" :key="idx" style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4; text-transform: uppercase;">{{item?.name}}</td>
<!--              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">PHYSICAL STUDIES</td>-->
<!--              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">RELIGIOUS STUDIES</td>-->
<!--              <td style="width: 25%; padding: 5px;">SOCIAL STUDIES</td>-->
            </tr>
            <tr  style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;  vertical-align: top;" v-for="(item,idx) in reportDetails?.learning_areas" :key="idx">


                <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
                  <tr v-for="(lst,index) in  item?.assessments" :key="index" style="border-bottom: 1px solid #f4f4f4;">
                    <td style="padding: 5px; border-right: 1px solid #f4f4f4; width: 70%;">{{lst?.name}}</td>
                    <td style="padding: 5px; border-right: 1px solid #f4f4f4;">
                      <img
                          v-if="lst?.report_score_summary?.illustration"
                          alt="logo"
                          style="width: 40px;"
                          :src="imagePath+lst?.report_score_summary?.illustration"/>
                    </td>
                  </tr>
                </table>

              </td>
<!--              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Feeding Pattern</td>-->
<!--              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Praise and Worship</td>-->
<!--              <td style="padding: 5px;">Handling Acceptance</td>-->
            </tr>

          </table>


<!--          <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
            <tr style="text-align: center; border-bottom: 1px solid #f4f4f4;">
              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">MENTAL STUDIES</td>
              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">PHYSICAL STUDIES</td>
              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">RELIGIOUS STUDIES</td>
              <td style="width: 25%; padding: 5px;">SOCIAL STUDIES</td>
            </tr>
            <tr style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Looking Carefully</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Feeding Pattern</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Praise and Worship</td>
              <td style="padding: 5px;">Handling Acceptance</td>
            </tr>

            <tr style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Story</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Personal Hygiene</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Prayer</td>
              <td style="padding: 5px;">Handling Rejection </td>
            </tr>

            <tr style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Listening Closely</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Communal Hygiene</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Rules and Obedience</td>
              <td style="padding: 5px;">Respect for People</td>
            </tr>

            <tr style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Paying Attention</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Play</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Bible Reading</td>
              <td style="padding: 5px;">Serving People</td>
            </tr>

            <tr style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Reading & Vocabulary</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Performing Arts </td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Problem Solving</td>
              <td style="padding: 5px;">Sharing and Compassion</td>
            </tr>

            <tr style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Writing</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Creative Work and Take Care</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;"></td>
              <td style="padding: 5px;">Family and Community</td>
            </tr>

            <tr style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Numeracy</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;"></td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;"></td>
              <td style="padding: 5px;"></td>
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




          <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
                  <tr style="border-bottom: 1px solid #f4f4f4;">
                    <td v-for="(item,idx) in reportDetails?.learning_areas" :key="idx" style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4; text-transform: uppercase;">ON {{item?.name}}</td>
                  </tr>
            <tr  style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;  vertical-align: top;" v-for="(item,idx) in reportDetails?.learning_areas" :key="idx">

              <div class="text-sm p-2">{{item.comment}}</div>

              </td>

            </tr>

          </table>


<!--          <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px; margin-bottom: 20px;">
            <tr style="text-align: center; border-bottom: 1px solid #f4f4f4;">
              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON MENTAL STUDIES</td>
              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON PHYSICAL STUDIES</td>
              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON RELIGIOUS STUDIES</td>
              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON SOCIAL STUDIES</td>
            </tr>
            <tr style="border-bottom: 1px solid #f4f4f4;text-align: center;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">&nbsp;</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">&nbsp;</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">&nbsp;</td>
              <td style="padding: 5px;">&nbsp;</td>
            </tr>
          </table>-->

        </td>
      </tr>


      <tr>
        <td>


          <table style="width: 100%; font-size: 12px; margin-top: 15px; margin-bottom: 10px;">
            <tr>
              <td style="width: 25%;">
                CLASS TEACHER'S COMMENT:
              </td>
              <td>
                <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top:10px;">{{reportDetails?.teacher_comment}}</div>
              </td>
            </tr>

            <tr>
              <td style="width: 25%;">
                SIGNATURE:
              </td>
              <td>
                <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top:9px;"></div>
              </td>
            </tr>


            <tr>
              <td>
                HEAD TEACHER'S COMMENT:
              </td>
              <td>
                <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top: 9px;"> {{reportDetails?.head_teachers_comment}}</div>
              </td>
            </tr>

            <tr>
              <td>
                SIGNATURE:
              </td>
              <td>
                <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top: 7px;">&nbsp;</div>
              </td>
            </tr>


            <tr>
              <td>
                NEXT TERM BEGINS:
              </td>
              <td>
                <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 9px;"> <!--18th/May/2020-->
                  {{ nextTermBegins }}
                </div>
              </td>
            </tr>

            <tr>
              <td>

              </td>
              <td>
                <div v-if="reportDetails?.promotion_status !== 'N/A'" style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top:9px;">
                  {{reportDetails?.promotion_status}}
                </div>
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