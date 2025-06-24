<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAbility } from '@casl/vue';
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
import TextAreaEditor from "./TextAreaEditor.vue";

const confirmationRef = ref(null);
const { can } = useAbility()
const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const buttonLoader = ref(false)
const admissionStore = useAdmissionStore()

const schoolList = ref([])
const school_number = ref("")

const formData = reactive({
  school_number: "",
  phrase: null,
  principal_name:null,
  principal_title:null
})


onMounted(() => {
      schoolStore.fetchSchools()
    }
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    },
    {deep: true}
)

const createNewTemplate = () => {
  buttonLoader.value = true
 admissionStore.admissionLetterPhrase(formData)
}

watch(
    () => admissionStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error", data.message)
      }
    }
)
watch(
    () => admissionStore.admissionLetterPhraseResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    }
)
</script>
<template>
  <div>

    <form @submit.prevent="createNewTemplate">

      <div class="text-gray-600">

        <div>
          <div class="mb-2">
            <label class="text-sm">School <span class="star">*</span></label>
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="formData.school_number"
                @change="fetchCampuses(formData.school_number)"
            >
              <option disabled value="">--Select School--</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
              </option>
            </select>
          </div>

<!--          <div class="mb-2">-->
<!--            <label class="text-sm">Phrase <span class="star">*</span></label>-->
<!--            <textarea-->
<!--                v-model="formData.phrase"-->
<!--                style="font-size: 12px; color: #4e5866;"-->
<!--                class="form-control shadow-none"-->
<!--                rows="4"-->
<!--                required-->
<!--            >-->

<!--            </textarea>-->
<!--          </div>-->
<!--          <div v-html="formData.phrase"></div>-->
          <div class="p-0 border rounded-md mb-2">
            <div class="text-[11px] text-gray-600 mt-[1px] ml-[7px]">Description</div>
            <div class="w-full">
              <text-area-editor
                  v-model:textResponse="formData.phrase"
                  :textInfo="formData.phrase"
                  textAreaMinHeight="min-h-[130px]"
                  noBoarder="no"
              ></text-area-editor>
            </div>

          </div>

          <div class="mb-2 row">
<!--            <div class="col-lg-4">-->
<!--              <label class="text-sm"><small>Specify Due Date For Reporting To School </small></label>-->
<!--              <input  type="text" required class="form-control">-->
<!--            </div>-->
            <div class="col-lg-4">
              <label class="text-sm"><small>Principal Full Names </small></label>
              <input v-model="formData.principal_name" type="text" required class="form-control">
            </div>
            <div class="col-lg-4">
              <label class="text-sm"><small>Principal Title</small></label>
              <input v-model="formData.principal_title"  type="text" required class="form-control">
            </div>

          </div>


      <div class="flex justify-content-end mt-2">
        <button type="submit" class="btn btn-primary border-0 btn-sm">
          <i class="bi bi-save"></i>
          Submit
          <span
              style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
              v-if="buttonLoader"
              role="status">
                          <span class="visually-hidden">Loading...</span>
                        </span>
        </button>
      </div>

        </div>
      </div>
    </form>



  </div>
</template>



<style scoped>

.linkStyle {
  text-decoration: none;
  color: #1867c0;
  font-size: 16px;
}

.linkStyle:hover {
  font-size: 16px;
  color: green;
  text-decoration: underline;
}

.viewButtonStyle{
  background-color: #2c6fb9;
  color: #ffffff;
  border-radius: 0;
}

.viewButtonStyle:hover {
  background-color: #0557b4;
  color: #ffffff;
}

</style>