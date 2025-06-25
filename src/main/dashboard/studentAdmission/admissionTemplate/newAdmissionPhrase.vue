<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import useNotificationStore from "@/composables/useNotification.js"
import { useAbility } from '@casl/vue'
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js"
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js"
import TextAreaEditorCopy from "./TextAreaEditorCopy.vue";

const confirmationRef = ref(null)
const { can } = useAbility()
const notificationStore = useNotificationStore()
const schoolStore = useSchoolStore()
const buttonLoader = ref(false)
const admissionStore = useAdmissionStore()

const schoolList = ref([])
const school_number = ref("")

const formData = reactive({
  school_number: "",
  phrase: "",
  // principal_name: null,
  // principal_title: null
})

// Reference to the editor component
const textEditorRef = ref(null)

onMounted(() => {
  schoolStore.fetchSchools()
})

watch(
    () => schoolStore.schoolsResponse,
    (data) => {
      if (data) {
        schoolList.value = data.data
      }
    },
    { deep: true }
)

const createNewTemplate = () => {
  buttonLoader.value = true
  admissionStore.admissionLetterPhrase(formData)
}

watch(
    () => admissionStore.errorMessage,
    (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    }
)
watch(
    () => admissionStore.admissionLetterPhraseResponse,
    (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
      }
    }
)

const addTag = (tag) => {
  if (textEditorRef.value && formData.phrase != null) {
    textEditorRef.value.insertAtCursor(tag, formData.phrase)
  }
}

const tags = [
  '{{ADMISSION_DATE}}',
  '{{STUDENT_NAME}}',
  '{{SCHOOL_NAME}}',
  '{{REPORTING_DUE_DATE}}',
  '{{ADMISSION_NUMBER}}',
  '{{CAMPUS_NAME}}',
  '{{PRINCIPAL_NAME}}',
  '{{PRINCIPAL_TITLE}}',
]
</script>

<template>
  <div class="bg-white p-2 ">

    <form @submit.prevent="createNewTemplate">
      <!-- Principal Info -->
      <div class="row mb-4">
        <div class="col-lg-4">
          <!-- School Selection -->
          <div>
            <label class="text-sm font-medium text-gray-700">School <span class="text-danger">*</span></label>
            <select
                class="form-select form-select-sm shadow-none mt-1"
                v-model="formData.school_number"
                required
                @change="fetchCampuses(formData.school_number)"
            >
              <option disabled value="">-- Select School --</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">
                {{ list.name }}
              </option>
            </select>
          </div>

        </div>
<!--        <div class="col-lg-4">-->
<!--          <label class="text-sm font-medium text-gray-700">Principal Full Name <span class="text-danger">*</span></label>-->
<!--          <input-->
<!--              v-model="formData.principal_name"-->
<!--              type="text"-->
<!--              class="form-control form-control-sm shadow-none mt-1"-->
<!--              placeholder="e.g. Collins Mpiima"-->
<!--              required-->
<!--          />-->
<!--        </div>-->
<!--        <div class="col-lg-4">-->
<!--          <label class="text-sm font-medium text-gray-700">Principal Title <span class="text-danger">*</span></label>-->
<!--          <input-->
<!--              v-model="formData.principal_title"-->
<!--              type="text"-->
<!--              class="form-control form-control-sm shadow-none mt-1"-->
<!--              placeholder="e.g. Head Teacher"-->
<!--              required-->
<!--          />-->
<!--        </div>-->
      </div>

      <!-- Description (Phrase) -->
      <div class="mb-4">
        <label class="text-sm font-medium text-gray-700">Admission Description <span class="text-danger">*</span></label>
        <div class="border rounded-md bg-gray-50 p-2 mt-1">
          <text-area-editor-copy
              ref="textEditorRef"
              v-model:textResponse="formData.phrase"
              :textInfo="formData.phrase"
              textAreaMinHeight="min-height:350px"
              noBoarder="no"
          />

          <!-- Tags -->
          <div class="mt-2">
            <label class="text-xs text-gray-500">Insert Tags:</label>
            <div class="flex flex-wrap gap-2 mt-1">
              <span v-for="tag in tags" :key="tag" class="tag-chip" @click="addTag(tag)">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>



      <!-- Submit Button -->
      <div class="text-end mt-3">
        <button type="submit" class="btn btn-primary btn-sm d-inline-flex align-items-center">
          <i class="bi bi-save me-2"></i>
          Submit
          <span
              class="spinner-border spinner-border-sm ms-2"
              role="status"
              v-if="buttonLoader"
          ></span>
        </button>
      </div>

    </form>

  </div>
</template>


<style scoped>
.tags {
  cursor: pointer
}
.tag-chip {
  background-color: #f1f5f9;
  color: #374151;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 15px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease-in-out;
}

.tag-chip:hover {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}

.text-danger {
  color: #e3342f;
}
</style>
