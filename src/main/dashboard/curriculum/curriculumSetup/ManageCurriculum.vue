<template>
  <div>

    <div class="modal fade" id="importModal" tabindex="-1" :class="{ show: importDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Import Curriculum</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <import-curriculum></import-curriculum>
            </div>
          </div>

        </div>
      </div>
    </div>


    <div class="mt-3 flex justify-between">
      <div class="ml-4">Curriculum Setup</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="importFromExcel" data-bs-toggle="modal" data-bs-target="#importModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Import from Excel
      </button>
    </div>


    <table class="table table-hover caption-top" style="font-size: 14px;">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col" class="text-end">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(lst,index) in uploadedCurriculumList" :key="index" >
        <th scope="row">{{index+1}}</th>
        <td>
          {{lst.name}}
        </td>
        <td>
          <div class="float-end mr-2">
            <i
                style="font-size: 13px;"
                data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                class="bi-pencil mr-2 cursor-pointer" @click="editClass(sbj)"></i>
            <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(sbj)"></i>
          </div>
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