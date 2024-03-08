<template>
  <div>



    <div class="modal fade" id="infoModal" tabindex="-1" :class="{ show: campusDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">{{campusEditMode ? "Edit Campus" : "New Campus"}} </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-campus></new-campus>
            </div>
          </div>

        </div>
      </div>
    </div>



    <div class="card mt-3">
      <div class="card-body">

    <div class="ml-3 mt-3" >
      <div class="row">
        <div class="col-4">
          <div v-if="schoolData">
           <small>School:</small> <br />
           <div style="font-size: 20px;">
             {{schoolData.name}}
           </div>
          </div>
        </div>

          <div  v-if="schoolData" class="col-4">
              <small>Commencement date</small>
              <div>{{schoolData.commencement_date}}</div>
          </div>


        <div class="col-4">
          <div class="ml-5 mt-1">
            <small><b>School Curriculum (s)</b></small>
            <div class="ml-4" v-if="schoolData">
                <div v-for="(schools, index) in schoolData.school_curriculum" :key="index">
                  <small>{{(index+1)+". "+schools.name}}</small>
                </div>
            </div>
          </div>
        </div>
      </div>


</div>
      </div>





    </div>


    <div class="mt-3">
      <button type="button"  class="btn btn-sm buttonStyle btn-primary ml-2"  @click="addCampus" data-bs-toggle="modal" data-bs-target="#infoModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Campus
      </button>
    </div>



    <div class="row">
      <div class="col-4" v-for="(campus, index) in campusList" :key="index">
        <div class="card mt-3">


              <div class="card-body">
                <div class="mb-3 flex justify-between" style="font-size: 20px;">
                    {{campus.name}}
                  <div>
                  <i
                      class="bi-pencil ml-2 cursor-pointer"
                      data-bs-target="#infoModal"
                      data-bs-toggle="modal"
                      style="font-size: 14px;"
                      @click="editCampus(campus)"></i>
                  <i style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"  @click="deleteCampus(campus)"></i>
                  </div>
                </div>
                <small>
                  <b>Email:</b> {{campus.email}}<br />
                  <b>Phone:</b> {{campus.phone}}<br />
                  <b>Location:</b> {{campus.location}}<br />
                  <b>Commencement Date:</b> {{campus.commencement_date}}<br />
                  <b>Curriculum:</b> <br />
                  <div class="ml-2" v-for="(curr,idx) in campus.curriculum" :key="idx">{{(idx + 1)+". "+curr.name}}</div>
                </small>

                <div class="flex justify-content-between mt-4">
                  &nbsp;

                  <div class="flex">

                  <router-link
                      class="text-decoration-none"
                      :to="{name:'scheme-of-work', query:{id:campus.number}}"
                  >
                    <button
                        type="button"
                        class="btn-primary border-0 d-none d-lg-block viewButtonStyle mr-2">
                      <span class="mx-9 text-sm">
                        Setup Scheme
                      </span>
                    </button>
                  </router-link>

                    <router-link
                        class="text-decoration-none"
                        :to="{name:'campus-setup', query:{id:campus.number}}"
                    >
                      <button
                          type="button"
                          class="btn-primary border-0 d-none d-lg-block viewButtonStyle">
                      <span class="mx-9 text-sm">
                        Setup Campus
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
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewCampus from "@/main/dashboard/manageCampus/NewCampus.vue";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
const routerData = useRouter()
const campusStore = useCampusStore()
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()

const campusDialog = ref( false)
const campusEditMode = ref( false)
const campusList = ref( [])
const schoolData = ref( null)


let schoolNumber = routerData.currentRoute.value.query.id


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
const deleteCampus = (campus) => {
  if(!confirm("Are you sure, you want to delete: "+campus.name)){
    return
  }
  let data = {
    campus_number:campus.number
  }
  campusStore.deleteCampus(data)
}



onMounted(
    () => {
      fetchCampusInfo(schoolNumber)
      schoolStore.fetchSchoolData(schoolNumber)
    }
)

const fetchCampusInfo = (schoolNumber) => {
  if(schoolNumber) {
    campusStore.fetchCampuses(schoolNumber)
  }
}

watch(
    () => campusStore.newCampusResponse,
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
        await fetchCampusInfo(schoolNumber)
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

<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
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

</style>