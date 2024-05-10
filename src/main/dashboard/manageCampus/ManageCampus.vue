<script setup>

import {onMounted, ref, watch} from "vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewCampus from "@/main/dashboard/manageCampus/NewCampus.vue";
import {useRouter} from "vue-router";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

import AppModal from "@/components/AppModal.vue";
import CampusListInfo from "@/main/dashboard/manageCampus/CampusListInfo.vue";
import ReportTemplates from "@/main/dashboard/manageLevel/report_setup/reportTemplate/ReportTemplates.vue";
import SchoolReportTemplates from "@/main/dashboard/manageLevel/report_setup/reportTemplate/SchoolReportTemplates.vue";
const routerData = useRouter()
const campusStore = useCampusStore()
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()

const campusDialog = ref( false)
const campusEditMode = ref( false)
const campusList = ref( [])
const schoolData = ref( null)
const campusRef = ref( null)


let schoolNumber = routerData.currentRoute.value.query.id

let campusQuery = routerData.currentRoute.value.query.type ? routerData.currentRoute.value.query.type : "campus"
const campusMenu = ref([
  {
    name:"Campus List",
    router_name:"campus"
  },
  {
    name:"Report Templates",
    router_name:"report-template"
  }
])




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

    <AppModal :title="campusEditMode ? 'Edit Campus' : 'New Campus'" v-model="campusDialog" xl6>
      <new-campus ref="campusRef"></new-campus>
    </AppModal>



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









    <div class="row">
      <div class="col-2">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="list-group list-group-flush mb-1 rounded-0" >
              <router-link
                  v-for="(item, idx) in  campusMenu" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.router_name === campusQuery ? 'active' : ''"
                  :to="{name:'campus', query:{id:schoolNumber,type:item.router_name}}">
                <small style="font-size:12px;">{{(idx+1) +". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

      </div>
      <div class="col-10">
          <div v-if=" campusQuery==='campus'">
            <campus-list-info></campus-list-info>
          </div>
          <div v-if=" campusQuery==='report-template'">
            <div class="rounded  border bg-white mt-3">

              <school-report-templates :schoolData="schoolData"></school-report-templates>
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