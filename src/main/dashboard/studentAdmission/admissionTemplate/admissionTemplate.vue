<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import newAdmissionPhrase from "@/main/dashboard/studentAdmission/admissionTemplate/newAdmissionPhrase.vue";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
import TextAreaEditor from "./TextAreaEditor.vue";

const schoolStore = useSchoolStore()
const admissionStore = useAdmissionStore()
const confirmationRef = ref(null);
const admissionPhrase = ref(false)
const { can } = useAbility()
const  notificationStore  = useNotificationStore()
const schoolList = ref([])
const school_number = ref("")
const admissionLetterTempleteData = ref([])
const phrase = ref([])


const addNewPhrase = () => {
  admissionPhrase.value = true
}

onMounted(
     () => {
       schoolStore.fetchSchools()
    } )

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    },
    {deep: true}
)

const fetchTemplates = (schoolN) => {
  if(schoolN){
    let data = {
      school_number: schoolN
    }
    admissionStore.fetchAdmissionTemplates(data)
  }
}

watch(
    () => admissionStore.admissionLetterResponse,
    async (data) => {
      if (data) {
        admissionLetterTempleteData.value = data.phase
        phrase.value = data.phase
      }
    },
    {deep: true}
)

watch(
    () => admissionStore.admissionLetterPhraseResponse,
    (data) => {
      if (data) {
        admissionPhrase.value = false
        fetchTemplates(school_number.value)
      }
    }
)

</script>
<template>
  <div>


    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal title="Create Admission Template" v-model="admissionPhrase" xl6>
      <new-admission-phrase></new-admission-phrase>
    </AppModal>


    <div class="">Admission Template</div>
    <div class="row">
      <div class="col-12">

        <div class="flex justify-content-between mt-3">

            <div class="mb-2">
              <label class="text-sm">School <span class="star">*</span></label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="school_number"
                  @change="fetchTemplates(school_number)"
              >
                <option disabled value="">--Select School--</option>
                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>


          <div><button
              v-if="can('add_level','general')"
              type="button"  class="btn btn-sm btn-primary mb-2"  @click="addNewPhrase">
            <i style="font-size: 13px;"  class="bi-plus"></i>
            Add New
          </button>
          </div>
        </div>

        <div class="w-full">

          <div v-html="phrase"></div>

        </div>



      </div>
    </div>



  </div>

</template>



<style scoped>



</style>