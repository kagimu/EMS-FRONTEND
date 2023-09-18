<template>
  <div>

    <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: schoolDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">New School</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-school></new-school>
            </div>
          </div>

        </div>
      </div>
    </div>





    <div class="mt-3">
      <button
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addSchool"
          data-bs-toggle="modal"
          data-bs-target="#infoModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add School
      </button>
    </div>





    <div class="row">
      <div class="col-4" v-for="(school, index) in schoolsList" :key="index">

          <div class="card mt-3">
          <div class="card-body">
            <div class="mb-3" style="font-size: 20px;">
              {{school.name}}

              <i
                  aria-controls="offcanvasRight"
                  class="bi-pencil ml-2 cursor-pointer"
                  data-bs-target="#infoModal"
                  data-bs-toggle="modal"
                  style="font-size: 17px;"
                  @click="editSchool(school)"></i>

              <i style="font-size: 17px;" class="bi-trash cursor-pointer ml-1"  @click="deleteSchool(school)"></i>

            </div>

            <div class="flex justify-content-between">
              &nbsp;
              <router-link
                  class="text-decoration-none"
                  :to="{name:'campus', query:{id:school.number}}"
              >
                <button
                    type="button"
                    class="btn-primary border-0 d-none d-lg-block viewButtonStyle">
                      <span class="mx-9 text-sm">
                        View
                      </span>
                </button>
              </router-link>
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
import NewSchool from "@/main/dashboard/manageSchool/NewSchool.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import NewCampus from "@/main/dashboard/manageCampus/NewCampus.vue";

const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()


const schoolDialog = ref( false)
const schoolsList = ref( [])


const addSchool = () => {
  schoolDialog.value = true
}

const editSchool = (school) => {
  if(school) {
    schoolDialog.value = true
    schoolStore.fetchSchoolData(school.number)
  }
}


const deleteSchool = (school) => {

  if(!confirm("Are you sure, you want to delete: "+school.name)){
    return
  }
  let data = {
    school_number:school.number
  }
  schoolStore.deleteSchool(data)

}

onMounted(
    () => {
      schoolStore.fetchSchools()
    }
)

watch(
    () => schoolStore.newSchoolResponse,
    async (data) => {
      if(data){
        schoolDialog.value = false
        await schoolStore.fetchSchools()
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