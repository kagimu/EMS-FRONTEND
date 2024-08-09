<template>
    <div>

  <AppModal title="New Daily Feeding Session" v-model="showingModal" lg>
    <NewDailyFeedingSession></NewDailyFeedingSession>
    </AppModal>


    <!-- end  -->
    <div class="row mt-3">
    <div class="col-12">
        <div class="">
        <div class="" style="padding: 0;">
         <div class="container mt-4">
           <div class="row">
              <div class="col-lg-12">
                <div class="">
                 <div class="">
                    <div class="row">
                    <div class="col-lg-8">
                    <h5 style="font-size: 14px;margin-top: 2px;">Daily Menu Pack </h5>
                    </div>
    
                <div class="col-lg-4">
                <button
                style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
                data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showModal">
                <small> <b><i class="bi bi-plus"></i></b>
                Add New</small></button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    
    
  
    <table
    id="datatable"
    class="table table-striped"
    style="font-size: 14px !important;"
    >
    <thead >
        <tr>
        <th>Day</th>
        <th>Feeding Session</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
      <tr v-for="(list, index) in dailyFeedingSessionGroupData" :key="index">
      <td>{{ list.day }}</td>
      <td>{{ list.feeding_session_name }}</td>
      </tr>
                
    </tbody>
    </table>

    </div>
    </div>
    </div>
    </div>
    </div>
    
    
    </div>
    </template>
  <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import NewDailyFeedingSession from "@/main/dashboard/catering/cateringComponents/NewDailyFeedingSession.vue";
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
  import AppModal from "@/components/AppModal.vue";
    
  const showingModal = ref(false)
  const cateringStore = useCateringStore()
  const thisDialog = ref(false)
  const dailyFeedingSessionGroupData = ref([])
   
  const showModal = () => {
    showingModal.value = true
}

  const showDialog = () => {
      thisDialog.value = true
  }

  const closeDialog = () => {
      thisDialog.value = false
  }

  onMounted(() => {
      cateringStore.fetchDailySession()
  }
)

watch(
  () => cateringStore.dailySessionResponse,
  async (data) => {
      dailyFeedingSessionGroupData.value = data.data
  },
  {deep: true}
)
watch(
  () => cateringStore.errorMessage,
  async (data) => {
        if (data) {
        notificationStore.errorToast("Error", data.message)
        }
  },
  {deep: true}
)
  </script>
  
  
    
    
    <style scoped>
    
    </style>