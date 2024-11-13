  <script setup>
  import { ref, watch, computed,onMounted } from "vue";
  import NewLessonPlanReference from "@/main/dashboard/curriculum/schemeOfWork/NewLessonPlanReference.vue";
  import { useSchemeOfWorkStore } from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
  import LessonPlanDetailsPdf from "@/main/dashboard/curriculum/schemeOfWork/LessonPlanDetailsPdf.vue";
  import useCommonsStore from "@/composables/useCommons.js";
  import AppModal from "@/components/AppModal.vue";
  import ListOfStudentsInStream from "./students/ListOfStudentsInStream.vue";

  const dialog = ref(false)
  const fullscreenMode = ref(false);
  const referenceDialog = ref(false);
  const exportLoader = ref(false);
  const lessonPlanRef = ref(null);
  const lessonPlanDetailsInfo = ref(null);
  const scheme_sub_topic_number = ref(null);
  const schemeOfWorkStore = useSchemeOfWorkStore();
  const commons = useCommonsStore();
  const schoolInfoData = ref([])
  
  const props = defineProps({
    lessonPlanInfo: {},
    schoolInfo:{}
  });
  
  const selectAll = ref(false);
  const selectedSteps = ref([]);
  const draftInfo = ref({})
  
  onMounted(() => {
    // schoolInfoData.value = props.schoolInfo
    filterLessonPlanData()
    filterDraftData()
   }
  )
  
  const filterDraftData = () =>{
    let draft = props.schoolInfo
    if(draft){
      draftInfo.value = draft
    }
  }

  
  const filterLessonPlanData = async () =>{
    let draft = props.lessonPlanInfo
    if(draft){
      scheme_sub_topic_number.value = draft.number;
      await schemeOfWorkStore.fetchLessonPlanDetails(draft.number);
    }
  }


  const exportLessonPlanPdf = () => {
    exportLoader.value = true;
    schemeOfWorkStore.exportPdf(commons.initializePdfData("Lesson Plan", lessonPlanRef.value.innerHTML));
  };
  
  const showHideReferenceForm = () => {
    referenceDialog.value = !referenceDialog.value;
  };
  
  const toggleAll = () => {
    if (selectAll.value) {
      selectedSteps.value = lessonPlanDetailsInfo.value.concepts.flatMap((concept) =>
        concept.steps.map((step) => step.number)
      );
    } else {
      selectedSteps.value = [];
    }
  };
  
  watch(
    () => props.lessonPlanInfo,
    async (data) => {
      if (data) {
        filterLessonPlanData()
      }
    }
  );
  
  watch(
    () => schemeOfWorkStore.lessonPlanResponse,
    (data) => {
      if (data) {
        lessonPlanDetailsInfo.value = data.data;
      }
    },
    { deep: true }
  );
  
  watch(
    () => schemeOfWorkStore.exportPdfResponse,
    (data) => {
      if (data) {
        exportLoader.value = false;
      }
    },
    { deep: true }
  );
  const studentModal = ref(false)

  const openStudentsModal = () => {
    studentModal.value = true
  }

  const toggleFullscreen = () => {
  if (!fullscreenMode.value) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Safari
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE11
      document.documentElement.msRequestFullscreen();
    }
    fullscreenMode.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
      document.msExitFullscreen();
    }
    fullscreenMode.value = false;
  }
};

// Watch fullscreen state change
document.addEventListener("fullscreenchange", () => {
  fullscreenMode.value = !!document.fullscreenElement;
});

  </script>

<template>

<AppModal v-model="studentModal"  title="" xl8>
     <ListOfStudentsInStream :schoolInfoData="draftInfo" :selectedStepNumbers="selectedSteps"></ListOfStudentsInStream>
