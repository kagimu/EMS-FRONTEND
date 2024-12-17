<script setup>

import Badge from "@/assets/images/badge.png";
import StudentImage from "@/assets/images/pic.jpg";

const printReport = () => {
  // alert("Print pdf now man")
}

const props = defineProps({
  reportDetails:{},
  reportDataInfo:{}
})


const ageCalculator = (dob) => {
  const now = new Date();
  const birthDate = new Date(dob);

  if (isNaN(birthDate)) {
    throw new Error("Invalid date format. Please provide a valid date.");
  }

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  let result = "";
  if (years > 0) result += `${years}yrs`;
  if (months > 0) result += result ? `, ${months}mth` : `${months}mth`;
  if (days > 0) result += result ? `, ${days}dys` : `${days}dys`;

  return result || "0dys"; // Return "0dys" if all are zero
}

</script>


<template>
  <div>
    <div class="mx-auto mt-10" style="width: 98%">
      <table style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px;">
        <tr>
          <td>

            <table style="width: 100%;">
              <tr>
                <td style="width: 20%; text-align: center;">
                 <img alt="logo" style="width: 150px; margin: 0 auto" :src="reportDetails?.school?.logo"/>
                </td>
                <td style="width: 60%;" class="text-center">
                  <div style="font-size: 30px;text-transform: uppercase;"><b>{{reportDetails?.school?.name}}</b></div>

                  <div style="font-size: 20px; margin-top: 5px;text-transform: uppercase;">{{reportDetails?.campus?.name}}</div>

                  <div style="margin-top: 6px; margin-bottom: 10px;"><small>
                       {{reportDetails?.campus?.location}} |
                      {{reportDetails?.campus?.phone}} |
                      {{reportDetails?.campus?.email}}
                  </small></div>

                  <div style="background-color: green; color: #ffffff;">PROGRESS REPORT FOR KINDERGARTEN</div>
                </td>
                <td style="width: 20%;">
                  <div style="text-align: center; margin-top: 10px;">
                   <img alt="logo" style="width: 130px; margin: 0 auto;" :src="reportDataInfo?.photo"/>
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
                  <div style="padding-left: 5px; padding-bottom: 10px;">Name:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">Class:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;"> Days Present:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">Term:</div>
                </td>
                <td style="width: 40%;">
                  <div style="padding-left: 5px; padding-bottom: 10px;"><span class="capitalize">{{reportDetails?.student?.surname}}</span> <span class="capitalize">{{reportDetails?.student?.second_name}}</span> <span class="capitalize">{{reportDetails?.student?.other_name}}</span></div>
                  <div style="padding-left: 5px; padding-bottom: 10px;"><span>{{reportDetails?.class_abbreviation}}<span v-if="reportDetails?.stream">, {{reportDetails?.stream}}</span></span></div>
                  <div style="padding-left: 5px; padding-bottom: 10px;"><span class="capitalize">310</span></div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">{{reportDetails?.study_period}}</div>
                </td>
                <td style="width: 15%;">
                  <div style="padding-left: 5px; padding-bottom: 10px;">  Age:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">School Team:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">Days Absent:</div>
                  <div style="padding-left: 5px; padding-bottom: 10px;">Date:</div>
                </td>
                <td style="width: 30%;">
                  <div style="padding-left: 5px; padding-bottom: 10px;"><!--6yrs , 8mth-->{{ageCalculator(reportDetails?.student?.date_of_birth)}}</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">2</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">{{new Date().toLocaleDateString()}}</div>
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
                <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">EXCELLENT</td>
                <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">GOOD</td>
                <td style="width: 20%; border-right: 1px solid #f4f4f4; padding: 7px;">FAIR</td>
                <td style="width: 20%; padding: 7px;"><div>NEED IMPROVEMENT</div></td>
              </tr>
            </table>
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