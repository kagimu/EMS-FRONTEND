<script setup>

import NewLessonPlanReference from "@/main/dashboard/curriculum/schemeOfWork/NewLessonPlanReference.vue";
import {onMounted, ref, watch} from "vue";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import LessonPlanDetailsPdf from "@/main/dashboard/curriculum/schemeOfWork/LessonPlanDetailsPdf.vue";
import useCommonsStore from "@/composables/useCommons.js";
import api from "@/config/api.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import useNotificationStore from "@/composables/useNotification.js";
import EditLessonPlanReference from "@/main/dashboard/curriculum/schemeOfWork/EditLessonPlanReference.vue";


const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()

const referenceDialog = ref(false)
const exportLoader = ref(false)
const lessonPlanRef = ref(null)
const lessonPlanDetailsInfo = ref(null)
const scheme_sub_topic_number = ref(null)
const confirmationRef = ref(null);
const deletionLoader = ref(undefined)
const referenceInfo = ref(null)

const schemeOfWorkStore = useSchemeOfWorkStore()
const lessonPlanNumber = ref(null)
const planStatus = ref(null)


const props = defineProps({
  lessonPlanInfo: {}
})


const exportLessonPlanPdf = () => {

  exportLoader.value = true
  schemeOfWorkStore.exportPdf(commons.initializePdfData("Lesson Plan", lessonPlanRef.value.innerHTML));
}

onMounted(() => {
  fetchLessonInfo()
})


watch(
    () => props.lessonPlanInfo,
    async (data) => {
      if (data) {
        await fetchLessonInfo()
      }
    }
)

const fetchLessonInfo = async () => {
  lessonPlanDetailsInfo.value = null
  scheme_sub_topic_number.value = props.lessonPlanInfo.number
  await schemeOfWorkStore.fetchLessonPlanDetails(props.lessonPlanInfo.number)
}

const showHideReferenceForm = () => {
  referenceDialog.value = !referenceDialog.value
}


watch(
    () => schemeOfWorkStore.lessonPlanResponse,
    async (data) => {
      if (data) {
        lessonPlanDetailsInfo.value = data.data
        lessonPlanNumber.value = data.data.number
        planStatus.value = data.data.status

      }
    },
    {deep: true}
)

watch(
    () => schemeOfWorkStore.exportPdfResponse,
    async (data) => {
      if(data){
        exportLoader.value = false
      }
    },
    {deep:true}
)


watch(
    () => schemeOfWorkStore.addReferenceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        await fetchLessonInfo()
      }
    }
)


watch(
    () => schemeOfWorkStore.updateReferenceResponse,
    async (data) => {
      if(data){
        referenceInfo.value = null
        referenceDialog.value = false
        notificationStore.successToast("Success",data.message)
        await fetchLessonInfo()
      }
    }
)



const editReference = async (data) => {
  referenceDialog.value = true
  referenceInfo.value = data
}

const deleteReference = async (data, index) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+data.name);
  if (agreed) {
    deletionLoader.value = index
    await deleteNarrativeReport(data.lesson_plan_reference_number	)
  }

}


const  deleteNarrativeReport = async (number) => {
  await api.delete("main/lesson-plan/delete-reference/"+number)
      .then((response) => {
        if(response){
          notificationStore.successToast("Success",response.message)
          fetchLessonInfo()
        }

      })
      .catch((error) => {
        if(error && error.response) {
          notificationStore.errorToast("Error",error.response.data.message)
        }
      });
}

const deactivateLessonPlan = async () => {
  const agreed = await confirmationRef.value.confirm("This action will deactivate the Lesson plan and cannot be reversed. Are you sure you want to continue?");
  if (agreed) {
    await deactivateLessonPlanStatus(lessonPlanNumber.value)
  }
}



const  deactivateLessonPlanStatus = async (data) => {
  return await api.patch("main/lesson-plan/invalidate/"+data)
      .then((response) => {
        if(response && response.data){
          notificationStore.successToast("Success", response.data.message)
          planStatus.value = "INACTIVE"
        }
      })
      .catch((response) => {
        if(response && response.response){
          notificationStore.errorToast("Error",response.response.data.message)
        }
      })
}


</script>

<template>

<div class="text-sm">
  <ConfirmationModal removeBorder="remove" ref="confirmationRef"></ConfirmationModal>

  <div class="flex justify-content-end" style="border-bottom: 1px solid #dee2e6; padding-bottom: 15px; margin-bottom: 25px;">

