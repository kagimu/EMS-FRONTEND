<template>
    <div>
  
  
      <AppModal title="Creating New Invoice" v-model="mymodal" xl6>
      <NewInvoice :userNumber="userNumber"></NewInvoice>
      </AppModal>
  
      <div class="row mt-1"  >
        <div class="col-12">    
       <div class="row">
        <div class="col-lg-4">
          Report Cards
        </div>
        <hr>
       </div>
         
            <div class="card-body" style="padding: 0;">
    <div class="container mt-1">
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>No.</th>
            <th>StudyPeriod</th>
            <th>Class</th>
            <th>stream</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
          
          <tr v-for="(list,index) in reportCardsList" :key="index">
            <td>{{ index+1}}</td>
            <td>{{ list.study_period }}</td>
            <td>{{ list.class }}</td>
            <td>{{list.stream  }}</td>
            <td>{{ list.grade}}</td>
            <td>
              <i class="bi bi-printer"></i> &nbsp; <i class="bi bi-eye" style="color:blue"></i>
            </td>

          </tr>
     
        </thead>
        <tbody>
   
            
        </tbody>
      </table>
    </div>
    </div>
    </div>
    </div>
  
  
    </div>
    </template>
  
  <script setup>
  import {onMounted, reactive, ref, watch,computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import AppModal from "@/components/AppModal.vue";
  import {useRouter} from "vue-router"
  import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";

  const reportStore = useReportCardStore()
  const routerData = useRouter()
  const studentNumber = routerData.currentRoute.value.query.st_id;
  const userNumber = ref(null)
  const notificationStore = useNotificationStore()
  const reportCardsList = ref(null)
  
  
  onMounted(
      async () => {
        await reportStore.fetchStudentReportCard(studentNumber)
      } )
  
      watch (
    () => reportStore.studentReportCardResponse,
    async (data) => {
      if (data) {
        reportCardsList.value = data.content
      }
    },
    { deep: true }
  )

  </script>
  
  
  <style>
  
  </style>