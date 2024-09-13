<template>
  <div>

    <form @submit.prevent="addCalendar">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="error">
        {{ error }}
      </div>

      <div class="mb-2">
        <label class="text-sm"><small>Calendar Name</small></label>
        <input
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.name"
            required
            class="form-control form-select-sm">
      </div>

      <div class="mb-2">
        <label class="text-sm"><small>Description</small></label>
        <textarea
            style="outline: none 0 !important; box-shadow: none;"
            type="text" v-model="form.description"
            required
            class="form-control form-select-sm"></textarea>
      </div>

        <div class="row">
            <div class="col">
                <input class="form-control" type="date" v-model="form.start_date" placeholder="Start date">
            </div>
            <div class="col">
                <input class="form-control" type="date" v-model="form.end_date" placeholder="End date">
            </div>
        </div>







      <div class="flex justify-content-end mt-2" style="width: 100%;">
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
import {CalendarStore} from "@/main/dashboard/eos/store/EosStore.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";

const error = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const calendarStore = CalendarStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()



const form = reactive({
  name:null,
  description:null,
    start_date:null,
    end_date:null
})


const addCalendar = () =>{
  loader.value = true
  calendarStore.createCalendar(form)
}



onMounted(
    () =>{
      /* if(props.classNumber){
         classesStore.classDetails(props.classNumber)
       }*/
    }
)


watch(
    () => calendarStore.classResponse,
    async (data) => {
      if(data){
         form.name = null
         form.abbreviation = null
         form.level = ""
         loader.value = false
      }
    },
    {deep:true}
)


watch(
    () => calendarStore.calendarError,
    async (data) => {
        notificationStore.errorToast("Error",data.message)

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