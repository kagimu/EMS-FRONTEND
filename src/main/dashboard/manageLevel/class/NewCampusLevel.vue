<template>
  <div>


    <div class="mx-auto" style="width: 95%;">
      <label class="textColor mt-3 mb-2">Add Level to Campus</label>
      <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

        <li class="list-group-item" v-for="(lvl,idx) in curriculumLevelList" :key="idx">
          <input
              v-model="curriculumLevelId"
              @click="addLevel(lvl)"
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
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
const curriculumStore = useCurriculumStore()

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const curriculumLevelList = ref([])
const routerData = useRouter()
const  notificationStore  = useNotificationStore()

const classStore = useClassesStore()
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusNumber = routerData.currentRoute.value.query.id


const curriculumLevelId = ref([])


const addLevel = (levelInfo) =>{
  loader.value = true
  classStore.newCampusLevel({level_number:levelInfo.number, campus_curriculum_number:campus_curriculum_number})
}

const props = defineProps({
  levelList: {},
})


onMounted(
    () =>{
      // classStore.fetchClassLevelToAdd(campusLevel)
      curriculumStore.fetchCampusCurriculumLevelList(campus_curriculum_number)
    }
)


/*watch(
    () => classStore.classesToAddResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)*/

watch(
    () => curriculumStore.campusCurriculumLevelResponse,
    async (data) => {
      if(data){
        curriculumLevelList.value = data.data
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
    () => props.levelList,
    async (data) => {
      if(data){
      let arr = []
        data.forEach(lst => {
          arr.push(lst.curriculum_level_number)
        })
        curriculumLevelId.value = arr
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