<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import NewStudyPeriodGroup from "@/main/dashboard/manageLevel/studyPeriod/NewStudyPeriodGroup.vue";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import { useAbility } from '@casl/vue';
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

const { can } = useAbility()

const routerData = useRouter()
const newStudyPeriodDialog = ref( false)
const schoolNumber = routerData.currentRoute.value.query.sch
const studyPeriodGroupNameList = ref( [])
const  notificationStore  = useNotificationStore()
const deletionLoader = ref( undefined)
const editMode = ref( false)
const studyPeriodStore = useStudyPeriodStore()
const studyPerionGroupNameData = ref([])

onMounted(
    () => {
      studyPeriodStore.fetchStudyPeriodGroupName(schoolNumber)
    }
)


const addStudyPeriod = () => {
 studyPerionGroupNameData.value = ""
  newStudyPeriodDialog.value = true
  editMode.value = false
}

const openEditModal = (listData) =>{
  studyPerionGroupNameData.value = listData
  editMode.value = true
  newStudyPeriodDialog.value = true
}


const deleteThisData = async (styPeriod, idx) => {
  deletionLoader.value = idx

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+styPeriod.name);
if (agreed) {
  let data = {
    study_name_number:styPeriod.study_period_name_number
  }
//   alert(styPeriod.study_period_name_number)
  studyPeriodStore.deleteStudyPeriodGroupName(data)
}


}



watch(
    () => studyPeriodStore.studyPeriodGroupNameResponse,
    async (data) => {
      if(data){
        studyPeriodGroupNameList.value = data.data
      }
    }
)

watch(
    () => studyPeriodStore.newStudyPeriodGroupName,
    async (data) => {
      if(data){
        studyPeriodStore.fetchStudyPeriodGroupName(schoolNumber)
      }
    }
)


watch(
    () => studyPeriodStore.deleteStudyPeriodGroupNameResponse,
    async (data) => {
      if(data){
        deletionLoader.value = false
        notificationStore.successToast("Success", data.message)
        studyPeriodStore.fetchStudyPeriodGroupName(schoolNumber)
      }
    }
)


watch(
    () => studyPeriodStore.editStudyPeriodGroupNameResponse,
    async (data) => {
      if(data){
        newStudyPeriodDialog.value = false
        studyPeriodStore.fetchStudyPeriodGroupName(schoolNumber)
      }
    }
)


watch(
    () => studyPeriodStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)



</script>
<template>
  <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode ? 'Edit Study Period Group Name' : 'Add Study Period Group Name'" v-model="newStudyPeriodDialog"  xl2>
      <new-study-period-group :studyPerionGroupNameData="studyPerionGroupNameData"></new-study-period-group>
    </AppModal>


    <div class="flex justify-content-between mt-10 mb-4 mr-3">
      &nbsp;
      <button v-if="can('create_study_period_group_name','manage')"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addStudyPeriod">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Study Period Group Name
      </button>
    </div>


    <table class="table table-hover caption-top text-sm" style="font-size: 14px;" v-if="can('view_study_period_group_name','manage')">
      <thead>
      <tr>
        <th class="w-[2%]" scope="col">#</th>
        <th class="w-[70%]"  scope="col">Name</th>
        <th class="w-[28%]"  scope="col">Action</th>
      </tr>
      </thead>
      <tbody>

      <tr v-for="(list, index) in studyPeriodGroupNameList" :key="index">
        <td>{{ index+1 }}</td>
        <td>{{ list.name }}</td>
        <td>
            <button @click="openEditModal(list)">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
            </button>
            &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
            <button type="button" @click="deleteThisData(list)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
            </button>
        </td>

      </tr>



      </tbody>
    </table>





  </div>
</template>



<style scoped>

</style>