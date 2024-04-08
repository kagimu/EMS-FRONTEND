<template>
  <div>




    <div class="modal fade" id="levelModal" tabindex="-1" :class="{ show: levelDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Level</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <select-curriculum-level :curriculumLevel="levelList"></select-curriculum-level>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="row">

      <div class="col-12">



<!--        <div class="card mt-3">-->
<!--          <div class="card-body" style="padding: 0;">-->


            <div class="flex justify-content-between mt-3">
              <div class="ml-4">Curriculum Level</div>
              <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addLevel" data-bs-toggle="modal" data-bs-target="#levelModal">
                <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                Select Level
              </button>
            </div>



            <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col" style="width: 30%;">Code</th>
                <th scope="col">Name</th>
<!--                <th scope="col">Action</th>-->
              </tr>
              </thead>
              <tbody>
              <tr v-for="(levelInfo, index) in levelList" :key="index">
                <td> {{levelInfo.code}}</td>
                <td> {{levelInfo.name}}</td>
<!--                <td>
                  <div>
                    <i
                        style="font-size: 13px;"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" @click="editClass(levelInfo)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(levelInfo)"></i>
                  </div>
                </td>-->
              </tr>
              </tbody>
            </table>

          </div>
        </div>

<!--      </div>-->
<!--    </div>-->



  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import SelectCurriculumLevel from "@/main/settings/level/SelectCurriculumLevel.vue";
const routerData = useRouter()


const levelStore = useLevelStore()
const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()

const level = ref( "")
const levelDialog = ref( false)
const levelList = ref( [])
let  curriculumNumber = routerData.currentRoute.value.query.id



const addLevel = () => {
  levelDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}


onMounted(
    async () => {
      await levelStore.fetchCurriculumLevels(curriculumNumber)
    }
)



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
    () => levelStore.curriculumLevelResponse,
    async (data) => {
      if(data){
        await levelStore.fetchCurriculumLevels(curriculumNumber)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)


</script>

<style scoped>

.linkStyle {
  text-decoration: none;
  color: #1867c0;
  font-size: 16px;
}

.linkStyle:hover {
  font-size: 16px;
  color: green;
  text-decoration: underline;
}

.viewButtonStyle{
  background-color: #2c6fb9;
  color: #ffffff;
  border-radius: 0;
}

.viewButtonStyle:hover {
  background-color: #0557b4;
  color: #ffffff;
}

</style>