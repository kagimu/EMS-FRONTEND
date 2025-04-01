<script setup>

import {watch, onMounted, reactive, ref} from "vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
import useNotificationStore from "@/composables/useNotification.js";
import VueDatePicker from "@vuepic/vue-datepicker";
import ComboBox from "@/components/ComboBox.vue";

const classError = ref(null)
const name = ref(null)
const school_number = ref(null)
const loader = ref(false)
const curriculumList = ref([])
const curriculumStore = useCurriculumStore()

const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()
let entityN = localStorage.getItem("entity_number")
const emit = defineEmits(["closeDialog"]);

const form = reactive({
  name:null,
  commencement_date:null,
  curriculum:[],
  entity_number:entityN
})

const clearSchoolForm = () => {
  form.name = null
  form.commencement_date = null
  form.curriculum = []
  school_number.value = null
}

defineExpose({
  clearSchoolForm
});


const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
}

const addSchool = () =>{
  loader.value = true
  if(school_number.value){
    form.school_number = school_number.value
    schoolStore.editSchoolData(form)
  }else {
    // alert(JSON.stringify(form))
    schoolStore.newSchoolData(form)
  }

}

onMounted(
    async () => {
      await  curriculumStore.fetchCurriculum()
    }
)



watch (
    () => schoolStore.schoolInfoResponse,
    async (data) => {
      if(data){
        let info = data.data
        form.name = info.name
        form.commencement_date = info.commencement_date
        school_number.value = info.number

        let arr = []
        info.school_curriculum.forEach(lst => {
          arr.push(lst.number)
        })
        form.curriculum = arr
      }
    },
    {deep:true}
)

watch (
    () => schoolStore.newSchoolResponse,
    async (data) => {
      if(data){
        form.name = null
        loader.value = false
      }
    },
    {deep:true}
)


watch (
    () => schoolStore.editSchoolResponse,
    async (data) => {
      if(data){
        loader.value = false
      }
    },
    {deep:true}
)

watch (
    () => schoolStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => curriculumStore.curriculumDataResponse,
    async (data) => {
      if(data){
        let draft = data?.data 
        if(draft && (draft?.length > 0)){
          curriculumList.value = []
          let arr = []
          draft?.forEach(lst => {
            arr.push({text:lst?.name,value:lst?.number})
          })
          curriculumList.value = arr
        }
        
      }
    },
    {deep:true}
)

</script>

<template>
  <div>

    <form @submit.prevent="addSchool">
      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="text-sm text-sm">School Nameff</label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text"
            v-model="form.name"
            required
            class="form-control form-control-sm">
      </div>

      <div class="mb-2">
        <label class="text-sm text-sm">Commencement Date</label>
        <VueDatePicker
            text-input
            auto-apply
            style="font-size: 7px;"
            v-model="form.commencement_date"
            :preview-format="format"
            :teleport="true"
        ></VueDatePicker>
      </div>



      <div class="mb-2">
        <label class="text-sm mt-3 mb-2"><small>Select Curriculum(s) to adopt to this School</small></label>
        <combo-box
            v-model:optionResponse="form.curriculum"
            :optionList="curriculumList"
            :optionDraft="form?.curriculum"
        ></combo-box>
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="button"
            class="btn btn-danger border-0 mr-2"
            @click="$emit('closeDialog')">
          Cancel
        </button>
        <button
            type="submit"
            class="btn btn-primary border-0">
            {{school_number ? "Edit":"Save"}}
          <div v-if="loader" class="spinner-border text-light spinner-border-sm" role="status">
              <span class="visually-hidden">&nbsp;Loading...</span>
            </div>
        </button>
      </div>

    </form>


  </div>
</template>



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>