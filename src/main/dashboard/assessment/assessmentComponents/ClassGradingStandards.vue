<script setup>
import {onMounted,ref, watch} from "vue";
import NewGradeStandard from "@/main/dashboard/assessment/assessmentComponents/NewGradeStandard.vue"
import { useAssessmentStore } from "../store/assessment";
import { useAbility } from '@casl/vue';
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import GradeStandardDetails from "@/main/dashboard/assessment/assessmentComponents/GradeStandardDetails.vue";

const { can } = useAbility()
const assessmentStore = useAssessmentStore()
const levelStore = useLevelStore()
const campusStore = useCampusStore()
const notificationStore = useNotificationStore()

const gradeStandardData = ref([])
const errorMessage = ref(null)
const showGradeStandardModal = ref(false)
const gradeStandardInfoModel = ref(false)
const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
const class_number = ref(null)
const campusCurriculumDataInfo = ref(null)
const campusClassList = ref(null)
const namee = ref(null)
const gradeDataList = ref([])
const editModel = ref(false)
const deletionLoader = ref(undefined)



onMounted(
    async () => {
        doFetchClassGradingStandard()
        campusStore.fetchClassesBySchool(schoolNumber)
    } )

const doFetchClassGradingStandard = () => {
  let data = {
    school_number:schoolNumber,
    class_number:class_number.value
  }
  assessmentStore.fetchClassGradeStandardList(data)
}

const addGradingStandard = () => {
  gradeDataList.value = ""
  editModel.value = false
  showGradeStandardModal.value = true
}



watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
      }
    }
)




watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)



watch (
    () => assessmentStore.classGradeStandardResponse,
    async (data) => {
      if(data){



   //     gradeStandardData.value = data.data



        let draft = data.data
        let accountJsn = {};
        let accountObj = [];

        let className = "";

        draft.map((accountData,i) => {
          let _className = "";

          if (className !== accountData.class.name) {
            className = accountData.class.name;
            _className = className;
          } else {
            _className = "";
          }

          accountJsn = {
            code:(i+1),
            className: _className ? (_className + "["+ accountData.class.abbreviation+"]") : "",
            class_number:accountData.class.number,
            scale_name:accountData.scale.scale_name,
            scale_number:accountData.scale.scale_number,
            grading_standard_name:accountData.grading_standard.name,
            grading_standard_number:accountData.grading_standard.number,
            status:accountData.status,
          };
          accountObj.push(accountJsn);
        }
        )

        gradeStandardData.value = accountObj

      }
    }
)
watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
      }
    }
)

watch(
    () => assessmentStore.newGradeStandardResponse,
    async (data) => {
      if(data){
        showGradeStandardModal.value = false
        doFetchClassGradingStandard()
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => assessmentStore.updateGradeStandardResponse,
    async (data) => {
      if(data){
        showGradeStandardModal.value = false
        doFetchClassGradingStandard()
        notificationStore.successToast("Success", data.message)
      }
    }
)

const changeGradingStatus = (gradeList, index) => {
  if(!confirm("Are you sure, you want to change status of: " + gradeList.name)){
    return
  }


  deletionLoader.value = index
 let data = {grading_standard_number:gradeList.number, status:gradeList.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}
  assessmentStore.changeStatusGradeStandard(data)
}

const showGradeStandardDetails = (gradeList) => {
  gradeStandardInfoModel.value = true
  gradeDataList.value = gradeList
}

const editThisData = (gradeList) => {
  editModel.value = true
  gradeDataList.value = gradeList
  namee.value = gradeList.name
  showGradeStandardModal.value = true
}

const deleteThisData = (info,index) => {

  if(!confirm("Are you sure, you want to delete: " + info.name)){
    return
  }

  deletionLoader.value = index

  assessmentStore.deleteGradeStandard(info.number)

}



watch(
    () => assessmentStore.changeStatusGradingScaleResponse,
    async (data) => {
      if(data){
        doFetchClassGradingStandard()
        deletionLoader.value = false
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => assessmentStore.deleteGradingScaleResponse,
    async (data) => {
      if(data){
        doFetchClassGradingStandard()
        deletionLoader.value = false
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
        notificationStore.errorToast("Error",data.message)
      }
    })


</script>
<template>
    <div>

      <AppModal  title="Grade Standard Details" v-model="gradeStandardInfoModel" lg>
        <GradeStandardDetails :gradeDataList="gradeDataList"></GradeStandardDetails>
      </AppModal>


      <AppModal  :title="editModel ? 'Edit Grade Standard ' + namee:'New Grade Standard'" v-model="showGradeStandardModal" lg>
        <NewGradeStandard :gradeDataList="gradeDataList"></NewGradeStandard>
      </AppModal>


     <div class="px-2 border-b mt-5">
           <div class="text-gray-600">
             <div>Select Default Grade Standards to a class</div>
           </div>
     </div>


      <div class="mt-[50px]">
        <div class="row mx-auto">


          <div class="col-lg-4 mb-2">
            <select
                class="form-select form-select-sm shadow-none" required
                v-model="class_number"
                @change="doFetchClassGradingStandard"
            >
              <option disabled :value=null>--Select Class--</option>
              <option value="">All</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
            </select>
          </div>



      </div>
      </div>


      <div class="mt-10">
        <table
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Class</th>
          <th>Grading Standard</th>
          <th>Status</th>
          <th>Make Default</th>
<!--          <th class="w-[10%]">Actions</th>-->
        </tr>
        </thead>
        <tbody>
            <tr v-for="(gradeList, index) in gradeStandardData " :key="index">
              <td>{{ gradeList.code }}</td>
              <td>{{ gradeList.className }}</td>
              <td>{{ gradeList.grading_standard_name }}</td>
              <td>
                <span class="border px-2 rounded-sm">
                  {{ gradeList.status }}
                </span>
              </td>
              <td>
                <button
                    @click="changeGradingStatus(gradeList, index)"
                    type="button"
                    :class="gradeList.status === 'ACTIVE' ? 'bg-[red]' : 'bg-[#0d6efd]'"
                    class="text-white text-xs px-2 rounded-sm">
                  {{ gradeList.status === "ACTIVE" ? "Inactivate" : "Activate" }}
                </button>
              </td>

<!--              <td>
                <button @click="showGradeStandardDetails(gradeList)" class="mr-1">
                  <i class="bi bi-eye text-[#135f9a] text-[14px]"></i>
                </button>
                <button @click="editThisData(gradeList)" class="mr-1">
                  <i class="bi bi-pencil-square text-[#135f9a] text-[14px]"></i>
                </button>
              <button type="button" @click="deleteThisData(gradeList, index)">
                <i class="bi bi-trash text-[14px]" style="color:rgb(201, 10, 10)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </button>
              </td>-->
            </tr>
        </tbody>
      </table>
      </div>
    </div>
    
    
    
    </template>
    

    
    <style scoped>
    
    </style>