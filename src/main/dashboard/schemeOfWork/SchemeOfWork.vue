<template>
  <div>

    <div class="modal fade" id="schemeOfWorkModal" tabindex="-1" :class="{ show: curriculumDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Scheme of work</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-scheme-of-work ref="schemeOfWorkRef"></new-scheme-of-work>
            </div>
          </div>

        </div>
      </div>
    </div>






    <div class="row mx-auto mt-5">
      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="level"
              @change="filterClasses(level)"
          >
            <option disabled value="">Filter by Level</option>
            <option value="">All</option>
            <option v-for="(lvl, index) in commons.classLevelList()" :key="index" :value="lvl">{{lvl}}</option>
          </select>
        </div>
      </div>
    </div>


    <div class="row">


      <div class="col-3">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Classes</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <div
                  v-for="(item, idx) in  classList"
                  :key="idx"
                  class="list-group-item list-group-item-action cursor-pointer"
                  :class="item.number === menuSelected ? 'active' : ''"
                  @click="changeMenu(item.number)"
              >
                <small style="font-size:12px;">{{item.name}}</small>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">


            <div class="flex justify-content-between mt-3">
              <div class="ml-4">Scheme of work</div>
              <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addCurriculum" data-bs-toggle="modal" data-bs-target="#schemeOfWorkModal">
                <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                Add Scheme
              </button>
            </div>







            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col" class="text-end">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst,index) in learningAreaList" :key="index" >
                <th scope="row">{{index+1}}</th>
                <td>
                  {{lst.code}}
                </td>
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
        </div>
      </div>


    </div>






  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchemeOfWork from "@/main/dashboard/schemeOfWork/NewSchemeOfWork.vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";

const level = ref( "")
const curriculumDialog = ref( false)
const learningAreaList = ref( [])
const classList = ref( [])
const classStore = useClassesStore()
const menuSelected = ref( null)


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const learningAreaRef = ref(null)
const commons = useCommonsStore()


const addCurriculum = () => {
  learningAreaRef.value.autoInputFocusInfo()
  curriculumDialog.value = true
}

const changeMenu = (value) => {
  menuSelected.value = value
}

const filterClasses = (level) => {
  classStore.fetchClasses(level)
}


onMounted(
    () => {
      learningAreaStore.fetchLearningArea()
      classStore.fetchClasses("")
    }
)


watch(
    () => learningAreaStore.learningAreaResponse,
    async (data) => {
      if(data){
        // curriculumDialog.value = false
        await learningAreaStore.fetchLearningArea()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)


watch(
    () => learningAreaStore.learningAreaInfResponse,
    async (data) => {
      if(data){
        learningAreaList.value = data.data
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

</style>