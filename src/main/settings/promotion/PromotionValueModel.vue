<template>
    <div>

      <form @submit.prevent="addPromotionValue">
  
        <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
          {{ classError }}
        </div>

        <div class="mb-2">
            <label class="textColor"><small>Promotion Setting</small>  </label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.promotion_setting_number" required
            >
                <option disabled value="">Select Promotion Setting</option>
                <option v-for="(list, index) in promoSettingList" :key="index" :value="list.number">{{ list.name }}
                </option>
            </select>
        </div>

        <div class="mb-2">
          <label class="textColor"><small>Score</small></label>
          <input
              style="outline: none 0 !important; box-shadow: none;"
              type="number" v-model="form.score"
              required
              class="form-control form-select-sm">
        </div>

  
        <div class="mb-2">
            <label class="textColor"><small>Type</small>  </label><br>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="form.type"
                  
            >
                <option disabled value="">Select Type</option>
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
              {{levelNumber ? "Edit" : "Save"}}
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
  const promotionStore = usePromotionStore()

const promoSettingList = ref([])


  const form = reactive({
    type:null,
    score:null,
    promotion_setting_number:null,
  })
  
  
  const addPromotionValue = () =>{
    loader.value = true
    promotionStore.newPromotionSettingValue(form)
  } 
  



watch(
    () => promotionStore.newPromotionSettingValueResponse,
    async (data) => {
        if (data) {
          notificationStore.successToast("Success application submitted", data.message)
          promotionStore.fetchPromotionSettingValue()
        }
    },
    {deep: true}
)

watch(
    () => promotionStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}

)


onMounted(() => {
    promotionStore.fetchPromotionSetting()
    }
)
watch(
    () => promotionStore.PromotionSettingResponse,
    async (data) => {
        if (data) {
          promoSettingList.value = data.data
          // notificationStore.s`uccessToast("Success application submitted", data.message)
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