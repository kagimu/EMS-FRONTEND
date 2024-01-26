<template>
    <div>

        <div class="modal fade" id="serviceModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Service/Product</h6>
                        <button aria-label="Close" class="btn-close btn-sm" data-bs-dismiss="modal"
                                style="margin-right: 5px;" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">           
                           <NewService></NewService>
                        </div>
                    </div>
                </div>
            </div>
        </div></div>
        </div>
        

        <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Service/Product
        <button style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
        data-bs-target="#serviceModal"  data-bs-toggle="modal">
        <i class="bi bi-plus"></i>&nbsp;<small>
          Add Service</small></button>
          
        <hr style="width:30px;"></h6>
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>Service/Product Name</th>
            <th>Cost</th>
            <th>Addition Info</th>
            <th>#</th>
          </tr>
  
        </thead>
        <tbody>
          <tr>
            <td>Ream of Papers</td>
            <td>400000</td>
            <td>paid per Term</td>
            <td>
              <button class="link-primary"><i class="bi bi-pencil"></i></button>   |
               <button class="link-danger"><i class="bi bi-x-circle"></i></button>        
              </td>
          </tr>  
          <tr>
            <td>Pair of Uniform</td>
            <td>30000</td>
            <td>Paid per Uniform</td>
            <td>
                <button class="link-primary"><i class="bi bi-pencil"></i></button>   |
               <button class="link-danger"><i class="bi bi-x-circle"></i></button>        
              </td>
          </tr> 
          <tr>
            <td>Development Fee</td>
            <td>500000</td>
            <td>Per Year </td>
            <td>
              <button class="link-primary"><i class="bi bi-pencil"></i></button>   |
               <button class="link-danger"><i class="bi bi-x-circle"></i></button>     
              </td>
          </tr>       
          
        </tbody>
      </table>
      </div>
    </div>
  </div>
  </div>
    </div>
  
 
    </template>
    
    <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import NewService from "./NewService.vue";
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";


  const servicesList = ref( [])
  let errorMessage = ref(null)
  
  const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
  
  onMounted(
      async () => {
        await serviceStore.fetchServicesList()
      } )
  
      watch(
      () => serviceStore.servicesListResponse,
      async (data) => {
        if(data){
          servicesList.value = data.data
        }
      },
      {deep:true}
  )
  
  watch (
      () => serviceStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
  )
  
    </script>
  
  
    
    <style scoped>
    
    </style>