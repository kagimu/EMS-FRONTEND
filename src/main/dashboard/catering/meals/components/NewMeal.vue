<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const  mealStore  = useMealStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()

const levelNumber = ref("")

const form = reactive({
  code:null,
  name:null,
})


const clearLevelForm = () => {
  form.code = null
  form.name = null
  levelNumber.value = null
}

defineExpose({
  clearLevelForm
});


const addMeal = () =>{
  loader.value = true
  mealStore.createNewMeal(form)
}



onMounted(
    () =>{

    }
)


watch(
    () => mealStore.newMealResponse,
    async (data) => {
      if(data){
        // form.name = null
        // form.code = null
        loader.value = false
      }
    }
)


watch(
    () => mealStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)


</script>
<template>
  <div>

    <form @submit.prevent="addMeal">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Code</small></label>
        <input
            @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10"
            type="text"
            style="outline: none 0 !important;
               box-shadow: none;"
            v-model="form.code"
            required
            class="form-control form-select-sm">
      </div>


      <div class="mb-2">
        <label class="textColor"><small>Level Name</small></label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.name"
            required
            class="form-control form-select-sm">
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



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>