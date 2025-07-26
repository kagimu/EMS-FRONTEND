<script setup>

import {ref, watch} from "vue";
import {useNarrativeStore} from "@/main/dashboard/narrative/narrativeComponents/store/narrativeStore.js";
const narrativeStore = useNarrativeStore()

const draftInfo = ref(null)


watch (
    () => narrativeStore.printNarrativeResponse,
    async (data) => {
      if (data) {
        draftInfo.value = data.data
      }
    }
)


const narrativeData = ref([
  {
    "learningArea": "Learning to Care for the Mind (MENTAL STUDIES)",
    "subjectCluster": "Acquire Knowledge Properly",
    "subjects": [
      {
        "subjectCode": "1.1.1",
        "subject": "Listen",
        "referenceDate": "",
        "status": "",
        "currentDate": "",
        "currentStatus": "",
        "suggestedAction": ""
      },
      {
        "subjectCode": "1.1.2",
        "subject": "History",
        "referenceDate": "",
        "status": "",
        "currentDate": "",
        "currentStatus": "",
        "suggestedAction": ""
      },
      {
        "subjectCode": "1.1.3",
        "subject": "Geography",
        "referenceDate": "",
        "status": "",
        "currentDate": "",
        "currentStatus": "",
        "suggestedAction": ""
      }
    ]
  },
  {
    "learningArea": "Environmental Awareness",
    "subjectCluster": "Nature Studies",
    "subjects": [
      {
        "subjectCode": "2.1.1",
        "subject": "Climate Change",
        "referenceDate": "",
        "status": "",
        "currentDate": "",
        "currentStatus": "",
        "suggestedAction": ""
      },
      {
        "subjectCode": "2.1.2",
        "subject": "Ecosystem",
        "referenceDate": "",
        "status": "",
        "currentDate": "",
        "currentStatus": "",
        "suggestedAction": ""
      }
    ]
  },
  {
    "learningArea": "Health and Well-being",
    "subjectCluster": "Physical Education",
    "subjects": [
      {
        "subjectCode": "3.1.1",
        "subject": "Exercise & Fitness",
        "referenceDate": "",
        "status": "",
        "currentDate": "",
        "currentStatus": "",
        "suggestedAction": ""
      },
      {
        "subjectCode": "3.1.2",
        "subject": "Healthy Eating",
        "referenceDate": "",
        "status": "",
        "currentDate": "",
        "currentStatus": "",
        "suggestedAction": ""
      }
    ]
  }
] )


