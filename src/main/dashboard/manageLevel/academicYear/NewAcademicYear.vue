<template>

  <div>
    <form @submit.prevent="addAcademicYear">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
        {{ errorMessage }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Level</small></label>
        <select
            disabled
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="level_number">
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in campusLevelInfo" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Study Period</small></label>
        <input
            @keypress="commons.onlyNumberValidator($event)"
            maxlength="1"
            type="text"
               style="outline: none 0 !important;
               box-shadow: none;"
              v-model="form.study_period"
              required
            class="form-control form-select-sm">
      </div>




      <div class="flex justify-content-end mt-4" style="width: 100%;">
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
import {onMounted, reactive, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
const commons = useCommonsStore()
const routerData = useRouter()
const campusStore = useCampusStore()
const campusLevel = routerData.currentRoute.value.query.l
const campusNumber = localStorage.getItem('campus_number');
const errorMessage = ref(null)
const campusLevelInfo = ref([])
const loader = ref(false)
const level_number = ref(null)

level_number.value = campusLevel

const form = reactive({
  study_period:"",
})

onMounted(
    () =>{
      campusStore.fetchCampusLevel(campusNumber)
    }
)

const addAcademicYear = () => {

}

watch(
    () => campusStore.campusLevelListResponse,
    async (data) => {
      if(data){
        campusLevelInfo.value = data.data
      }
    },
    {deep:true}
)

</script>

<style scoped>

</style>