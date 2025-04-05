<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import PromotionSetupModal from "./PromotionSetupModal.vue";
import {usePromotionStore} from "./store/promotion.js"
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import PromotionValueInfo from "@/main/settings/promotion/PromotionValueInfo.vue";
import PromotionValueModel from "@/main/settings/promotion/PromotionValueModel.vue";

import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";

const studyPeriodStore = useStudyPeriodStore()
const levelStore = useLevelStore()
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const academicYearStore = useAcademicYearStore()
const academicYearList = ref([])
const studyPeriodList  = ref([])
const classStore = useClassesStore()
const streamList = ref([])
const curriculumList = ref([])
const levelList = ref([])

const confirmationRef = ref(null);
const promotionStore = usePromotionStore()
const notificationStore = useNotificationStore()
const promotionData = ref([])
const  shDialog = ref(false)
const  promotionSettingData = ref(null)
const  promotionSettingDialog = ref(false)
const  newPromotionValueDialog = ref(false)



const form = reactive({
  study_period_number: "",
  class_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  school_number:"",
  academic_year_number:"",
  curriculumNumber:"",
  level:""
})

onMounted(() => {
  schoolStore.fetchSchools()

  let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
  let defaultCampusNo =   localStorage.getItem("defaultCampusNo")
  let defaultCampusCurriculumNo =   localStorage.getItem("defaultCampusCurriculumNo")


 if(defaultSchoolNo){
    form.school_number = defaultSchoolNo
    fetchCampuses(form.school_number)
  }

  if(defaultCampusNo){
    form.campus_number = defaultCampusNo
    fetchClasses(form.campus_number)
  }

  if(defaultCampusCurriculumNo){
    form.curriculumNumber = defaultCampusCurriculumNo
    fetchCampusLevel(form.curriculumNumber)
  }
  promotionStore.fetchPromotionSetting()
  }
)


const openModal = () =>{
shDialog.value = true
}

watch(
  () => promotionStore.PromotionSettingResponse,
  async (data) => {
      if (data) {
        shDialog.value = false
        promotionData.value = data.data
        // notificationStore.successToast("Success application submitted", data.message)
      }
  },
  {deep: true}
)

watch(
  () => promotionStore.errorMessage,
  async (data) => {
        if (data) {
          shDialog.value = false
            notificationStore.errorToast("Error", data.message)
        }
  },
  {deep: true}
)

const promotionSettingInfo = ref(null)

watch(
  () => promotionStore.newPromotionSettingResponse,
  async (data) => {
      if (data) {
        shDialog.value = false
        await promotionStore.fetchPromotionSetting()
       
      }
  }
)

const openPromotionValueDialog = (prom) => {
  promotionSettingData.value = prom
  promotionSettingDialog.value = true
}

const newPromotionValue = (prom) => {
  promotionSettingData.value = prom
  newPromotionValueDialog.value = true
}


watch(
    () => promotionStore.newPromotionSettingValueResponse,
    async (data) => {
      if (data) {
        newPromotionValueDialog.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)

}


const fetchClasses = (campus_level_number) => {
  levelStore.fetchCampusCurriculum(campus_level_number)

}

watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    }
)

const fetchStreamsAndStudyPeriod = (classNumber) =>{
  let sData = {
    campus_number:form.campus_number,
    class_number:classNumber,
    campus_curriculum_number:form.curriculumNumber
  }
  classStore.fetchClassStreams(sData)

  studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:classNumber,
        school_number:form.school_number
      } )


}


watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)


watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)

const fetchCampusLevel = (curriculumNumber) => {
  classStore.fetchCampusLevel(curriculumNumber)
}



const fetchLevelClasses = (levelNumber) => {
  let data = {
    school_number:form.school_number,
    campus_level_number:levelNumber
  }
  campusStore.fetchClassesBySchool(data)
  academicYearStore.fetchAcademicYearByLevel(levelNumber)
}

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

const filterByStudyPeriod = () => {
let data = {
  study_period_number:form.study_period_number
}
  promotionStore.fetchPromotionSetting(data)
}


watch(
    () => classStore.classStreams,
    async (data) => {
      if (data) {
        streamList.value = data.data
      }
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

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    },
    {deep: true}
)


watch(
    () => campusStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep: true}
)

</script>


