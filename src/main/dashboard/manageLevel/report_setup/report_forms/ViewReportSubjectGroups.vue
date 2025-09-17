<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAssessmentStore } from "@/main/dashboard/assessment/store/assessment.js"
import { useAbility } from '@casl/vue';
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import AppModal from "@/components/AppModal.vue";
import ManageReportDetails from "@/main/dashboard/manageLevel/report_setup/report_forms/ManageReportDetails.vue";
import AddReportGroupSubject from "@/main/dashboard/manageLevel/report_setup/report_forms/AddReportGroupSubject.vue";

const confirmationRef = ref(null);

const notificationStore = useNotificationStore()
const { can } = useAbility()
const assessmentStore = useAssessmentStore()
const subjectReportGroupList = ref([])
const showGroupSubjectModal = ref(false)
const group_subject_number = ref(null)


const buttonLoader = ref(false)
let errorMessage = ref(null)

const props = defineProps({
  reportSettingNum:String
})



onMounted( () => {
  getReportSettingsNum()
})

const getReportSettingsNum = () => {
  if (props.reportSettingNum) {
    let reportSettingN = props.reportSettingNum
    assessmentStore.fetchReportSubjectGroup(reportSettingN)
  }
}

watch(() => props.reportSettingNum,
    async (data) => {
      if (data) {
        getReportSettingsNum()
      }
    }
)

watch(() => assessmentStore.errorMessage, async (data) => {
  if (data) {
    errorMessage.value = data.message
    buttonLoader.value = false
    notificationStore.errorToast("Error", data.message)
  }
})

watch(() => assessmentStore.reportSubjectGroupResponse, async (data) => {
  if (data) {
    subjectReportGroupList.value = data.data
  }
})

const deleteSubjectGroup = async (subjectGroupNumber,groupName) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete " + groupName + " ?");
  if (agreed) {
    assessmentStore.deleteReportSubjectGroup(subjectGroupNumber)
  }
}

watch(() => assessmentStore.deleteReportSubjectGroupResponse, async (data) => {
  if (data) {
    notificationStore.successToast("Success", data.message)
    getReportSettingsNum()
  }
})

const removeSubject = async (subjectGroupNumber,subjectName) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to remove "+subjectName + " ?");
  if (agreed) {
    await assessmentStore.deleteReportSubject(subjectGroupNumber)
  }
}

watch(() => assessmentStore.deleteReportSubjectResponse, async (data) => {
  if (data) {
    notificationStore.successToast("Success", data.message)
    getReportSettingsNum()
  }
})

const addSubject = (groupN) => {
  showGroupSubjectModal.value = true
  group_subject_number.value = groupN
}

watch(() => assessmentStore.newReportSubjectToGroupResponse, async (data) => {
  if (data) {
    showGroupSubjectModal.value = false
  }
})

</script>


<template>
<!--  {{subjectReportGroupList}}-->
  <AppModal title="Add Subject To Report" v-model="showGroupSubjectModal" md>
    <AddReportGroupSubject :group_subject_number="group_subject_number"></AddReportGroupSubject>
  </AppModal>

  <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
  <table border="1" cellspacing="0" cellpadding="6" class="table table-bordered table-striped">
    <thead>
    <tr>
      <th>Group</th>
      <th>Subjects</th>
      <th>Action</th>
    </tr>
    </thead>
    <tbody>
    <template v-for="group in subjectReportGroupList" :key="group.number">
      <tr v-for="(subject, index) in group.assessment_areas" :key="subject.number">
        <!-- Show group name only in first subject row -->
        <td v-if="index === 0" :rowspan="group.assessment_areas.length">
          {{ group.name }}
        </td>

        <!-- Subject name and remove icon -->
        <td>
          {{ subject.name }}
          <i
              class="bi bi-x-circle ml-2"
              style="color: red; cursor: pointer"
              @click="removeSubject(subject.number, subject.name)"
          ></i>
        </td>

        <!-- Trash icon only in first subject row -->
        <td v-if="index === 0" :rowspan="group.assessment_areas.length">
          <button
              class="btn btn-outline-primary btn-sm mb-2"
              @click="addSubject(group.number)"
          >
            Add Subject
            </button>
          <br/>
          <i
              class="bi bi-trash ml-2"
              style="cursor: pointer;color:red"
              @click="deleteSubjectGroup(group.number,group.name)"
          ></i>
        </td>
      </tr>

      <!-- Optional separator row after each group -->
      <tr>
        <td colspan="3"></td>
      </tr>
    </template>
    </tbody>
  </table>
</template>


<style scoped>
.text-sm {
  font-size: 14px;
}
</style>
