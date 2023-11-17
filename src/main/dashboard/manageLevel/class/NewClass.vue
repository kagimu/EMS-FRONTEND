<template>
  <div>


    <div class="mx-auto" style="width: 95%;">
      <label class="textColor mt-3 mb-2"><small>Add Classes to Levels</small></label>
      <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

        <li class="list-group-item" v-for="(cls,idx) in classList" :key="idx">
          <input
              v-model="classId"
              @click="addClass(cls)"
              style="outline: none 0 !important; box-shadow: none;"
              class="form-check-input me-1" type="checkbox" :value="cls.number" :id="cls.number">
          <label class="form-check-label cursor-pointer ml-2" :for="cls.number">{{cls.code+". "+cls.name+" &nbsp;&nbsp;&nbsp; ["+cls.abbreviation+"]"}}</label>
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

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const classList = ref([])
const routerData = useRouter()
const  notificationStore  = useNotificationStore()

const classStore = useClassesStore()
const campusLevel = routerData.currentRoute.value.query.l
// const campusNumber = routerData.currentRoute.value.query.id
const campusNumber = localStorage.getItem('campus_number');


const classId = ref([])


const addClass = (classInfo) =>{
  loader.value = true
  classStore.newClassLevelData({class_code:classInfo.code,class_number:classInfo.number, campus_number:campusNumber, level_number:campusLevel})
}

const props = defineProps({
  classListInfo: {},
})


onMounted(
    () =>{
      classStore.fetchClassLevelToAdd(campusLevel)
    }
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