<template>
  <div>

    <div class="modal fade" id="CurriculumModal" tabindex="-1" :class="{ show: CurriculumDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">{{curiculumEditMode ? "Edit" : "New"}} Curriculum</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-curriculum></new-curriculum>
            </div>
          </div>

        </div>
      </div>
    </div>





    <div class="mt-3">
      <button 
         v-if="can('create_curriculum','general')"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addSchool"
          data-bs-toggle="modal"
          data-bs-target="#CurriculumModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Curriculum
      </button>
    </div>





    <div class="row">
      <div class="col-4" v-for="(curr, index) in curriculumList" :key="index">

        <div class="card mt-3">
          <div class="card-body">
            <div class="mb-3 flex justify-between" style="font-size: 20px;">
              {{curr.name}}

              <div>
                <i 
                    v-if="can('edit_curriculum','general')"
                    class="bi-pencil ml-2 cursor-pointer"
                    data-bs-toggle="modal"
                    data-bs-target="#CurriculumModal"
                    style="font-size: 14px;"
                    @click="editCurriculum(curr)"></i>

                <i style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"  
                v-if="can('delete_curriculum','general')"
                @click="deleteCurriculum(curr)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === curr.number">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>

            <div class="flex justify-content-between">
              &nbsp;
              <div class="flex">
                            <router-link
                                class="text-decoration-none"
                                :to="{name:'curriculum-setup', query:{id:curr.number}}"
                            >
                              <button
                              v-if="can('setup_curriculum','general')"
                                  type="button"
                                  class="btn-primary border-0 d-none d-lg-block viewButtonStyle mr-2">
                                    <span class="mx-9 text-sm">
                                      Setup Curriculum
                                    </span>
                              </button>
                            </router-link>


              </div>
            </div>

          </div>
        </div>

      </div>


    </div>

  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import NewCurriculum from "@/main/dashboard/curriculum/curriculumSetup/NewCurriculum.vue";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()
const curriculumStore = useCurriculumStore()

const CurriculumDialog = ref(false)
const curiculumEditMode = ref(false)
const curriculumList = ref( [])
const deletionLoader = ref( undefined)


const addSchool = () => {
  curiculumEditMode.value = false
  CurriculumDialog.value = true
}

const editCurriculum = (curriculum) => {
  if(curriculum) {
    curiculumEditMode.value = true
    CurriculumDialog.value = true
    curriculumStore.fetchCurriculumData(curriculum.number)
  }
}


const deleteCurriculum = (data) => {
  if(!confirm("Are you sure, you want to delete: "+data.name)){
    return
  }

  deletionLoader.value = data.number

  let info = {
    number:data.number
  }
  curriculumStore.deleteCurriculum(info)
}

onMounted(
    async () => {
    await  curriculumStore.fetchCurriculum()
    }
)


watch (
    () => curriculumStore.curriculumResponse,
    async (data) => {
      if(data){
        await curriculumStore.fetchCurriculum()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => curriculumStore.curriculumEditResponse,
    async (data) => {
      if(data){
        await curriculumStore.fetchCurriculum()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => curriculumStore.deleteCurriculumResponse,
    async (data) => {
      if(data){
        await curriculumStore.fetchCurriculum()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)




watch(
    () => curriculumStore.curriculumDataResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => curriculumStore.errorMessage,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
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