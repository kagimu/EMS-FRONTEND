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


    <table ref="reportContent" style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px;">
      <tr>
        <td>

          <table style="width: 100%;">
            <tr>
              <td style="width: 20%; text-align: center;">
                <img alt="logo" style="width: 150px; margin: 0 auto" src="../../../../public/img/badge.png"/>
              </td>
              <td style="width: 60%;" class="text-center">
                <div style="font-size: 30px;"><b>NOREGRETS LIFE SCHOOL</b></div>

                <div style="font-size: 20px; margin-top: 5px;">BUNAMWAYA CAMPUS</div>

                <div style="margin-top: 6px; margin-bottom: 10px;"><small>Bunamwaya, P.O.BOX 21671 Kampala | +256752698545 | mwesigwa.noregrets@gmail.com</small></div>

                <div style="background-color: green; color: #ffffff;">PROGRESS REPORT FOR KINDERGARTEN</div>
              </td>
              <td style="width: 20%;">
                <div style="text-align: center; margin-top: 10px;">
                  <img alt="logo" style="width: 130px; margin: 0 auto;" src="../../../../public/img/pic.jpg"/>
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
                <div style="padding-left: 5px; padding-bottom: 10px;"> NZANZU Titus Garnette</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">Baby Class</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">310</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">Term 1</div>
              </td>
              <td style="width: 15%;">
                <div style="padding-left: 5px; padding-bottom: 10px;">  Age:</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">School Team:</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">Days Absent:</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">Date:</div>
              </td>
              <td style="width: 30%;">
                <div style="padding-left: 5px; padding-bottom: 10px;"> 6yrs , 8mth</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">&nbsp;</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">2</div>
                <div style="padding-left: 5px; padding-bottom: 10px;">30th/Nov/-0001</div>
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

          </table>


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

<script setup>


const printReport = () => {
 // alert("Print pdf now man")
}







</script>

<style scoped>

</style>