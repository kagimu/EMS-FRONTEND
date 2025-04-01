<script setup>
import {ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";


const uploadError = ref(null)
const markingGuideRef = ref(null)
const ScriptRef = ref(null)
const loader = ref(false)
const notificationStore  = useNotificationStore()



const assessmentStore= useAssessmentStore()

const props = defineProps({
  metricNumber: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  }
})


function saveFile(){
  loader.value = true
  uploadError.value = null
  const formData = new FormData();
  formData.set("marking-guide-file", markingGuideRef.value.files[0]);
  formData.set("script-file", ScriptRef.value.files[0]);
  formData.set("assessment_metric_number", props.metricNumber);
  assessmentStore.uploadMarkingGuideFile(formData)

}



watch(
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)



</script>
<template>
  <div>
    <form ref="form" @submit.prevent="saveFile">

      <div>


        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="uploadError">
          {{ uploadError }}
        </div>
        <div class="mb-3">
          <label for="formFileSm" class="form-label">Script</label>
          <input
              ref="ScriptRef"
              class="form-control form-control-sm noFocus"
              id="formFileSm"
              accept=".pdf,application/pdf"
              type="file">
        </div>

        
        <div class="mb-3">
          <label for="formFileSm" class="form-label">Assessment Guide</label>
          <input
              ref="markingGuideRef"
              class="form-control form-control-sm noFocus"
              id="formFileSm"
              accept=".pdf,application/pdf"
              type="file">
        </div>


      



      </div>

      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
          <small>Save</small>
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </span>
        </button>
      </div>

    </form>
  </div>
</template>



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>