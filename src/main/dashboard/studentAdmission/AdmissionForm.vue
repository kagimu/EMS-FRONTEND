<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import printJS from "print-js";
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const logo = ref(null)
const fullname = ref(null)
const adn = ref(null)
const admissionStore = useAdmissionStore()

const phoneNumber = ref(null)
const whatsappNo = ref(null)
const email = ref(null)
const website = ref(null)
const facebook = ref(null)
const twitter = ref(null)
const instagram = ref(null)
const student_number = ref(null)
const decodedAdmissionLetterData = ref([])
const school_number = ref(null)
const reportingDate = ref(null)
const reportDateModel = ref(false)
const decodedAdmissionLetterDataInfo = ref([])

const confirmationRef = ref(null);

const today = new Date().toISOString().split('T')[0]

const props = defineProps({
  schoolData: {},
  studentDataInfo:{}
});

onMounted(() => {
  getSchoolData()
  getStudentDataInfo()

  if(localStorage.getItem("entityInfo")){
    let draft = JSON.parse(localStorage.getItem("entityInfo"))
    facebook.value = draft?.facebook
    email.value = draft?.email
    twitter.value = draft?.twitter
    phoneNumber.value = draft?.phone
    whatsappNo.value =  draft?.whatsapp
    instagram.value = draft?.instagram
    website.value = draft?.website
  }

})


const setReportDate = () => {
  reportDateModel.value = true
}



const getStudentDataInfo = () => {
  let draft = props.studentDataInfo
  if(draft) {
    fullname.value = draft.student_surname + " " + draft.student_second_name + " " + draft.student_other_name
    adn.value = draft.adn
    student_number.value = draft.number
  }
  getDecodedData()
}


const getSchoolData = () => {
  if(props.schoolData){
    logo.value = props.schoolData.logo
    school_number.value = props.schoolData.number
  }
}

const getDecodedData = () => {
  let data = {
    student_number: student_number.value
  }
  admissionStore.decodeTemplates(data)
}



watch (
    () => admissionStore.decodeAdmissionLetterResponse,
    (data) => {
      if (data) {
        decodedAdmissionLetterData.value = data.phrase
        // alert(JSON.stringify(decodedAdmissionLetterData.value))
      }
    },
    { deep: true }
);


const setReportingDate = async (rpd) => {

  const agreed = await confirmationRef.value.confirm(`Are you sure you want to set the reporting date to ${rpd}?`);
  if (agreed) {
    // const confirmed = window.confirm(`Are you sure you want to set the reporting date to ${rpd}?`)
    // if (!confirmed) return
    reportingDate.value = rpd
    decodedAdmissionLetterDataInfo.value = decodedAdmissionLetterData.value.replace('{{REPORTING_DUE_DATE}}', rpd)
    decodedAdmissionLetterData.value = decodedAdmissionLetterDataInfo.value
    // reportDateModel.value = false
  }
}


watch (
  () => props.schoolData,
  (newData) => {
    if (newData) {
      getSchoolData()
    }
  },
  { deep: true }
);


watch (
    () => props.studentDataInfo,
    (newData) => {
      if (newData) {
        getStudentDataInfo()
      }
    },
    { deep: true }
);

// Download and print handlers
const printAdmissionLetter = () => {
  printJS({
    printable: "admission-letter",
    type: "html",
    targetStyles: ["*"],
    scanStyles: false,
    style: `
      body {
        font-family: Arial, sans-serif;
        color: #000;
        margin: 20px;
      }
    `,
  });
};

const downloadAdmissionLetter = () => {
  // Trigger printJS with download flag to save as PDF
  printJS({
    printable: "admission-letter",
    type: "html",
    targetStyles: ["*"],
    scanStyles: false,
    style: `
      body {
        font-family: Arial, sans-serif;
        color: #000;
        margin: 20px;
      }
    `,
    documentTitle: `Admission_Letter_${fullname.value}`,
    showModal: true,
  });
};


</script>
<template>

  <ConfirmationModal removeBorder="remove" ref="confirmationRef" />

<!--  {{decodedAdmissionLetterDataInfo}}-->
  <AppModal title="Set Reporting Date" v-model="reportDateModel" md class="app-modal">
    <form>
      <label class="mb-2 mt-2">Date :</label>
      <input  :min="today" type="date" class="form-control" required v-model="reportingDate">
      <button @click="setReportingDate(reportingDate)" class="btn btn-primary btn-sm mb-3 mt-3 px-3 text-sm" type="button" style="float: right">Set Date</button>
    </form>

  </AppModal>

<!--  download and Print-->
<div style="display: flex; justify-content: flex-end; padding: 0px 10px;">
  <button  @click="setReportDate"
          style="padding: 5px 10px;" class="btn btn-secondary mr-3">
    <i class="bi bi-calendar mr-1"></i>
    <span v-if="reportingDate === null">Set</span> <span  v-else>Reset</span>  Reporting Date
  </button>

  <button  v-if="reportingDate != null" @click="downloadAdmissionLetter" style="padding: 5px 10px; background-color: #2e2487; color: white; border: none; border-radius: 5px; cursor: pointer;">
    <i class="bi bi-printer"></i>  Print
  </button>

</div>


  <div id="admission-letter"  style="font-family: Arial, sans-serif; margin: 2px; color: #000;">
    <div style="padding: 20px; border-bottom: 4px solid black; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="display: flex; align-items: center; gap: 20px;">
        <img :src="schoolData.logo" alt="VES Logo" style="height: 110px;" />
        <div style="flex: 1;">
          <div style="font-size: 20px; font-weight: 800; color: #2e2487; text-transform: uppercase;">
            {{ schoolData.name }}
          </div>

          <div style="font-size: 15px; font-weight: 600; color: #00a0c6; margin: 6px 0;">
            DAY CARE &nbsp;•&nbsp; KINDERGARTEN &nbsp;•&nbsp; PRIMARY AND BOARDING SCHOOL
          </div>
          <div style="font-size: 14px; color: #000; line-height: 1.5;">
            Plot No. 15 & 355 Namirembe Rd. P.O. BOX 26278, KAMPALA-UGANDA<br />
            TEL: {{phoneNumber}}, {{whatsappNo}}, 0393-113082, 0393 518278, 0392 176077
          </div>

          <div style="font-size: 13px; font-style: italic; margin-top: 6px; color: #444;">
            <span>Email:</span> <a href="mailto:{{email}}" style="color: #2e2487; text-decoration: none;">{{email}}</a><br />
            <span>Website:</span> <a href="{{website}}" target="_blank" style="color: #2e2487; text-decoration: none;">{{website}}</a>
          </div>
        </div>
      </div>
    </div>

    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; font-size: 16px; max-width: 750px; margin: 0 auto; padding: 20px;">

      <h2 style="text-align: center; color: #2e2487; font-size: 26px; text-transform: uppercase; margin-bottom: 40px;">
        Admission Letter
      </h2>

      <div v-html="decodedAdmissionLetterData"></div>



      <div style="border-top: 3px solid black; margin-top: 50px; padding-top: 10px; font-size: 13px; font-style: italic; display: flex; justify-content: space-between; color: #555;">
        <div><strong>Motto:</strong> "God is Able"</div>
        <div><a href="{{website}}" target="_blank" style="color: #2e2487; text-decoration: none;">{{website}}</a></div>
      </div>

    </div>
  </div>




</template>


