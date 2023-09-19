<template>
  <div>

    <form @submit.prevent="addCampus">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="row">
        <div :class="campus_number ? 'col-12' : 'col-6'">
          <div class="mx-auto" style="width: 95%;">
          <div class="mb-2">
            <label class="textColor"><small>Campus Name</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="text"
                v-model="form.name"
                required
                class="form-control form-select-sm">
          </div>

          <div class="mb-2">
            <label class="textColor"><small>Phone</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="tel"
                v-model="form.phone"
                required
                class="form-control form-select-sm">
          </div>

          <div class="mb-2">
            <label class="textColor"><small>Email</small></label>
            <input
                style="outline: none 0 !important; box-shadow: none;"
                type="email"
                v-model="form.email"
                required
                class="form-control form-select-sm">
          </div>


          <div class="mb-2">
            <label class="textColor text-sm">Location</label>
            <textarea
                style="outline: none 0 !important; box-shadow: none; height: 60px"
                class="form-control noFocus form-control-sm"
                v-model="form.location"
                id="floatingTextarea2"></textarea>
          </div>
          </div>
        </div>
        <div v-if="!campus_number"  class="col-6">
          <div class="mx-auto" style="width: 95%;">
          <label class="textColor mt-3 mb-2"><small>Select Class Levels</small></label>
          <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
            <li class="list-group-item" v-for="(lvl,idx) in levelList">
              <input
                  v-model="form.level"
                  style="outline: none 0 !important; box-shadow: none;"
                  class="form-check-input me-1" type="checkbox" :value="lvl" :id="idx">
              <label class="form-check-label cursor-pointer" :for="idx">{{lvl}}</label>
            </li>

          </ul>
          </div>
        </div>
      </div>



      <div class="flex justify-content-end" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0">
          {{campus_number ? "Edit":"Save"}}
          <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
        </button>
      </div>

    </form>


  </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useRouter} from "vue-router";

const routerData = useRouter()
const errorMessage = ref(null)
const name = ref(null)
const loader = ref(false)


const campusStore = useCampusStore()

const levelList = ref(
    [
        'Kindergarten',
        'Primary',
        'Secondary',
        'Vocational',
        'Tertiary'
        ]
)

const campus_number = ref(null)

const form = reactive({
  name:null,
  email:null,
  phone:null,
  location:null,
  level:[]
})


const addCampus = () =>{
  loader.value = true
  form.school_number = routerData.currentRoute.value.query.id
  if(campus_number.value){
    form.campus_number = campus_number.value
    campusStore.editCampusData(form)
  }else {
    campusStore.newCampusData(form)
  }

}



onMounted(
    () =>{
      /* if(props.classNumber){
         classesStore.classDetails(props.classNumber)
       }*/
    }
)


watch(
    () => campusStore.campusInfoResponse,
    async (data) => {
      if(data){
        form.name = data.data.name
        form.phone = data.data.phone
        form.email = data.data.email
        form.location = data.data.location
        campus_number.value = data.data.number

        let arr = []
        data.data.levels.forEach(lst => {
          arr.push(lst.name)
        })

        form.level = arr

      }
    },
    {deep:true}
)


watch(
    () => campusStore.editCampusResponse,
    async (data) => {
      if(data){
        loader.value = false
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