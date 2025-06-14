<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewLevel from "@/main/settings/level/NewLevel.vue";
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import newAdmissionPhrase from "@/main/dashboard/studentAdmission/admissionTemplate/newAdmissionPhrase.vue";

const confirmationRef = ref(null);
const admissionPhrase = ref(false)
const { can } = useAbility()
const  notificationStore  = useNotificationStore()

const addNewPhrase = () => {
  admissionPhrase.value = true
}

</script>
<template>
  <div>


    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal title="" v-model="admissionPhrase" lg>
      <new-admission-phrase></new-admission-phrase>
    </AppModal>


    <div class="row">

      <div class="col-12">

        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Admission Template</div>
          <button
              v-if="can('add_level','general')"
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addNewPhrase">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add New
          </button>
        </div>



        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th scope="col" style="width: 30%;">Codes</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in levelList" :key="index">

          </tr>
          </tbody>
        </table>

      </div>
    </div>



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