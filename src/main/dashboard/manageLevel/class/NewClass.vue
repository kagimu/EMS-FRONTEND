<template>
  <div>




    <div class="mx-auto" style="width: 95%;">
      <label class="textColor mt-3 mb-2"><small>Add Classes to Levels</small></label>
      <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

        <li class="list-group-item" v-for="(cls,idx) in classList">
          <input
              v-model="form.classes"
              style="outline: none 0 !important; box-shadow: none;"
              class="form-check-input me-1" type="checkbox" :value="cls" :id="idx">
          <label class="form-check-label cursor-pointer" :for="idx">{{cls.name}}</label>
        </li>

      </ul>
    </div>

<!--    <form @submit.prevent="addClass">



      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Class Name</small></label>
        <input type="text" v-model="form.name" required class="form-control">
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

    </form>-->


  </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const classList = ref([])
const routerData = useRouter()

const classStore = useClassesStore()
const campusLevel = routerData.currentRoute.value.query.l


const form = reactive({
  classes:[],
})


const addClass = () =>{
  loader.value = true
  form.level_number = campusLevel
  classStore.newClassData(form)
}



onMounted(
    () =>{
      classStore.fetchClasses(campusLevel)
    }
)


watch(
    () => classStore.classInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
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