</script>
<template>
    <div style="padding-left:38px;padding-right:38px;">
    <div style="text-align: center; position: relative;">
      <div style="position: absolute; top: 0; right: 0; font-size: 11px; font-weight: bold;">
        Wholesome Report No. ......
      </div>
      <br>
      <h1 style="font-size: 50px; font-weight: 900; color: yellow; -webkit-text-stroke: 2px green;letter-spacing:-0.1cap;
      margin-bottom: -10px;">
        WHOLESOME EDUCATION ASSESSMENT
      </h1>
      <h2 style="font-size: 45px; font-weight:800; color: #92d050; padding-bottom: 30px;letter-spacing:cap;word-spacing: -0.1cap;
      padding-top: -30px;">
        Growth Progress Report
      </h2>
    </div>

    <div style="width: 100%; ; font-family: Arial, sans-serif; margin-bottom: 60px;">
    <div style="background-color: #99cc66; font-weight: bold; padding: 5px; border-bottom: 1px solid black;">
      PERSONAL INFORMATION OF LEARNER
    </div>
    <table style="width: 100%; border-collapse: collapse; margin-top: 4px;margin-bottom: 7px;">
      <tr>
        <td style="border: 0px solid black; border-left: solid white; padding: 5px; font-weight: bold;width: 20%;">Child’s Surname:</td>
        <td style="border: 0px solid black; padding: 5px; background-color: #ffff99;width: 30%;">{{draftInfo?.child_first_name}}</td>
        <td style="border: 1px solid black; padding: 5px; font-weight: bold;width: 20%;">Second name:</td>
        <td style="border: 1px solid black; padding: 5px;width: 30%;">{{draftInfo?.child_second_name}}</td>

      </tr>
      <tr>
        <td style="border: 0px solid black; border-left: solid white; padding: 5px; font-weight: bold;width: 20%;">Registration Number:</td>
        <td style="border: 1px solid black; padding: 5px; width: 30%;border-left: 0px;">{{draftInfo?.registration_number}}</td>
        <td style="border: 1px solid black; padding: 5px; font-weight: bold;">Date of Conference:</td>
        <td style="border: 1px solid black; padding: 5px;">{{draftInfo?.date_of_conference}}</td>
      
      </tr>
      <tr>
        <td style="border: 0px solid black; padding: 5px; font-weight: bold;">School:</td>
        <td style="border: 1px solid black; padding: 5px; background-color: #ffff99;border-left: 0px;">{{draftInfo?.school}}</td>
        <td style="border: 1px solid black; padding: 5px; "></td>
        <td style="border: 1px solid black; padding: 5px;"></td>
     
      </tr>
    </table>

    <p style="font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
        This form describes the learner’s growth progress in achieving four broad desired results for all learners according to the age group. Namely;
    </p>
    <ol style="font-family: Arial, sans-serif; font-size: 14px;">
        <li>A person grows in mind, which means, learning to care for his mind.</li>
        <li>A person grows in body, which means, learning to care for his body.</li>
        <li>A person grows in spirit, which means, learning to care for his spirit.</li>
        <li>A person grows in friendship, which means, learning to care for his relationships.</li>
    </ol>
    <p style="font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
        We observe and make assessments about what a learner has become (patterns developed in him) along with what the learner knows, understands and can do well. The following detail is part of the information we have analysed and are presenting to the parent and sponsor of the learner.
    </p>

    <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <tr style="font-size: 13px;">
            <th style="background-color: yellow; border: 1px solid black; padding: 5px;">#</th>
            <th style="background-color: yellow; border: 1px solid black; padding: 5px;">LEARNING AREA</th>
            <th style="background-color: yellow; border: 1px solid black; padding: 5px;">SUBJECT CLUSTER</th>
            <th style="background-color: yellow; border: 1px solid black; padding: 5px;">SUBJECT CODE</th>
            <th style="background-color: #a6a6a6; border: 1px solid black; padding: 5px;">SUBJECT</th>
<!--            <th style="background-color: #a6a6a6;border: 1px solid black; padding: 5px;">REFERENCE DATE</th>
            <th style="background-color: #a6a6a6;border: 1px solid black; padding: 5px;">STATUS</th>
            <th style="background-color: #a6a6a6;border: 1px solid black; padding: 5px;">CURRENT DATE</th>
            <th style="background-color: #a6a6a6;border: 1px solid black; padding: 5px;">CURRENT STATUS</th>
            <th style="background-color: #a6a6a6;border: 1px solid black; padding: 5px;">SUGGESTED ACTION</th>-->
        </tr>



<!--          <tr style="font-size: 13px;" v-for="(info,idx) in draftInfo?.narrative_response_data" :key="key">
            <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">
              {{info?.learning_area}}
            </td>
            <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">Acquire Knowledge Properly</td>
            <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.1</td>
            <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">Listen</td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
          </tr>-->

      <tr style="font-size: 13px;">
        <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1</td>
        <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">Learning to Care for the Mind (MENTAL STUDIES)</td>
        <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">Acquire Knowledge Properly</td>
        <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.1</td>
        <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">

          <div class="text-center text-lg">Listen</div>
          <div style="border-top: 1px solid black; padding: 5px;">REFERENCE DATE: 2nd/7/2025</div>
          <div style="border-top: 1px solid black; padding: 5px;">STATUS: Active</div>
          <div style="border-top: 1px solid black; padding: 5px;">CURRENT DATE: 2nd/7/2025 </div>
          <div style="border-top: 1px solid black; padding: 5px;">CURRENT STATUS: Inactive</div>
          <div style="border-top: 1px solid black; padding: 5px;">SUGGESTED ACTION: any</div>

        </td>
