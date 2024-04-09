<template>
    <div>

    <!-- end  -->
    <div class="row mt-3">
    <div class="col-12">
        <div class="card">
        <div class="card-body" style="padding: 0;">
         <div class="container mt-4">
           <div class="row">
              <div class="col-lg-12">
                <div class="">
                 <div class="">
                    <div class="row">
                    <div class="col-lg-8">
                    <h5 style="font-size: 14px;margin-top: 2px;">Feeding Session Items </h5>
                    </div>
    
                <div class="col-lg-4">
                
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
        <th>Name</th>
        <th>Status</th>
        <th>Campus</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
     
                
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
    import NewFeedingGroup from "@/main/dashboard/catering/cateringComponents/NewFeedingGroup.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

    const cateringStore = useCateringStore()
    const thisDialog = ref(false)
    const feedingSessionItemData = ref([])
    const showDialog = () => {
        thisDialog.value = true
    }

    const closeDialog = () => {
        thisDialog.value = false
    }

    onMounted(() => {
        cateringStore.fetchFeedingSessionsItems()
    }
)

watch(
    () => cateringStore.feedingSessionsItemsInfoResponse,
    async (data) => {
        feedingSessionItemData.value = data.data
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