<template>
  <div>

    <form @submit.prevent="addCampus">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Campus Name</small></label>
        <input type="text" v-model="form.name" required class="form-control">
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Phone</small></label>
        <input type="tel" v-model="form.phone" required class="form-control">
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Email</small></label>
        <input type="email" v-model="form.email" required class="form-control">
      </div>


      <div class="mb-2">
        <label class="textColor text-sm">Location</label>
        <textarea style="outline: none 0 !important; box-shadow: none; height: 60px" class="form-control noFocus form-control-sm" v-model="form.location" id="floatingTextarea2"></textarea>
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Class Levels</small></label>
        <select style="box-shadow: none;" class="form-select" v-model="form.level" aria-label="Default select example">
          <option value="">Select Level</option>
          <option value="kindergarten">Kindergarten</option>
          <option value="primary">Primary </option>
          <option value="secondary">Secondary</option>
          <option value="tertiary">Tertiary</option>
        </select>
      </div>


      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
            Save
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useRouter} from "vue-router";

const routerData = useRouter()
const errorMessage = ref(null)
const name = ref(null)
const loader = ref(false)

const campusStore = useCampusStore()


const form = reactive({
  name:null,
  email:null,
  phone:null,
  location:null,
  level:""
})


const addCampus = () =>{
  loader.value = true
  form.school_number = routerData.currentRoute.value.query.id
  campusStore.newCampusData(form)
}



onMounted(
    () =>{
      /* if(props.classNumber){
         classesStore.classDetails(props.classNumber)
       }*/
    }
)


/*
function saveCLass(){
  loader.value = true
  classError.value = ""
  let formData = {name: name.value, class_level_number:routerData.currentRoute.value.query.id}
  if(class_number.value) {
    formData.class_number = class_number.value
    classesStore.editClassData(formData)
  }else {
    classesStore.saveNewClass(formData)
  }
}



watch(
    () => classesStore.newCampusResponse,
    async (data) => {
      if(data){
        name.value = data.data.name
        class_number.value = data.data.number
      }
    },
    {deep:true}
)
*/




</script>

<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>