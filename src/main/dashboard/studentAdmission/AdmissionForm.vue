<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import printJS from "print-js";

const logo = ref(null)
const fullname = ref(null)
const adn = ref(null)

const phoneNumber = ref(null)
const whatsappNo = ref(null)
const email = ref(null)
const website = ref(null)
const facebook = ref(null)
const twitter = ref(null)
const instagram = ref(null)

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

const getStudentDataInfo = () => {
  let draft = props.studentDataInfo
  if(draft) {
    fullname.value = draft.student_surname + " " + draft.student_second_name + " " + draft.student_other_name
    adn.value = draft.adn
  }
}


const getSchoolData = () => {
  if(props.schoolData){
    logo.value = props.schoolData.logo
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

<!--  download and Print-->
<div style="display: flex; justify-content: flex-end; padding: 0px 10px;">
  <button @click="downloadAdmissionLetter" style="padding: 5px 10px; background-color: #2e2487; color: white; border: none; border-radius: 5px; cursor: pointer;">
    <i class="bi bi-printer"></i> Print
  </button>
<!--  <button @click="printAdmissionLetter" style="padding: 10px 20px; background-color: #2e2487; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">-->
<!--    Print-->
<!--  </button>-->
</div>


  <div id="admission-letter"  style="font-family: Arial, sans-serif; margin: 2px; color: #000;">
    <!-- Header -->
    <div style="padding: 20px; border-bottom: 4px solid black; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="display: flex; align-items: center; gap: 20px;">
        <!-- School Logo -->
        <img :src="schoolData.logo" alt="VES Logo" style="height: 110px;" />

        <!-- School Info -->
        <div style="flex: 1;">
          <!-- School Name -->
          <div style="font-size: 20px; font-weight: 800; color: #2e2487; text-transform: uppercase;">
            {{ schoolData.name }}
          </div>

          <!-- Tagline -->
          <div style="font-size: 15px; font-weight: 600; color: #00a0c6; margin: 6px 0;">
            DAY CARE &nbsp;•&nbsp; KINDERGARTEN &nbsp;•&nbsp; PRIMARY AND BOARDING SCHOOL
          </div>

          <!-- Address & Contacts -->
          <div style="font-size: 14px; color: #000; line-height: 1.5;">
            Plot No. 15 & 355 Namirembe Rd. P.O. BOX 26278, KAMPALA-UGANDA<br />
            TEL: {{phoneNumber}}, {{whatsappNo}}, 0393-113082, 0393 518278, 0392 176077
          </div>

          <!-- Email & Website -->
          <div style="font-size: 13px; font-style: italic; margin-top: 6px; color: #444;">
            <span>Email:</span> <a href="mailto:{{email}}" style="color: #2e2487; text-decoration: none;">{{email}}</a><br />
            <span>Website:</span> <a href="{{website}}" target="_blank" style="color: #2e2487; text-decoration: none;">{{website}}</a>
          </div>
        </div>
      </div>
    </div>
    <!-- Title -->
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; font-size: 16px; max-width: 750px; margin: 0 auto; padding: 20px;">

      <h2 style="text-align: center; color: #2e2487; font-size: 26px; text-transform: uppercase; margin-bottom: 40px;">
        Admission Letter
      </h2>

      <!-- Info -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 15px;">
        <div><strong>Date of Admission:</strong> 06-Dec-2024</div>
        <div><strong>Admission No: {{adn}}</strong> </div>
      </div>

      <!-- Salutation -->
      <div style="margin-bottom: 25px;">
        <p>Dear <strong><span style="text-transform: capitalize">{{fullname}}</span></strong>,</p>
      </div>

      <!-- Body -->
      <div style="margin-bottom: 30px;">
        <p>
          We are delighted to inform you that you have been offered admission to <strong> {{ schoolData.name }}</strong> as a student in our esteemed institution.
        </p>

        <p>
          Kindly report to the school administration office on or before <strong>06-Dec-2024</strong> for orientation and further guidance on your academic journey at   {{ schoolData.name }}. Please carry your admission number (<strong>{{adn}}</strong>) and all relevant documents as communicated in the admission requirements.
        </p>
      </div>

      <!-- Conclusion -->
      <div style="margin-bottom: 40px;">
        <p>
          We warmly welcome you to   {{ schoolData.name }} and look forward to supporting your academic and personal development.
        </p>
      </div>

      <!-- Signature -->
      <div>
        <p style="font-style: italic; color: #555;">We are victorious because God is able.</p>
        <br />
        <strong>Dr. Barbara Ofwono Buyondo</strong><br />
        <span>Principal, Victorious Education Services</span>
      </div>

      <!-- Footer -->
      <div style="border-top: 3px solid black; margin-top: 50px; padding-top: 10px; font-size: 13px; font-style: italic; display: flex; justify-content: space-between; color: #555;">
        <div><strong>Motto:</strong> "God is Able"</div>
        <div><a href="{{website}}" target="_blank" style="color: #2e2487; text-decoration: none;">{{website}}</a></div>
      </div>

    </div>
  </div>


</template>


