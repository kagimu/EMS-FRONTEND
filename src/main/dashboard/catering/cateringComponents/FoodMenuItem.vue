<template>
    <div>
 <!-- schedule interview -->
<div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show:thisDialog }" aria-labelledby="offcanvasRightLabel">
<div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Menu Item</small></h5>
    <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeDialog"></button>
</div>
<div class="offcanvas-body">
    <NewMenuItem></NewMenuItem>
</div>
</div>
  <!-- wnd  -->

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
                    <h5 style="font-size: 14px;margin-top: 2px;">Menu Item </h5>
                    </div>
    
                <div class="col-lg-4">
                <button
                style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
                data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showDialog">
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
        <th>code</th>
        <th>Name</th>
        <th>Unit Of Measurement</th>
        <th>School-Campus</th>
        </tr>
    <!-- <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div> -->
    </thead>
    <tbody>
        <tr v-for="(list, index) in menuItemData" :key="index">
      <td>{{ list.code }}</td>
      <td>{{ list.name }}</td>
      <td>{{ list.unit_of_measure_name }}</td>
      <td>{{ list.campus_name }}</td>
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
    import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    
    const notificationStore = useNotificationStore()
    const thisDialog = ref(false)
    const menuItemData = ref([])
    const showDialog = () => {
        thisDialog.value = true
    }
    const cateringStore = useCateringStore()

    const closeDialog = () => {
        thisDialog.value = false
    }

    onMounted(
    () => {
      cateringStore.fetchMenuItem()
    }

)

watch(
    () => cateringStore.menuItemResponse,
    async (data) => {
        menuItemData.value = data.data
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