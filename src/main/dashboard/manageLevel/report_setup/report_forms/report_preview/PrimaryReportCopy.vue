<script setup>

import Badge from "@/assets/images/badge.png";
import StudentImage from "@/assets/images/pic.jpg";
import {onMounted,ref} from "vue";

const printReport = () => {
  // alert("Print pdf now man")
}
const nextTermBegins = ref(null)

const props = defineProps({
  reportDetails:{},
  reportDataInfo:{}
})


onMounted(
    () =>{

  const rawDate = props.reportDetails?.next_term_begins;
  // const formattedDate = date.toISOString().split('')[0];
  const formattedDate = rawDate.split(' ')[0];
  nextTermBegins.value = formattedDate
    }
)


// next_term_begins

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
    <div class="mx-auto mt-10" style="width: 98%; ">
        <table style="width: 100%; border: 1px solid #f4f4f4; margin-bottom: 20px;">
        <tr>
          <td>



            <table style="width: 100%; text-align: center;">
              <tr>
                <td style="width: 20%; text-align: center;">
                  <img alt="logo" style="width: 130px; margin: 0 auto;" :src="reportDetails?.school?.logo"/>
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
                    <img alt="logo" style="width: 130px;" :src="reportDataInfo?.photo"/>
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
                  <div style="padding-left: 60px; padding-bottom: 10px;text-transform: capitalize;"><span >{{reportDetails?.student?.surname}}</span> <span class="capitalize">{{reportDetails?.student?.second_name}}</span> <span class="capitalize">{{reportDetails?.student?.other_name}}</span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span>{{reportDetails?.class_abbreviation}}<!--<span v-if="reportDetails?.stream">, {{reportDetails?.stream}}</span>--></span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><span>{{reportDetails?.student?.gender}}</span></div>
                  <div style="padding-left: 60px; padding-bottom: 10px;"><!--6yrs , 8mth-->{{ageCalculator(reportDetails?.student?.date_of_birth)}}</div>
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


 <div style="font-family: Arial, sans-serif; margin: 0px;">


    <table
     style="border-bottom: 1px solid  #f4f4f4; color:#4b5563; background-color: transparent; font-size:13px; width: 100%; 
     border-collapse: collapse; text-align: left;background-color: transparent;"
  
     >
    <!-- Table Header -->
    <thead>
      <tr>
        <th style="width:5%;border-top: 1px solid  #f4f4f4;color:white; background-color: transparent; font-size:12px;border-left:0px !important"></th>
        <th style="width:22%;border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:12px;padding-top:5px;;padding-bottom:5px; border-left:10px !important">SUBJECT UNIT</th>
        <th
            v-for="(item,idx) in reportDetails?.report_columns" :key="idx"
            style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:11px;padding-top:5px;padding-bottom:5px"
        >
          {{item}}
        </th>
        <th style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:11px;padding-top:5px;padding-bottom:5px">Total</th>
        <th style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:11px;padding-top:5px;padding-bottom:5px">Aggr</th>
        <th style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:11px;padding-top:5px;padding-bottom:5px">Remark</th>
        <th style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:11px;padding-top:5px;padding-bottom:5px">Initial</th>
      </tr>
    </thead>
    <tbody>
      <!-- Iterate over the data -->
      <template v-for="(subjectGroup, groupName) in reportDetails?.learning_areas" :key="groupName">
        <template v-for="(subject, index) in subjectGroup.assessments" :key="index">
          <tr>
            <!-- Subject Group Name with Rowspan -->
            <td v-if="index === 0" :rowspan="Number(subjectGroup.assessments.length)"
                style="transform: rotate(3600deg); white-space: nowrap; overflow: hidden;
                text-overflow: ellipsis; border-top: 1px solid  #f4f4f4;color:#4b5563; font-size:10px; vertical-align: middle;
                letter-spacing: 0.05em; height: auto;text-transform: uppercase; font-weight: bold;">
           {{ subjectGroup.name }}
            </td>

            <!-- Subject Information Cells -->
            <td style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:12px; padding-top: 5px;padding-bottom: 10px;">{{ subject.name }}</td>
            <td
                v-for="(item,idx) in subject?.report_scores" :key="idx"
                style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:12px; padding-top: 5px;padding-bottom: 5px;" >
                  {{ item?.score > 0 ? item?.score : '-' }}
            </td>
            <td style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:12px;padding-top: 5px;padding-bottom: 5px;">{{ subject.report_score_summary.summation }}</td>
            <td style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:12px; padding-top: 5px;padding-bottom: 5px;">{{ subject.report_score_summary.grade }}</td>
            <td style="border-top: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:12px; padding-top: 5px;padding-bottom: 5px;">{{ subject.report_score_summary.comment }}</td>
            <td style="border-top: 1px solid  #f4f4f4;border-bottom: 1px solid  #f4f4f4;color:#4b5563; background-color: transparent; font-size:13px; padding: 0px;"></td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>


