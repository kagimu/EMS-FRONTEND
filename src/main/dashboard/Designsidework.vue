<template>
  <table style="border: 1px solid #dee2e6; color:#4b5563; font-size:13px; width: 100%; border-collapse: collapse; text-align: left;">
    <!-- Table Header -->
    <thead>
      <tr>
        <th style="width:5%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;"></th>
        <th style="width:20%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">SUBJECT UNIT</th>
        <th style="width:10%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">ROC</th>
        <th style="width:10%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">End of Term</th>
        <th style="width:10%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">Quarter Term</th>
        <th style="width:10%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">Average</th>
        <th style="width:10%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">Aggr</th>
        <th style="width:10%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">Remark</th>
        <th style="width:10%;border: 1px solid #dee2e6;color:#4b5563; font-size:13px;">Initial</th>
      </tr>
    </thead>
    <tbody>
      <!-- Iterate over the data -->
      <template v-for="(subjectGroup, groupName) in dataList" :key="groupName">
        <template v-for="(subject, index) in subjectGroup.assessments" :key="index">
          <tr>
            <!-- Subject Group Name with Rowspan -->
            <th v-if="index === 0" :rowspan="Number(subjectGroup.assessments.length)" 
                style="transform: rotate(270deg); white-space: nowrap; overflow: hidden; 
                text-overflow: ellipsis; margin: auto; border: 1px solid #dee2e6;color:#4b5563 !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-weight: 300 !important; font-size:13px; vertical-align: middle;
                padding-left: 10px;padding-right:10px; padding-top:10px;padding-bottom:10px;
                letter-spacing: 0.07em; line-height: 1.5em; height: auto;">
              {{ subjectGroup.name }}
            </th>

            <!-- Subject Information Cells -->
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.name }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.report_scores[0]?.score || '-' }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.report_scores[1]?.score || '-' }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.report_score_summary.summation }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.report_score_summary.comment }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.report_score_summary.grade }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.report_score_summary.grade }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">{{ subject.report_score_summary.comment }}</td>
            <td style="border: 1px solid #dee2e6;color:#4b5563; font-size:13px; padding: 10px;">M.O</td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue';

const dataList = ref([
  {
    "name": "Mental Studies",
    "assessments": [
      {
        "name": "Mathematics",
        "report_scores": [
          { "score": 30, "grade": "Distinction one", "remark": "Excellent" },
          { "score": 24, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 54,
          "comment": "Excellent",
          "grade": "D1"
        }
      },
      {
        "name": "Language English",
        "report_scores": [
          { "score": 27, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 27,
          "comment": "Fair",
          "grade": "P8"
        }
      },
      {
        "name": "Language English",
        "report_scores": [
          { "score": 27, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 27,
          "comment": "Fair",
          "grade": "P8"
        }
      },
      {
        "name": "Language English",
        "report_scores": [
          { "score": 27, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 27,
          "comment": "Fair",
          "grade": "P8"
        }
      },
      {
        "name": "Language English",
        "report_scores": [
          { "score": 27, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 27,
          "comment": "Fair",
          "grade": "P8"
        }
      }
    ]
  },
  {
    "name": "Religious Studies",
    "assessments": [
      {
        "name": "Mathematics",
        "report_scores": [
          { "score": 30, "grade": "Distinction one", "remark": "Excellent" },
          { "score": 24, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 54,
          "comment": "Excellent",
          "grade": "D1"
        }
      },
      {
        "name": "Language English",
        "report_scores": [
          { "score": 27, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 27,
          "comment": "Fair",
          "grade": "P8"
        }
      },
      {
        "name": "Language English",
        "report_scores": [
          { "score": 27, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 27,
          "comment": "Fair",
          "grade": "P8"
        }
      },
      {
        "name": "Language English",
        "report_scores": [
          { "score": 27, "grade": "Distinction one", "remark": "Excellent" }
        ],
        "report_score_summary": {
          "summation": 27,
          "comment": "Fair",
          "grade": "P8"
        }
      }
    ]
  }
]);
</script>