</AppModal>


  <div class="text-sm">
    <div class="flex justify-content-between" style="border-bottom: 1px solid #dee2e6; padding-bottom: 15px; margin-bottom: 25px;">
      &nbsp;
      <button type="button" class="btn btn-sm buttonStyle btn-success mr-2" style="margin-right: 5px;" @click="exportLessonPlanPdf">
        <i style="font-size: 15px;" class="bi-file-earmark-pdf mr-2"></i>
        Export PDF
        <div class="spinner-border spinner-border-sm" role="status" v-if="exportLoader">
          <span class="visually-hidden">Loading...</span>
        </div>
      </button>
    </div>

    <div class="row mx-auto">
      <div class="col col-6">
        <table class="mt-4">
          <tr>
            <td style="width: 30%;"><b class="mr-5">Strand:</b></td>
            <td><div>{{ lessonPlanInfo.strand_name }}</div></td>
          </tr>
          <tr>
            <td><b class="mr-5">Topic:</b></td>
            <td><div>{{ lessonPlanInfo.topic_name }}</div></td>
          </tr>
          <tr>
            <td><b class="mr-5">Sub Topic:</b></td>
            <td><div class="mt-3 mb-2" style="font-size: 19px;"><span class="text-blue-900">{{ lessonPlanInfo.name }}</span></div></td>
          </tr>
          <tr>
            <td><b class="mr-5">Estimated Time:</b></td>
            <td><div>{{ lessonPlanInfo.estimated_time }} (Min)</div></td>
          </tr>
        </table>
      </div>
      <div class="col col-6">
        <button @click="showHideReferenceForm" type="button" class="btn btn-sm btn-secondary border-0 mt-2">
          <i style="font-size: 15px;" class="bi-plus mr-1"></i>
          {{ referenceDialog ? 'Hide Reference' : 'Add Reference' }}
        </button>

        <div v-if="referenceDialog">
          <new-lesson-plan-reference v-if="lessonPlanDetailsInfo" :lesson_plan_number="lessonPlanDetailsInfo.number"></new-lesson-plan-reference>
        </div>
        <div>
          <table style="width: 100%; margin-top: 3px" v-if="lessonPlanDetailsInfo">
            <thead>
              <tr>
                <td>#</td>
                <td>Code</td>
                <td>Name</td>
              </tr>
            </thead>
            <tr v-for="(reference, idx) in lessonPlanDetailsInfo.references" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td>{{ reference.code }}</td>
              <td>{{ reference.name }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div class="mt-10 mb-2" style="font-size: 18px;"><p>Lesson Plan / Concept(s)</p></div>

    <div class="row">
      <div class="col-lg-6 content">
        <div><b class="mr-5">Concept</b></div>
      </div>
      <div class="col-lg-6 content">
        <div>
          <b>Teaching steps</b>
         
          <button @click="openStudentsModal()" class="btn btn-outline-primary btn-sm ml-3 text-xs" v-if="selectedSteps.length > 1">Attendance <i class="bi bi-box-arrow-in-right mr-1"></i></button>
        </div>
      </div>
    </div>
    <hr />
   <div class="row">
      <div class="col-lg-6 "></div>
   <div class="col-lg-6 "><input type="checkbox" v-model="selectAll" @change="toggleAll" /> Select all</div></div> 
    <div v-if="lessonPlanDetailsInfo" v-for="(lesson, index) in lessonPlanDetailsInfo.concepts" :key="index">
      <div class="row">
          <!-- {{lesson}} -->
         
        <div class="col-lg-6 content">
          <div><b class="mr-5">{{ lesson.code }}.</b> {{ lesson.concept_name }}</div>
        </div>
        <div class="col-lg-6 content">
          <div class="ml-5 mt-2" v-for="(lsn, idx) in lesson.steps" :key="idx">

            <input type="checkbox" :value="lsn.number" v-model="selectedSteps" /> {{ lsn.code + ". " + lsn.step }}
            <button @click="openStudentsModal(lsn)" class="btn btn-outline-primary ml-3 btn-sm text-xs" v-if="selectedSteps.length === 1 && selectedSteps.includes(lsn.number)">Attendance <i class="bi bi-box-arrow-in-right mr-1"></i></button>
          </div>
        </div>
      </div>
      <hr />
    </div>

    <div style="display: none">
      <div ref="lessonPlanRef">
        <LessonPlanDetailsPdf :lessonPlanInfo="lessonPlanInfo"></LessonPlanDetailsPdf>
      </div>
    </div>
  </div>




</template>
  
  <style scoped>
  .buttonStyle {
    font-size: 12px;
    padding: 2px 7px;
  }

  .td{
    text-transform: capitalize !important;
  }
  .modal {
  display: none;
}

.modal.show {
  display: block;
}

.modal-dialog {
  margin-top: 2rem; /* Adjust this value as needed for more spacing from the top */
}
</style>
  