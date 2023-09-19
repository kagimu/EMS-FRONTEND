<template>
  <div>

    <form @submit.prevent="addSchool">
      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="textColor text-sm">School Name</label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text"
            v-model="form.name"
            required
            class="form-control form-control-sm">
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
            {{school_number ? "Edit":"Save"}}
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>

<script setup>

import {watch, onMounted, reactive, ref} from "vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const classError = ref(null)
const name = ref(null)
const school_number = ref(null)
const loader = ref(false)

const schoolStore = useSchoolStore()


const form = reactive({
  name:null,
})


const addSchool = () =>{
  loader.value = true
  if(school_number.value){
    form.school_number = school_number.value
    schoolStore.editSchoolData(form)
  }else {
    schoolStore.newSchoolData(form)
  }

}



onMounted(
    () =>{
      /* if(props.classNumber){
         classesStore.classDetails(props.classNumber)
       }*/
    }
)





watch (
    () => schoolStore.schoolInfoResponse,
    async (data) => {
      if(data){
        form.name = data.data.name
        school_number.value = data.data.number
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
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
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