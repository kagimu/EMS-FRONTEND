<template>
  <div>


    <div class="mx-auto" style="width: 95%;">
      <label class="textColor mt-3 mb-2"><small>Add Level to Curriculum</small></label>
      <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

        <li class="list-group-item" v-for="(lvl,idx) in levelList" :key="idx">
          <input
              v-model="classId"
              @click="addCurriculumLevel(lvl)"
              style="outline: none 0 !important; box-shadow: none;"
              class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="lvl.number">
          <label class="form-check-label cursor-pointer ml-2" :for="lvl.number">{{lvl.code+". "+lvl.name}}</label>
        </li>

      </ul>
    </div>




  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
import {useLevelStore} from "@/main/settings/level/store/levels.js";

const classError = ref(null)
const name = ref(null)
const classList = ref([])
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const levelStore = useLevelStore()

const classStore = useClassesStore()
let  curriculumNumber = routerData.currentRoute.value.query.id
const levelList = ref([])


const classId = ref([])


const addCurriculumLevel = (level) =>{
  levelStore.newCurriculumLevel({level_number:level.number, curriculum_number:curriculumNumber, code:level.code})
  // classStore.newClassLevelData({class_code:classInfo.code,class_number:classInfo.number, campus_number:campusNumber, level_number:campusLevel})
}

const props = defineProps({
  classListInfo: {},
})


onMounted(
    () =>{
      levelStore.fetchLevels()
      // classStore.fetchClassLevelToAdd(campusLevel)
    }
)

watch(
    () => levelStore.levelInfoResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => classStore.classesToAddResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => classStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => props.classListInfo,
    async (data) => {
      if(data){
      let arr = []
        data.forEach(lst => {
          arr.push(lst.class_number)
        })
        classId.value = arr
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