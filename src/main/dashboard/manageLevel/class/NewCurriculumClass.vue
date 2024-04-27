<template>
  <div>

<!--    <form @submit.prevent="addClass">-->

      <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
        {{ classError }}
      </div>



      <div class="mb-2">
        <label class="textColor"><small>Study Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.level"
            @change="fetchCurriculumClasses(form.level)"
        >
          <option disabled value="">--Select Level--</option>
          <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
        </select>
      </div>




      <div>
        <label class="textColor mt-3 mb-2"><small>Add Class to Curriculum</small></label>
        <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

          <li class="list-group-item" v-for="(cls,idx) in classList" :key="idx">
            <input
                v-model="classId"
                @click="addCurriculumClass(cls)"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1" type="checkbox" :value="cls.number" :id="cls.number">
            <label class="form-check-label cursor-pointer ml-2" :for="cls.number">{{cls.code+". "+cls.name+" [ "+cls.abbreviation+" ]"}}</label>
          </li>

        </ul>
      </div>





<!--    </form>-->


  </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";

const classError = ref(null)
const name = ref(null)
const levelList = ref([])
const classList = ref([])
const loader = ref(false)
const levelStore = useLevelStore()
const routerData = useRouter()

const classId = ref([])

const classStore = useClassesStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
let  curriculumNumber = routerData.currentRoute.value.query.id




const form = reactive({
  // code:null,
  // name:null,
  // abbreviation:null,
  level:"",
})


const addCurriculumClass = (cls) => {
  let data = {
    level_number:form.level,
    class_number:cls.number,
    code:cls.code
  }
  classStore.newCurriculumClassData(data)
}


const fetchCurriculumClasses = (level) => {

  let l = levelList.value.find(levelObj => {
    return levelObj.number === level;
  });

  classStore.filterCurriculumClassesData(l.level_number)
}

onMounted(
    () =>{
      levelStore.fetchCurriculumLevels(curriculumNumber)
     filterLevelInfo()
    }
)


const props = defineProps({
  curriculumClass: {},
})

const filterLevelInfo = () => {
  let data = props.curriculumClass
  if(data){
    let arr = []
    data.forEach(lst => {
      lst.class.forEach(list => {
        arr.push(list.class_number)
      })
    })
    classId.value = arr
  }
}

watch(
    () => classStore.classResponse,
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
    () => classStore.errorMessage,
    async (data) => {
      if(data){
        loader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

/*watch(
    () => levelStore.levelInfoResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)*/

watch(
    () => levelStore.curriculumLevelInfoResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => classStore.curriculumClassSetResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => props.curriculumClass,
    async (data) => {
      if(data){
        filterLevelInfo()
      }
    }
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