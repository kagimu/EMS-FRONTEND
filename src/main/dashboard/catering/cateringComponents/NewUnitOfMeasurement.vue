<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import { useAbility } from '@casl/vue';
import useCommonsStore from "@/composables/useCommons.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const { can } = useAbility()
const errorMessage = ref(null)

const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const cateringStore = useCateringStore()
const commons = useCommonsStore()
const schoolStore = useSchoolStore()
const schoolList = ref([])
const unit_of_measure_number = ref(null)

const props = defineProps(
    {
      unitOfMeasureList:{}
    }
)


const form = reactive({
  code:null,
  name:null,
  abbreviation:null,
  school_number:null
})

onMounted(() => {
      schoolStore.fetchSchools()
      checkUnitOfMeasureInfo()
    }
)

watch (
    () => props.unitOfMeasureList,
    async (data) => {
      if(data){
        checkUnitOfMeasureInfo()
      }
    }
)

const checkUnitOfMeasureInfo = () => {
  let draft = props.unitOfMeasureList
  if(draft){
        form.code = draft?.code
        form.name = draft?.name
        form.abbreviation = draft?.abbreviation
        form.school_number = draft?.school_number
        unit_of_measure_number.value = draft?.unit_of_measure_number
  }
}


const unitMeasurement = () => {


  buttonLoader.value = true
  form.code = parseInt(form.code)

  if(unit_of_measure_number.value){
    form.unit_of_measure_number = unit_of_measure_number.value
    cateringStore.updateUnitOfMeasure(form)
  }else {
    cateringStore.newUnitOfMeasureInfo(form)
  }

}
watch (
    () => cateringStore.newUnitOfMeasureInfoResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        form.code = null
        form.name = null
        form.abbreviation = null
        form.school_number = null
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => cateringStore.updateUnitOfMeasureInfoResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => cateringStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    }
)

watch(() => form.code, (newValue, oldValue) => {
  if (newValue !== null && isNaN(newValue)) {
    form.code = oldValue
    notificationStore.errorToast("Warning", "Code must be a number.")
  }
})


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)

</script>
<template>
    <div>
<form @submit.prevent="unitMeasurement">
<div class="">




  <div class="mb-2">
  <label class="textColor"><small>School</small> </label>
  <select
      v-model="form.school_number"
      class="form-select form-select-sm" required
      style="box-shadow: none;"
  >
    <option disabled :value="null">--Select School--</option>
    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
    </option>
  </select>
</div>
         <div class="mb-2">
            <label class="textColor"><small>Code</small></label>
            <input
            v-model="form.code"
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            @paste.prevent
            type="text"
            required class="form-control shadow-none">
        </div>




        <div class="mb-2">
            <label class="textColor"><small>ABBREVIATION</small></label>
            <input v-model="form.abbreviation"  type="text" required class="form-control shadow-none">
        </div>




            <div class="mb-2">
            <label class="textColor"><small>Name</small></label>
            <input v-model="form.name"   type="text" required class="form-control shadow-none">


    </div>




<div class="flex flex-grow justify-between mt-4">
  &nbsp;
    <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-10">
      <i class="bi bi-arrow-right-circle"></i>&nbsp;<small class="ml-1">{{unit_of_measure_number ? "Update" : "submit"}}</small>
    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
        <span class="visually-hidden">Loading...</span>
    </div></button>
</div>

</div>

</form>
    </div>
</template>
 
