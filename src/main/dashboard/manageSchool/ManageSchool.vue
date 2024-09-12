<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchool from "@/main/dashboard/manageSchool/NewSchool.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

import AppModal from "@/components/AppModal.vue";
import { useAbility } from '@casl/vue';
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import FileUploader from "@/components/FileUploader.vue";

const { can } = useAbility()
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()

const confirmationRef = ref(null);


const schoolRef = ref(null)
const uploadDialog = ref(false)
const schoolBudge = ref(null)
const schoolNumber = ref(null)
const editMode = ref(false)
const showSelected = ref(null)
let entityN = localStorage.getItem("entity_number")


const schoolDialog = ref( false)
const schoolsList = ref( [])


const addSchool = () => {
  editMode.value = false
  schoolDialog.value = true
}

const editSchool = (school) => {
  if(school) {
    schoolDialog.value = true
    editMode.value = true
    schoolStore.fetchSchoolData(school.number)
  }
}


const deleteSchool = async (school) => {

  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+school.name);
  if (agreed) {
    await schoolStore.deleteSchool(school?.number)
  }

}

const setSchoolName = (school) =>{
  localStorage.setItem('schoolName',school)
}

onMounted(
    () => {
      schoolStore.fetchSchools(entityN)
    }
)

const uploadSchoolBudge = (school) => {
  schoolBudge.value = school?.logo
  schoolNumber.value = school?.number
  uploadDialog.value = true
}

watch(
    () => schoolStore.newSchoolResponse,
    async (data) => {
      if(data){
        schoolDialog.value = false
        await schoolStore.fetchSchools(entityN)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    },
    {deep:true}
)


watch (
    () => schoolStore.editSchoolResponse,
    async (data) => {
      if(data){
        schoolDialog.value = false
        await schoolStore.fetchSchools()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => schoolStore.deleteSchoolResponse,
    async (data) => {
      if(data){
        await schoolStore.fetchSchools()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => schoolStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


const toggleCurriculum = (number) =>{
  showSelected.value = (showSelected.value === number) ? undefined : number
}

const successUpload = (data) => {
  if(data){
    uploadDialog.value = false
    schoolStore.fetchSchools(entityN)
  }
}


</script>

<template>
  <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode ? 'Edit School' : 'New School'" v-model="schoolDialog" lg>
      <new-school ref="schoolRef"></new-school>
    </AppModal>

    <AppModal title="Upload School Badge" v-model="uploadDialog" xl>
      <file-uploader ref="profileUploadComponents" v-on:nextAction="successUpload"  :schoolNumber="schoolNumber" :imageUrl="schoolBudge"></file-uploader>
    </AppModal>


    <div class="mt-3">
      <button
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addSchool">
       <span class="mx-4">
         <i style="font-size: 15px;"  class="bi-plus"></i>
        Add School
       </span>
      </button>
    </div>






    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(school, index) in schoolsList" :key="index">

          <div class="border rounded-md bg-white mt-3 p-0">

            <div class="p-3 text-[#5e5e5e]">
            <div class="mb-3 flex justify-between text-[16px]">
              <div class="flex flex-row items-center">
                <div class="">
                  <img v-if="school?.logo" alt="logo" class="w-[50px] border rounded-md" :src="school?.logo"/>
                  <i v-else class="bi bi-card-image w-[50px] text-[30px] border rounded-md p-[10px] bg-[#e4e6eb] text-gray-600"></i>
                </div>
                <div class="px-2">
                  <div class="text-gray-600">{{school?.name}}</div>
                </div>
              </div>
              <div class="flex">
                <i class="bi bi-card-image cursor-pointer" @click="uploadSchoolBudge(school)" ></i>
              <i
              v-if="can('edit_school','general')"
                  class="bi-pencil ml-2 cursor-pointer"
                  style="font-size: 14px;"
                  @click="editSchool(school)"></i>

              <i 
              v-if="can('delete_school','general')"
              style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"  @click="deleteSchool(school)"></i>
              </div>
            </div>
            <div>
              <div>
                <div class="text-[15px]">
                    Commencement Date:
                </div>
                <div class="text-[13px] text-[#575656]">{{school.commencement_date}}</div>
              </div>




              <div class="mt-3">
                <div class="cursor-pointer text-[15px]" @click="toggleCurriculum(school.number)" >
                  Show Curriculum
                  <i
                      class="text-[12px]"
                      :class="showSelected === school.number ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
                  ></i>
                </div>
              </div>

              <div class="mt-2" v-show="showSelected === school.number">
                <div class="ml-2" v-for="(curr, idx) in school.school_curriculum" key="idx">
                  <div class="text-[13px] text-[#575656]">{{idx+1}}. {{curr.name}}</div>
                </div>
              </div>

            </div>

          </div>

            <div class="bg-[#0d6efd] hover:bg-[#0d6efd] rounded-b-md mt-3">
              <router-link
                  class="text-decoration-none"
                  :to="{name:'campus', query:{id:school.number}}"
              >
                <button
                v-if="can('view_school','general')"
                @click="setSchoolName(school.name)"
                    type="button"
                    class="bg-[#0d6efd] hover:bg-[#0c62e1] text-white text-sm text-center w-full rounded-b-md py-2">
                      <span>
                        View
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