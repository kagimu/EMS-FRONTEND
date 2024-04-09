<template>
    <div>

      <form @submit.prevent="addPromotionSetting">
  
        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
          {{ classError }}
        </div>
  
        <div class="mb-2">
          <label class="textColor"><small>Name</small></label>
          <input
              style="outline: none 0 !important; box-shadow: none;"
              type="text" v-model="form.name"
              required
              class="form-control form-select-sm">
        </div>

        <div class="mb-2">
            <label class="textColor"><small>School</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.school_number"
                    @change="fetchCampuses(form.school_number)"
            >
                <option disabled value="">Select School</option>
                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>


        <div class="mb-2">
            <label class="textColor"><small>Campus</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.campus_number" required
                    @change="fetchClasses(form.campus_number)"
            >
                <option disabled value="">Select campus</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>


        <div class="row">
            <div class="col-lg-6">
                <div class="mb-2">
            <label class="textColor"><small>Current Class</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.previous_class_number"
                    @change="fetchAcademicYear(form.previous_class_number)"
            >
                <option disabled value="">Select class</option>
                <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                </option>
            </select>
        </div>
            </div>
            <div class="col-lg-6">
                <div class="mb-2">
            <label class="textColor"><small>Next Class</small> </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.next_class_number"
                    @change="fetchAcademicYear(form.next_class_number)"
            >
                <option disabled value="">Select class</option>
                <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                </option>
            </select>
        </div>
           </div>

        </div>
        
  
        <div class="mb-2">
            <label class="textColor"><small>Type</small>  </label><br>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.type"
                  
            >
                <option disabled value="">Select class</option>
                <option value="promotion">Promotion
                </option>
                <option value="promotion">Admission
                </option>
            </select>
         
        </div>

       
  
        <div class="flex justify-content-end mt-2" style="width: 100%;">
          <button
              type="submit"
              class="btn btn-primary border-0">
              {{promNumber ? "Edit" : "Save"}}
            <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </span>
          </button>
        </div>
  
      </form>
  
  
    </div>
  </template>
  
  <script setup>
  
  import {onMounted, reactive, ref, watch,defineEmits} from "vue";
  import {useRouter} from "vue-router";
  import useCommonsStore from "@/composables/useCommons.js";
  import useNotificationStore from "@/composables/useNotification.js";

import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import {usePromotionStore} from "./store/promotion.js"

const emit = defineEmits();
  const classError = ref(null)
  const loader = ref(false)
  const commons = useCommonsStore()
  const  notificationStore  = useNotificationStore()
  const promNumber = ref("")
  const promotionStore = usePromotionStore()

const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const school_number = ref(null)
const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()


  const form = reactive({
    name:null,
    status:"ACTIVE",
    type:null,
    next_class_number:null,
    previous_class_number:null
  })
  
  
  const addPromotionSetting = () =>{
    loader.value = true
    promotionStore.newPromotionSetting(form)
  } 
  


  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}

const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
}


//fetchacadmicYear
const fetchAcademicYear = (campusN) =>{
// alert(campusN)
academicYearStore.fetchAcademicYearByCampus(campusN)
classStore.fetchClassStreams(campusN)

}




  watch(
    () => classStore.classStreams,
    async (data) => {
        if (data) {
          streamList.value = data.data
        }
    },
    {deep: true}
)




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
    () => campusStore.campusClassesResponse,
    async (data) => {
        if (data) {
            classList.value = data.data
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


watch(
    () => promotionStore.newPromotionSettingResponse,
    async (data) => {
        if (data) {
            form.name=null,
            form.status="ACTIVE",
            form.type=null,
            form.next_class_number=null,
            form.previous_class_number=null
            loader.value = false
          notificationStore.successToast("Success application submitted", data.message)
          promotionStore.fetchPromotionSetting()
        }
    },
    {deep: true}
)

watch(
    () => promotionStore.errorMessage,
    async (data) => {
          if (data) {
            form.name=null,
            form.status="ACTIVE",
            form.type=null,
            form.next_class_number=null,
            form.previous_class_number=null
            loader.value = false
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
)




  </script>
  
  <style scoped>
  .noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
  </style>