<span v-if="planStatus !== 'INACTIVE'">
<button type="button"  class="btn btn-sm  btn-danger mr-2 m-0 py-0"  @click="deactivateLessonPlan">
<small class="m-0 p-0">Deactivate lesson plan</small>
</button>
</span>

<span v-else class="m-2">
  <span class="alert alert-danger p-1">This Lesson Plan was Invalidated</span>
</span>

  <button type="button"  class="btn btn-sm buttonStyle btn-success mr-2" style="margin-right: 5px;"  @click="exportLessonPlanPdf">
    <i style="font-size: 15px;"  class="bi-file-earmark-pdf mr-2"></i>
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
        <td> <div> {{lessonPlanInfo.strand_name}}</div></td>
      </tr>
      <tr>
        <td><b class="mr-5">Topic:</b></td>
        <td><div> {{lessonPlanInfo.topic_name}}</div></td>
      </tr>
      <tr>
        <td>
          <b class="mr-5">Sub Topic:</b>
        </td>
        <td><div class="mt-3 mb-2" style="font-size: 19px;">  <span class="text-blue-900">{{lessonPlanInfo.name}}</span></div> </td>
      </tr>
      <tr>
        <td>
          <b class="mr-5">Estimated Time:</b>
        </td>
        <td> <div> {{lessonPlanInfo.estimated_time}} (Min)</div></td>
      </tr>
    </table>

  </div>
    <div class="col col-6">
        <button
                @click="showHideReferenceForm"
                type="button"
                class="btn btn-sm btn-secondary border-0 mt-2">
            <i style="font-size: 15px;" class="bi-plus mr-1"></i>
            {{ referenceDialog ? 'Hide Reference ' : 'Add Reference' }}
        </button>

        <div v-if="referenceDialog">

            <new-lesson-plan-reference
                v-if="lessonPlanDetailsInfo && !referenceInfo"
                :lesson_plan_number="lessonPlanDetailsInfo?.number"></new-lesson-plan-reference>

          <edit-lesson-plan-reference
              v-else
              :lesson_plan_number="lessonPlanDetailsInfo?.number"
              :referenceInfo="referenceInfo"
          ></edit-lesson-plan-reference>
        </div>
        <div class="border border-1 mt-3 rounded-lg p-3" >
            <table style="width: 100%; margin-top: 3px"  v-if="lessonPlanDetailsInfo">
                <thead>

                <tr>
<!--                    <td>#</td>-->
                    <td>Code</td>
                    <td>Name</td>
                    <td>Action</td>
                </tr>

                </thead>

                <tr v-for="(reference,idx) in lessonPlanDetailsInfo.references" :key="idx">
<!--                    <td>{{ idx + 1 }}</td>-->
                    <td>{{ reference.code }}</td>
                    <td>{{ reference.name }}</td>
                    <td>
                      <div>
                        <i
                            style="font-size: 13px;"
                            data-bs-toggle="modal" data-bs-target="#levelModal"
                            class="bi-pencil mr-2 cursor-pointer" @click="editReference(reference)"></i>
                            <i
                          style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteReference(reference, idx)"></i>
                        <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === idx">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

</div>




  <div class="mt-10 mb-2" style="font-size: 18px;"><p>Lesson Plan / Concept(s)</p></div>
   <div></div>
  <div class="row">
    <div class="col-lg-6 content">
      <div> <b class="mr-5">Concept</b></div>
    </div>
    <div class="col-lg-6 content">
      <div><b>Teaching steps</b></div>
    </div>
  </div>
  <hr />
  <div v-if="lessonPlanDetailsInfo" v-for="(lesson, index) in lessonPlanDetailsInfo.concepts" :key="index">

    <div class="row">
      <div class="col-lg-6 content">
        <div> <b class="mr-5">{{lesson.code}}.</b> {{lesson.concept_name}}</div>
      </div>
      <div class="col-lg-6 content">
        <div class="ml-5 mt-2" v-for="(lsn, idx) in lesson.steps" :key="idx">
          {{lsn.code+". "+lsn.step}}
        </div>
      </div>
    </div>
    <hr />

  </div>

  <div style="display: none">
    <div ref="lessonPlanRef">
      <LessonPlanDetailsPdf
          :lessonPlanInfo="lessonPlanInfo"
      ></LessonPlanDetailsPdf>
    </div>
  </div>


</div>
</template>



<style scoped>
.buttonStyle{
  font-size: 12px;
  padding: 2px 7px;
}
</style>