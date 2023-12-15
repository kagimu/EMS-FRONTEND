<template>
  <div>

<!--{{subTopicData}}-->
    <div class="mx-auto" style="width: 95%;">
      <label class="textColor mt-3 mb-2"><small>Add References</small></label>
      <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

        <li class="list-group-item" v-for="(material,idx) in learningMaterialsList" :key="idx">
          <input
              v-model="learningMaterialNumber"
              @click="addLearningMaterial(material)"
              style="outline: none 0 !important; box-shadow: none;"
              class="form-check-input me-1" type="checkbox" :value="material.number" :id="material.number">
          <label class="form-check-label cursor-pointer ml-2" :for="material.number">{{material.code+". "+material.name}}</label>
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
import {useSubtopicStore} from "@/main/dashboard/curriculum/curriculumSetup/subTopic/store/subTopic.js";
import {useLearningMaterialStore} from "@/main/settings/learning-materials/resources_store.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const learningMaterialsList = ref([])
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const resourcesStore = useLearningMaterialStore()

const classStore = useClassesStore()
const campusLevel = routerData.currentRoute.value.query.l
const campusNumber = routerData.currentRoute.value.query.id

const subTopicData = ref(null)
const subTopicNumber = ref(null)


const learningMaterialNumber = ref([])


const addLearningMaterial = (materialInfo) =>{
  alert(JSON.stringify(materialInfo))
  loader.value = true
  classStore.newCampusClass({material_code:materialInfo.code,material_number:materialInfo.number, campus_number:campusNumber, sub_topic_number:subTopicNumber.value})
}

const props = defineProps({
  subTopicInfo: {},
})


onMounted(
    () =>{
       resourcesStore.fetchLearningMaterials()
    }
)


watch(
    () => resourcesStore.learningMaterialsResponse,
    async (data) => {
      if(data){
         learningMaterialsList.value = data.data
      }
    },
    {deep:true}
)

/*watch(
    () => classStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)*/

watch(
    () => props.subTopicInfo,
    async (data) => {
      if(data){
        subTopicData.value = data
        subTopicNumber.value = data.number
       /* let arr = []
        data.forEach(lst => {
          arr.push(lst.curriculum_class_number)
        })
        learningMaterialNumber.value = arr*/
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