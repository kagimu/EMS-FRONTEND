<script setup>

import {onMounted, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import AppModal from "@/components/AppModal.vue";
import NewCampus from "@/main/dashboard/manageCampus/NewCampus.vue";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import useNotificationStore from "@/composables/useNotification.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);


const routerData = useRouter()
import { useAbility } from '@casl/vue';
const { can } = useAbility()


const campusStore = useCampusStore()
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()

const campusDialog = ref( false)
const campusEditMode = ref( false)
const campusList = ref( [])
const schoolData = ref( null)
const campusRef = ref( null)
const showSelected = ref(null)


let schoolNumber = routerData.currentRoute.value.query.id

const toggleCurriculum = (number) =>{
  showSelected.value = (showSelected.value === number) ? undefined : number
}


const addCampus = () => {
  campusEditMode.value = false
  campusDialog.value = true
}


const editCampus = (campus) => {
  if(campus) {
    campusEditMode.value = true
    campusDialog.value = true
    campusStore.fetchCampusData(campus.number)
  }
}


const deleteCampus = async (campus) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+campus.name);
if (agreed) {
  let data = {
    campus_number:campus.number
  }
  campusStore.deleteCampus(data)
}


}



onMounted(
    () => {
      fetchCampusInfo(schoolNumber)
      schoolStore.fetchSchoolData(schoolNumber)
    }
)

const closeDialog = () => {
  campusDialog.value = false
}

const fetchCampusInfo = (schoolNumber) => {
  if(schoolNumber) {
    campusStore.fetchCampuses(schoolNumber)
  }
}

const setCampusName = (campusName) =>{
  localStorage.setItem('campusName',campusName)
}
watch(
    () => campusStore.newCampusResponse,
    async (data) => {
      if(data){
        campusDialog.value = false
        notificationStore.successToast("Success", data.message)
         fetchCampusInfo(schoolNumber)
      }
    },
    {deep:true}
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if(data){
        campusList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => campusStore.editCampusResponse,
    async (data) => {
      if(data){
        campusDialog.value = false
        notificationStore.successToast("Success", data.message)
        await fetchCampusInfo(schoolNumber)
      }
    },
    {deep:true}
)

watch(
    () => campusStore.deleteCampusResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
         fetchCampusInfo(schoolNumber)
      }
    },
    {deep:true}
)


watch (
    () => campusStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


watch (
    () => schoolStore.schoolInfoResponse,
    async (data) => {
      if(data){
        schoolData.value = data.data
      }
    },
    {deep:true}
)






</script>

<template>
<div>

  <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

  <AppModal :title="campusEditMode ? 'Edit Campus' : 'New Campus'" v-model="campusDialog" xl6>
    <new-campus ref="campusRef"  @closeDialog="closeDialog"></new-campus>
  </AppModal>

<div>
  <div class="mt-3 flex justify-between bg-white rounded p-3">
    <div>Campus list</div>
    <button v-if="can('create_campus','manage')"  type="button"  class="btn btn-sm buttonStyle btn-primary ml-2"  @click="addCampus">
      <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
      Add Campus
    </button>
  </div>

  <div class="row">
    <div class="col-4" v-for="(campus, index) in campusList" :key="index">
      <div class="bg-white rounded-md mt-3">

        <div class="">

          <div class="p-3 text-[#5e5e5e]">
          <div class="mb-3 flex justify-between" style="font-size: 20px;">
            {{campus.name}}
            <div>
              <i v-if="can('edit_campus','manage')"
                  class="bi-pencil ml-2 cursor-pointer"
                  style="font-size: 14px;"
                  @click="editCampus(campus)"></i>
              <i v-if="can('delete_campus','manage')" style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"  @click="deleteCampus(campus)"></i>
            </div>
          </div>

          <small>
            <b>Email:</b> {{campus.email}}<br />
            <b>Phone:</b> {{campus.phone}}<br />
            <b>Location:</b> {{campus.location}}<br />
            <b>Commencement Date:</b> {{campus.commencement_date}}<br />



              <div class="mb-3">
                <div class="mt-3">
                  <div class="cursor-pointer text-[15px]" @click="toggleCurriculum(campus.number)" >
                    Show Curriculum
                    <i
                        class="text-[12px]"
                        :class="showSelected === campus.number ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
                    ></i>
                  </div>
                </div>

                <div class="mt-2" v-show="showSelected === campus.number">
                  <!-- <div class="ml-2" v-for="(curr, idx) in campus.curriculum" key="idx">
                    <div class="text-[13px] text-[#575656]">{{idx+1}}. {{curr.name}}</div>
                  </div> -->
                  
                <div v-for="(curr, idx) in campus.curriculum" key="idx" class="curriculum ml-2">
                  <div class="curriculum-header">
                      <h3 class="text-sm">{{idx+1}}. {{curr.name}}</h3>
<!--                      <span>{{ 90 }}%</span>-->
                  </div>
<!--                  <div class="progress-bar">-->
<!--                     <div-->
<!--                      class="progress-fill"-->
<!--                      :class="{ 'complete': 90 === 100 }"-->
<!--                      :style="{ width: 90 + '%' }" >-->
<!--                    </div>-->
<!--                </div>-->


                </div>
              </div>
              </div>


          </small>

          </div>

            <div class="grid grid-cols-2 gap-0">

              <router-link
                  class="text-decoration-none"
                  :to="{name:'scheme-of-work', query:{id:campus.number}}"
              >
                <button
                    type="button"
                    class="bg-[#2c2f8c] hover:bg-[#0c62e1] text-white  text-center w-full rounded-bl-md pt-1 pb-2">
                      <span class="text-xs">
                        View Scheme
                      </span>
                </button>
              </router-link>

              <router-link
                  class="text-decoration-none"
                  :to="{name:'campus-setup', query:{id:campus.number, sch:schoolNumber}}"
              >
                <button
                  @click="setCampusName(campus.name)"
                    type="button"
                    class="bg-[#0d6efd] hover:bg-[#0c62e1] text-white  text-center w-full rounded-br-md pt-1 pb-2">
                      <span class="text-xs">
                        View Campus
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

<style scoped>
input:focus {
  box-shadow: none;
}

.text-sm2{
  color: #717375;
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


.curriculum-progress {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 600px;
  margin: 3px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.curriculum {
  margin-bottom: 20px;
}

.curriculum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease;
}

.progress-fill.complete {
  background: #2196f3; /* Blue color for 100% completion */
}

</style>