<!--        <td  style="border: 1px solid black; padding: 5px;"></td>-->
<!--        <td  style="border: 1px solid black; padding: 5px;"></td>-->
<!--        <td  style="border: 1px solid black; padding: 5px;"></td>-->
<!--        <td  style="border: 1px solid black; padding: 5px;"></td>-->
<!--        <td  style="border: 1px solid black; padding: 5px;"></td>-->
      </tr>
<!--
        <tr style="font-size: 13px;">
            <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">Learning to Care for the Mind (MENTAL STUDIES)</td>
            <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">Acquire Knowledge Properly</td>
            <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.1</td>
            <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">Listen</td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
        </tr>

        <tr style="font-size: 13px;">
            <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.2</td>
            <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">History</td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
        </tr>
        <tr style="font-size: 13px;">
            <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.3</td>
            <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">Geography</td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
        </tr>

       
        <tr style="font-size: 13px;">
            <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">Learning to Care for the Mind (MENTAL STUDIES)</td>
            <td rowspan="3" style="background-color: yellow; border: 1px solid black; padding: 5px;">Acquire Knowledge Properly</td>
            <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.1</td>
            <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">Listen</td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
        </tr>
       

        <tr style="font-size: 13px;">
            <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.2</td>
            <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">History</td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
        </tr>
        <tr style="font-size: 13px;">
            <td style="background-color: yellow; border: 1px solid black; padding: 5px;">1.1.3</td>
            <td style="background-color: #99cc66; border: 1px solid black; padding: 5px;">Geography</td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
            <td  style="border: 1px solid black; padding: 5px;"></td>
        </tr>-->
    </table>
  </div>


  <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; font-family: Arial, sans-serif;">
    
    <!-- Left Section -->
    <div style="width: 48%; border-top: 2px solid black; padding-top: 5px;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">PERSON CONDUCTING CONFERENCE</h3>
        
        <div style="margin-bottom: 10px;">
            <label style="font-weight: bold;background-color: #f8ff99;width: 100%;padding: 4px;">Name:</label>
            <div style="background-color: #f8ff99; height: 30px; width: 100%;border-bottom: 1px solid black;"></div>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="font-weight: bold;background-color: white;width: 100%;padding: 4px;">Title:</label>
            <div style="background-color: white; height: 30px; width: 100%;border-bottom: 1px solid black;"></div>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="font-weight: bold;background-color: #f8ff99;width: 100%;padding: 4px;">Signature:</label>
            <div style="background-color: #f8ff99; height: 30px; width: 100%;border-bottom: 1px solid black;"></div>
        </div>
    </div>

    <!-- Right Section -->
    <div style="width: 48%; border-top: 2px solid black; padding-top: 5px;">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">PARENT/GUARDIAN/CAREGIVER</h3>
        
        <div style="margin-bottom: 10px;">
            <label style="font-weight: bold;background-color: #f8ff99;width: 100%;padding: 4px;">Name:</label>
            <div style="background-color: #f8ff99; height: 30px; width: 100%;border-bottom: 1px solid black;"></div>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="font-weight: bold;background-color: white;width: 100%;padding: 4px;">Title:</label>
            <div style="background-color: white; height: 30px; width: 100%;border-bottom: 1px solid black;"></div>
        </div>

        <div style="margin-bottom: 10px;">
            <label style="font-weight: bold;background-color: #f8ff99;width: 100%;padding: 4px;">Signature:</label>
            <div style="background-color: #f8ff99; height: 30px; width: 100%;border-bottom: 1px solid black;"></div>
        </div>
    </div>

</div>

<p style="margin-top: 20px; font-size: 14px;">
    This report should be printed, discussed with parent/guardian/caregiver. 
    Printed copy should be signed, scanned, and uploaded after discussion.
</p>


    
  
</div>




  </template>



  <style>

</style>