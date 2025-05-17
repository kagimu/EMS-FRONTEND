<script setup>

import {onMounted, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const classList = ref([])
const campusLevelList = ref([])
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const classStore = useClassesStore()


const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusNumber = routerData.currentRoute.value.query.id
const allSelected = ref(false)

onMounted(
    () => {
      classStore.fetchCampusLevel(campus_curriculum_number)
    }
)


const classId = ref([])
const campus_level_number = ref("")


const addClass = (classInfo) =>{
  loader.value = true
  classStore.newCampusClass({class_code:classInfo.code,class_number:classInfo.number, campus_number:campusNumber, campus_level_number:campus_level_number.value})
}

const props = defineProps({
  classListInfo: {},
})




const fetchCurriculumClass = (level_number) => {
  classStore.fetchClassLevelToAdd(level_number)
  filterClassData(level_number)
}

const filterClassData = (level_number) => {
  if(level_number){
    let classInfo = props.classListInfo

    let lvl = classInfo.find(lst => {return lst.number === level_number})

    if (lvl) {
      classId.value = lvl.classes.map(lst => lst.curriculum_class_number);
    }

  }
}



watch(
    () => classStore.classesToAddResponse,
    async (data) => {
      if(data){
        classList.value = data.data
        // Add 'selected' flag to each class
        classList.value.forEach(cls => {
          cls.selected = false
        })
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
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    },
    {deep:true}
)


const toggleSelectAll = () => {
  allSelected.value = !allSelected.value
  classList.value.forEach(cls => {
    cls.selected = allSelected.value
  })
}

</script>

<template>
  <div>


    <div class="mx-auto w-[95%]">


      <div class="mb-2">
        <label class="text-sm"><small>Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_level_number"
            @change="fetchCurriculumClass(campus_level_number)"
        >
          <option disabled value="">--Select Level--</option>
          <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>



      <label class="text-sm mt-3 mb-2"><small>Add Classes to Levels</small></label>


      <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
        <li class="mb-2">
          <input
              type="checkbox"
              v-model="allSelected"
              @change="toggleSelectAll"
          />
          <label class="ms-1">All</label>

        </li>


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



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>