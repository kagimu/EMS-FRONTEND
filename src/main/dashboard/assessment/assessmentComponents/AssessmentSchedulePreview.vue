<script setup>
import {onMounted, ref} from "vue";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js";
import api from "@/config/api.js";

const selectedTab = ref('marking-guide')
const markingGuidePdf = ref(null)
const assessmentMetricNumber = ref(null)
const draftData = ref(null)
const filesList = ref(null)
const assessmentScriptPdf = ref(null)
const assessmentStore= useAssessmentStore()


const switchTabs = (tab) => {
  selectedTab.value = tab
}

const props = defineProps({
  assessmentScheduleData:{}
})

onMounted(() => {
  filterDraft()
})


const filterDraft = async () => {
  const draft = props.assessmentScheduleData;
  if (draft) {
    draftData.value = draft;
    // alert(JSON.stringify(draft.number))
    // assessment_metric_number
    await fetchAssessmentMetricPreview(draft.number)

    try {
      const [markingGuideBase64, assessmentScriptBase64] = await Promise.all([
        previewForm(draft.marking_guide),
        previewForm(draft.assessment_script)
      ]);

      markingGuidePdf.value = markingGuideBase64;
      assessmentScriptPdf.value = assessmentScriptBase64;
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

const  fetchAssessmentMetricPreview = async (data) => {
  await api.get("main/assessments/script-marking-guide?assessment_metric_number="+ data)
      .then((response) => {
        if(response){
          filesList.value = response.data.data
        }

      })
      .catch((error) => {
        if(error) {
          // loading.value = false;
          // notification.errorToast("Error", error.response.data.message);
          // emit("formErrorResponse", error.response.data.message);
        }
      });
}

const previewForm = (imageLink) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(imageLink);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    } catch (error) {
      console.error('Error fetching image:', error);
      reject(error);
    }
  });
};


const selectAssessmentMetricPreview = async (list) => {
  if (list) {
      let path = api.defaults.baseURL + "/attachments/download/"
      assessmentMetricNumber.value = list?.marking_guide_number;
      // markingGuidePdf.value = path + list?.marking_guide_number;
      // assessmentScriptPdf.value = path + list?.script_number;

    try {

      const [markingGuideBase64, assessmentScriptBase64] = await Promise.all([
        previewForm(path + list?.marking_guide_number),
        previewForm(path + list?.script_number)
      ]);

      markingGuidePdf.value = markingGuideBase64;
      assessmentScriptPdf.value = assessmentScriptBase64;
    } catch (error) {
      console.error('Error:', error);
    }
  }
}



</script>

<template>
  <div>
    <div class="">
      <div class="text-sm grid grid-cols-2 gap-2">
        <div>
          <div class="mb-3">
            <div class="text-gray-600 font-bold">Name:</div>
            <div class="text-gray-600">{{draftData?.metric_name}}</div>
          </div>
          <div class="mb-3">
            <div class="text-gray-600 font-bold">Description:</div>
            <div class="text-gray-600">{{draftData?.description}}</div>
          </div>
          <div class="mb-3">
            <div class="text-gray-600 font-bold">Max Score:</div>
            <div class="text-gray-600">{{draftData?.max_score}}</div>
          </div>
        </div>

        <div>

          <div class="mb-3">
            <div class="text-gray-600 font-bold">Scheduled On:</div>
            <div class="text-gray-600">{{draftData?.scheduled_on}}</div>
          </div>
          <div class="mb-3">
            <div class="text-gray-600 font-bold">Assessment Area:</div>
            <div class="text-gray-600">{{draftData?.assessment_area}}</div>
          </div>
          <div class="mb-3">
            <div class="text-gray-600 font-bold">Comment:</div>
            <div class="text-gray-600">{{draftData?.require_comment === "Yes" ? "Mandatory" : "Optional"}}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-2 mt-10">
        <div class="col-span-4">
          <div class="border rounded-md mt-9">
            <div
                v-for="(list, index) in filesList"
                :key="index"
                class="text-gray-600 text-sm p-2 cursor-pointer hover:bg-[#f1f1f1] hover:rounded-md"
                :class="[
                    ((index + 1) < filesList.length ? 'border-b' : ''),
                    (assessmentMetricNumber === list?.marking_guide_number ? 'bg-[#f1f8fe]  rounded-md' : '')
                    ]"
                @click="selectAssessmentMetricPreview(list)"
            >
              File {{index + 1}}
            </div>
          </div>
        </div>
        <div class="col-span-8">
          <div>
            <div class="flex border-b mt-1">

              <div
                  :class="selectedTab === 'assessment-script' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb] bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'"
                  class="cursor-pointer text-sm rounded-t-md ml-1 mr-1"
                  @click="switchTabs('assessment-script')">
                <div class="py-1 px-3">
                  <i class="bi bi-box-arrow-in-right mr-1"></i>
                  Assessment Script
                </div>
              </div>
              
              <div
                  :class="selectedTab === 'marking-guide' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb] bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'"
                  class="cursor-pointer text-sm rounded-t-md ml-1 mr-1"
                  @click="switchTabs('marking-guide')">
                <div class="py-1 px-3">
                  <i class="bi bi-box-arrow-in-right mr-1"></i>
                  Assessment Guide
                </div>
              </div>

             

            </div>

            <div v-if="selectedTab === 'marking-guide'">
              <div>
                <iframe v-if="markingGuidePdf" id="pdf" :src="markingGuidePdf+'#toolbar=0&navpanes=0&scrollbar=0'" class="pdf"></iframe>
              </div>
            </div>
            <div v-if="selectedTab === 'assessment-script'">
              <div>
                <iframe v-if="assessmentScriptPdf" id="pdf" :src="assessmentScriptPdf+'#toolbar=0&navpanes=0&scrollbar=0'" class="pdf"></iframe>
              </div>
            </div>


          </div>
        </div>
      </div>



    </div>
  </div>
</template>

<style scoped>
.pdf{
  width: 100%;
  height: 550px;
  overflow-x: auto;
  border:1px solid #b1b1b1;
  margin-bottom: 15px;
}
</style>