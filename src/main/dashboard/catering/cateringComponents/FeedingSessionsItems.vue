<template>
    <div>

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
                    <h5 style="font-size: 14px;margin-top: 2px;">Feeding Session Items </h5>
                    </div>
    
                <div class="col-lg-4">
                
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-4">
        <div class="mb-2">
        <select
            v-model="form.school_number"
            class="form-select form-select-sm"
            style="box-shadow: none;"
            @change="filterBySchool(form.school_number)"           
        >
        <option disabled value="">--Select School--</option>
        <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
        </option>
        </select>
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
        <th>Menu Items</th>
        <th>Status</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
        <tr v-for="(list,index) in feedingSessionItemData" :key="index">
            <td>{{ list.feeding_session_name }}</td>
            <td>{{ list.menu_item_name }}</td>
            <td>{{ list.feeding_session_status }}</td>
           
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
    import NewFeedingGroup from "@/main/dashboard/catering/cateringComponents/NewFeedingGroup.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

    const schoolList = ref([])
    const schoolStore = useSchoolStore()
    const cateringStore = useCateringStore()
    const thisDialog = ref(false)
    const feedingSessionItemData = ref([])
    const notificationStore = useNotificationStore()

    const form = reactive({
    school_number:"",
})


    const showDialog = () => {
        thisDialog.value = true
    }

    const closeDialog = () => {
        thisDialog.value = false
    }

    onMounted(() => {
        cateringStore.fetchFeedingSessionsItems()
        schoolStore.fetchSchools()
    }
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
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