<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewCurriculum from "@/main/dashboard/curriculum/curriculumSetup/NewCurriculum.vue";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";

import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";

import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

//  let entityN = localStorage.getItem("entity_number")
const { can } = useAbility()


const  notificationStore  = useNotificationStore()
const curriculumStore = useCurriculumStore()

const CurriculumDialog = ref(false)
const curiculumEditMode = ref(false)
const curriculumList = ref( [])
const deletionLoader = ref( undefined)


const addCurriculum = () => {
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


const deleteCurriculum = async (data) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+data.name);
if (agreed) {
  deletionLoader.value = data.number

let info = {
  number:data.number
}
await curriculumStore.deleteCurriculum(info)
}


}


onMounted(
    async () => {
      await  curriculumStore.fetchCurriculum()
    }
)

const closeDialog = () => {
  CurriculumDialog.value = false
}



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
        notificationStore.errorToast("Error",data.message)
      }
    }
)

</script>
<template>
  <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="curiculumEditMode ? 'Edit Curriculum' : 'New Curriculum'" v-model="CurriculumDialog" lg>
      <new-curriculum @closeDialog="closeDialog"></new-curriculum>
    </AppModal>


    <div class="mt-3">
      <button 
         v-if="can('create_curriculum','general')"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addCurriculum"
          >
        <span class="mx-4">
         <i style="font-size: 15px;"  class="bi-plus"></i>
        Add Curriculum
       </span>
      </button>
    </div>





    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <!-- {{ curriculumList }} -->
      <div v-for="(curr, index) in curriculumList" :key="index">
        <div class="border rounded-md bg-white mt-3 p-0">


          <div class="p-3 text-[#5e5e5e]">
            <div class="mb-3 flex justify-between" style="font-size: 20px;">
              {{curr?.code ? "#"+curr?.code : ""}} {{curr?.name}}
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
          </div>


          <div class="bg-[#0d6efd] hover:bg-[#0d6efd] rounded-b-md mt-3">
              <router-link
                  class="text-decoration-none"
                  :to="{name:'curriculum-setup', query:{id:curr.number}}"
              >
                <button
                v-if="can('setup_curriculum','general')"
                    type="button"
                class="bg-[#0d6efd] hover:bg-[#0c62e1] text-white text-sm text-center w-full rounded-b-md py-2">
                      <span class="mx-9 text-sm">
                        Setup Curriculums
                      </span>
                </button>
              </router-link>
            </div>


        </div>
      </div>

    </div>

  </div>
</template>



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