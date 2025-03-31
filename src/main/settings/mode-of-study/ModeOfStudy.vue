<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewModeOfStudy from "@/main/settings/mode-of-study/NewModeOfStudy.vue";
import AppModal from "@/components/AppModal.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {useStudyModeStore} from "@/main/settings/mode-of-study/store/studyMode.js";
import { useAbility } from '@casl/vue';

const { can } = useAbility()

const confirmationRef = ref(null);
const schoolStore = useSchoolStore()
const schoolList = ref([])
const modeStudyStore = useStudyModeStore()
const showMode = ref(false)
const thisDialog = ref(false)
const modeOfSchoolData = ref([])
const notificationStore = useNotificationStore()
const schoolNumber = ref("")
const deleteLoader = ref(false)

const modeOfStudyList = ref([])
const showEditModal = ref(false)
const namee = ref(null)
const errorMessage = ref(null)


const showModeOfStudy = () => {
  modeOfStudyList.value = ""
  showMode.value = true
  thisDialog.value=false

}

onMounted(
    () => {
      // getModeOfStudyInfo()
      schoolStore.fetchSchools()
    } )

const getModeOfStudyInfo = () =>{
  let data = {
    school_number:schoolNumber.value,
  }
  modeStudyStore.fetchModeOfStudy(data)
}



watch(
    () => modeStudyStore.modeOfStudyInfoResponse,
    async (data) => {
      modeOfSchoolData.value = data.data
    },
    {deep: true}
)

const editModeOfStudy = (unitInfo) => {
  modeOfStudyList.value = unitInfo
  namee.value = unitInfo.name
  showMode.value = true
}


const deleteModeOfStudy = async (id,name) => {
  deleteLoader.value = true;
const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
if (agreed) {
  modeStudyStore.deleteModeOfStudyData(id)
}

}

watch(
    () => modeStudyStore.deleteModeOfStudyResponse,
    async (data) => {
      deleteLoader.value = false
      notificationStore.successToast("Success", data.message)
      getModeOfStudyInfo()
    },
    {deep: true}
)
watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)

watch (
    () => modeStudyStore.updateModeOfStudyInfoResponse,
    async (data) => {
      if(data){
        showMode.value = false
        getModeOfStudyInfo()
      }
    }
)

watch (
    () => modeStudyStore.newUnitOfMeasureInfoResponse,
    async (data) => {
      if(data){
        getModeOfStudyInfo()
      }
    }
)

watch (
    () => modeStudyStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    }
)


watch (
    () => modeStudyStore.newModeOfStudyResponse,
    async (data) => {
      if(data){
        showMode.value = false
        getModeOfStudyInfo()
      }
    }
)

</script>
<template>
    <div>
    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="modeOfStudyList ? 'Edit Mode Of Study' : 'Add Mode Of Study'" v-model="showMode" lg>
      <NewModeOfStudy :modeOfStudyList="modeOfStudyList"></NewModeOfStudy>
    </AppModal>

    <!-- end  -->
    <div class="row mt-3">
    <div class="col-12">
        <div class="">
        <div class="" style="padding: 0;">
         <div class="containe mt-4">
           <div class="row">
              <div class="col-lg-12">
                <div class="">
                 <div class="">
                    <div class="row">
                    <div class="col-lg-4">
                      <div class="mb-2 ml-2">
                        <p style="font-size: 14px;margin-top: 2px;" class="mb-2">Mode Of Study</p>
                    <select
                        v-model="schoolNumber"
                        class="form-select form-select-sm" required
                        style="box-shadow: none;"
                        @change="getModeOfStudyInfo()"
                    >
                      <option disabled value="">--Select School--</option>
                      <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                      </option>
                    </select>
                  </div>
                       
                    </div>
    
                <div class="col-lg-4">
                 
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-4">
        </div>
        <div class="col-lg-8">
  
          <button v-if="can('create_mode_of_study','general')"  @click="showModeOfStudy" class="btn btn-primary btn-sm mb-2" style="float: right;">
          <small><i class="bi bi-plus"> Add New Mode Of Study</i></small></button></div>
       </div>
    
    <table
    id="datatable"
    class="table table-striped"
    style="font-size: 14px !important; width: 100%;"
    >
    <thead >
        <tr>
            <th>#</th>
        <th>Name</th>
        <th>Action</th>
        </tr>
    </thead>
    <tbody>
       
      <tr v-for="(list, index) in modeOfSchoolData" :key="index">
        <td>{{ index+1 }}</td>
      <td>{{ list?.name }}</td>
      <td>
        <button v-if="can('edit_mode_of_study','general')"  @click="editModeOfStudy(list)" data-bs-toggle="offcanvas" aria-controls="rolesDialogg">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button v-if="can('delete_mode_of_study','general')"  type="button" @click="deleteModeOfStudy(list.mode_of_study_number,list.name)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button>
      </td>
      </tr>
         
    </tbody>
    </table>
    </div>
    </div>
    </div>
    </div>
    </div>

    </div>
    </template>
    

    
    
    
    <style scoped>
    
    </style>