<template>
  <div>

    <AppModal title="Import Students" v-model="importDialog" lg>
       <import-students></import-students>
    </AppModal>




    <div class="mt-3 flex justify-between">
      <div class="ml-4">Admission Setup</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="importFromExcel">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Import from Excel
      </button>
    </div>


    <table class="table table-hover caption-top" style="font-size: 14px;">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(lst,index) in uploadedCurriculumList" :key="index" >
        <th scope="row">{{index+1}}</th>
        <td>
          {{lst.name}}
        </td>
      </tr>
      </tbody>
    </table>




  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import useNotificationStore from "@/composables/useNotification.js";
import ImportCurriculum from "@/main/dashboard/curriculum/importCurriculum/importCurriculum.vue";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
import {useRouter} from "vue-router";
import AppModal from "@/components/AppModal.vue";
import ImportStudents from "@/main/settings/manage-students/importStudents.vue";
const routerData = useRouter()

const learningAreaList = ref( [])
const curriculumStore = useCurriculumStore()
let  curriculumNumber = routerData.currentRoute.value.query.id


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const learningAreaRef = ref(null)
const uploadedCurriculumList = ref(null)


const importDialog = ref(false)
const importFromExcel = () => {
  importDialog.value = true
}



onMounted(
    () => {
      curriculumStore.fetchUploadedExcel(curriculumNumber)
    }
)


watch(
    () => curriculumStore.curriculumExcelResponse,
    async (data) => {
      if(data){
        uploadedCurriculumList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => curriculumStore.importResponse,
    async (data) => {
      if(data){
        importDialog.value = false
        await curriculumStore.fetchUploadedExcel(curriculumNumber)
      }
    },
    {deep:true}
)



</script>

<style scoped>

</style>