</div>


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


<!--            <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px; margin-bottom: 20px;">
              <tr style="text-align: center; border-bottom: 1px solid #f4f4f4;">
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON MENTAL STUDIES</td>
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON PHYSICAL STUDIES</td>
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON RELIGIOUS STUDIES</td>
                <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">ON SOCIAL STUDIES</td>
              </tr>
              <tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 5px; border-right: 1px solid #f4f4f4;">&nbsp;</td>
                <td style="padding: 5px; border-right: 1px solid #f4f4f4;"></td>
                <td style="padding: 5px; border-right: 1px solid #f4f4f4;">&nbsp;</td>
                <td style="padding: 5px;">&nbsp;</td>
              </tr>
            </table>-->

          </td>
        </tr>


        <tr>
          <td>

            <table style="width: 100%; border: 1px solid #b8babb; font-size: 13px; margin-top: 10px;">

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

            </table>



            <table style="width: 100%; font-size: 13px; margin-top: 20px; margin-bottom: 30px;">
              <tr>
                <td style="width: 25%;">
                  CLASS TEACHER'S SIGNATURE:
                </td>
                <td>
                  <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top:20px;"></div>
                </td>
              </tr>


              <tr>
                <td>
                  HEAD TEACHER'S SIGNATURE:
                </td>
                <td>
                  <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top: 12px;"> {{reportDetails?.head_teachers_comment}}</div>
                </td>
              </tr>


              <tr>
                <td>
                  NEXT TERM BEGINS:
                </td>
                <td>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;"> <!--18th/May/2020-->
                    {{ nextTermBegins }}
                  </div>
                </td>
              </tr>

              <tr>
                <td>

                </td>
                <td>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top:28px;">
                    {{reportDetails?.promotion_status}}
                  </div>
                </td>
              </tr>

            </table>



<!--            <table style="width: 100%; font-size: 13px; margin-top: 20px; margin-bottom: 30px;">
              <tr>
                <td style="width: 25%;">
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;">CLASS TEACHER'S SIGNATURE:</div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;">HEAD TEACHER'S SIGNATURE:</div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;">NEXT TERM BEGINS:</div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;"></div>
                </td>

                <td>

                  <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top: 28px;"></div>
                  <div style="padding-left: 5px; padding-bottom: 0; border-bottom: 1px solid  #4b5563; color: #4b5563; padding-top: 12px;"> {{reportDetails?.head_teachers_comment}}</div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top: 12px;"> &lt;!&ndash;18th/May/2020&ndash;&gt;
                    &lt;!&ndash; {{reportDetails?.next_term_begins	}} &ndash;&gt;
                    {{nextTermBegins}}
                  </div>
                  <div style="padding-left: 5px; padding-bottom: 0; color: #4b5563; padding-top:28px;">
                    {{reportDetails?.promotion_status}}
                  </div>

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




<style>
  /* table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13px;
        } */
        th, td {
            /* border: 1px solid #ddd; */
            /* padding: 5px; */
        }
        .vertical-header {
            writing-mode: sideways-lr;
            text-orientation:mixed;
            /* font-weight: bold; */
            text-align: center;
        }
        .section-header {
            background-color: #f4f4f4;
            /* font-weight: bold; */
        }
        .data-row td {
            padding: 0px;
        }
        thead th {
            background-color: #e6e6e6;
            /* font-weight: bold; */
        }
</style>