<template>
    <div>

      <AppModal title="Add Promotion Value" v-model="newPromotionValueDialog" xl4>
        <PromotionValueModel :promotion_settings_number="promotionSettingData?.promotion_settings_number" :studyPeriodNumber="form.study_period_number"></PromotionValueModel>
      </AppModal>

      <AppModal title="Promotion Value" v-model="promotionSettingDialog" xl2>
        <PromotionValueInfo :promotionSettingData="promotionSettingData"></PromotionValueInfo>
      </AppModal>


      <AppModal title="Auto Promotion Setting" v-model="shDialog" xl2>
        <PromotionSetupModal :promotionSettingInfo="promotionSettingInfo"></PromotionSetupModal>
      </AppModal>

      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
  
  <div>

    <div>
      <div class="row mt-4">
        <div class="row">
          <div class="col-3">
            <div class="mb-2">
              <!-- <label class="text-sm"><small>School</small> </label> -->
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.school_number"
                  @change="fetchCampuses(form.school_number)"
              >
                <option disabled  value="">-filter by School-</option>
                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <div class="mb-2">
              <!-- <label class="text-sm"><small>Campus</small>  </label> -->
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.campus_number" required
                  @change="fetchClasses(form.campus_number)"
              >
                <option disabled value="">-filter by Campus-</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.curriculumNumber"
                  @change="fetchCampusLevel(form.curriculumNumber)"
              >
                <option disabled value="" >--Select Curriculum--</option>
                <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
              </select>
            </div>
          </div>
          <div class="col-3" >
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.level"
                  @change="fetchLevelClasses(form.level)"
              >
                <option disabled value="">-Filter by level-</option>
                <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
              </select>
            </div>
          </div>

          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.academic_year_number"
                  @change=""
              >
                <option disabled value="">-filter AcademicYear-</option>
                <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
              </select>
            </div>
          </div>

          <div class="col-3">
            <div class="mb-2">
              <!-- {{ classList }} -->
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.class_number"
                  @change="fetchStreamsAndStudyPeriod(form.class_number)"
              >
                <option disabled value="">-filter by class-</option>
                <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
                  {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
                </option>
              </select>
            </div>
          </div>
          <div class="col-3">
            <div class="mb-2">
              <!-- <label class="text-sm"><small>Stream</small> </label> -->
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.stream_number"
                  @change="filterByStream()"
              >
                <option disabled value="">-filter by Stream-</option>
                <option v-for="(slist, index) in streamList" :key="index" :value="slist.stream_number">{{ slist.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.study_period_number"
                  @change="filterByStudyPeriod()"
              >
                <option disabled value="">filter by Study period -</option>
                <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="row">
  
        <div class="col-12">
              <div class="flex justify-content-between mt-3">
                <div class="ml-4">Settings</div>
                <button @click="openModal()"
                 type="button"  class="btn btn-sm buttonStyle btn-primary mr-2" >
                  New Setup
                </button>
              </div>
  
  
  
              <table class="table table-hover caption-top mt-5 table-striped" style="font-size: 13px;">
                <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th>Current / Next Class</th>
                  <th>Study Period</th>
                  <th>Curriculum</th>
                  <th>Status</th>
                   <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
              
                <tr v-for="(prom,index) in promotionData" :key="index">
                <td>{{ (index + 1) }}</td>
                <td>{{ prom.name }}</td>
                 <td>


                   <div class="border-b border-gray-100 pb-2">
                     <span class="text-xs">Current Class:</span><br />
                     {{prom.previous_class.name}} [{{ prom.previous_class.abbreviation	 }}]
                   </div>

                   <div class="border-b border-gray-100 pb-2">
                     <span class="text-xs">Next Class:</span><br />
                     {{ prom.next_class.name }} [{{ prom.next_class.abbreviation	 }}]
                   </div>


                 </td>
                 <td>{{ prom.study_period.name }}</td>
                 <td>{{ prom.curriculum.name }}</td>
                 <td>{{ prom.status }}</td>
                 <td>
<!--                    <button style="color: red;" @click="deletePromoSetting(prom)"><i class="bi bi-trash"></i></button>-->
                    <button
                        @click="newPromotionValue(prom)"
                        class="rounded text-success font-normal px-2 mb-2"
                        style="border: 1px solid #198754;">
                          <i class="bi bi-plus mr-2"></i>
                          Promotion Value
                    </button>

                   <button
                       @click="openPromotionValueDialog(prom)"
                       class="rounded text-[#0d6efd] font-normal px-2"
                       style="border: 1px solid #0d6efd;">
                     <i class="bi bi-eye mr-2"></i>
                     Promotion Value
                   </button>
                 </td>
                </tr>
                </tbody>
              </table>
  
            </div>
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