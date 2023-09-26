<template>
  <div>

    <form @submit.prevent="addTopic">

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>






      <div class="mb-2">
        <label class="textColor"><small>School</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="subject_number"
        >
          <option disabled value="">Select School</option>
          <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>


        <div class="mb-2">
            <label class="textColor"><small>Campus</small></label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="subject_number"
            >
                <option disabled value="">Select campus</option>
                <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.name}}</option>
            </select>
        </div>




      <div class="mb-2">
        <label class="textColor"><small>Class</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.class_number">
          <option disabled value="">Select Class</option>
          <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.name}}</option>
        </select>
      </div>

        <div class="mb-2">
            <label class="textColor"><small>Stream</small></label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.class_number">
                <option disabled value="">Select Class</option>
                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.name}}</option>
            </select>
        </div>


        <div class="mb-2">
            <label class="textColor"><small>Subject</small></label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.class_number">
                <option disabled value="">Select subject</option>
                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.name}}</option>
            </select>
        </div>


        <div class="mb-2">
            <label class="textColor"><small>Day of the week</small></label>
            <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.class_number">
                <option disabled value="">Select day of the week</option>
                <option v-for="(list, index) in daysOfWeek" :key="index" :value="list.number" >{{list.name}}</option>
            </select>
        </div>



      <div class="mb-2">
        <label class="textColor"><small>Start Time</small></label>
        <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.name" required class="form-control form-select-sm">
      </div>

        <div class="mb-2">
            <label class="textColor"><small>End Time</small></label>
            <input type="date" style="outline: none 0 !important; box-shadow: none;" v-model="form.name" required class="form-control form-select-sm">
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

import {onMounted, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";

import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()



const subjectStore = useSubjectStore()

const classStore = useClassesStore()

const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const classList = ref([])
const learning_area_number = ref("")
const subject_cluster_number = ref("")
const subject_number = ref("")


const form = reactive({
  name:null,
  class_number:"",
  strand_number:"",
})

const daysOfWeek = ref([
    {name:"Monday", number:1},
    {name:"Tuesday", number:2},
    {name:"Wednesday", number:3},
    {name:"Thursday", number:4},
    {name:"Friday", number:5},
])




const selectSubjectCluster = (learning_area_number) => {
  subjectClusterStore.fetchSubjectCluster(learning_area_number)
}

const selectSubject = (subject_cluster_number) => {
  subjectStore.fetchSubjectsByClass(subject_cluster_number)
}





onMounted(
    () => {
      classStore.fetchClasses()
    }
)




watch(
    () => subjectStore.subjectInfoResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
      }
    },
    {deep:true}
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