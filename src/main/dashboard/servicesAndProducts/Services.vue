<template>
    <div>

      <AppModal title="New Service"   v-model="showDialog" xl4>
        <NewService></NewService>
      </AppModal>

        <div class="modal fade" id="serviceModal" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: showDialog }">
      <div class="modal-dialog">
        <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Services</h6>
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
        <div class="car mt-3">
          <div class="card-body" style="padding: 0;">

    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Services
        <button
        v-if="can('add_service','general')"
        style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      @click="openAddServiceModal">
        <i class="bi bi-plus"></i>&nbsp;<small>
          Add Service</small></button>
          
        <hr style="width:30px;"></h6>
      <table
        id="datatable"
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th style="width: 5px;">#</th>
            <th>Service Name</th>
            <th>Cost</th>
            <th>Addition Info</th>
            <th>#</th>
          </tr> 
        </thead>
        <tbody>
          <tr v-for="(serviceData, index) in servicesList" :key="index" >
            <td>{{ index+1 }}</td>
            <td>{{ serviceData.Item.name}}</td>
            <td>{{ serviceData.Item.cost}}</td>
            <td>{{ serviceData.Item.description}}</td>
            <td>
              <button
              v-if="can('edit_service','general')"
               @click="setServiceId(serviceData)" data-bs-target="#editServiceModal"  data-bs-toggle="modal" class="link-primary"><i class="bi bi-pencil"></i></button>&nbsp;&nbsp;   |
              &nbsp;&nbsp; 
              <button 
              v-if="can('delete_service','general')"
               @click="deleteService(serviceData.Item)" class="link-danger"><i class="bi bi-trash"></i></button>        
              </td>
          </tr>      
        </tbody>
      </table>
        <!-- Pagination controls -->
        <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{disabled: currentPage === 1}">
            <button class="page-link btn-sm textColor" @click="prevPage"><small>Previous</small></button>
          </li>
          <li class="page-item" :class="{active: page === currentPage}" v-for="page in totalPages" :key="page">
            <button class="page-link btn-sm textColor" @click="gotoPage(page)"><small>{{ page }}</small></button>
          </li>
          <li class="page-item" :class="{disabled: currentPage === totalPages}">
            <button class="page-link btn-sm textColor" @click="nextPage"><small>Next</small></button>
          </li>
        </ul>
      </nav>
      <!-- // -->
      </div>
    </div>
  </div>
  </div>
    </div>
    <!-- //editing modal  -->    
    <div class="modal fade" id="editServiceModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">UpdateService</h6>
                        <button aria-label="Close" class="btn-close btn-sm" data-bs-dismiss="modal"
                                style="margin-right: 5px;" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">           
                           <UpdateService :service="serviceId"></UpdateService>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
      </div>
       
    </template>
    
    <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import NewService from "./NewService.vue"
  import UpdateService from "./UpdateService.vue"
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
  import AppModal from "@/components/AppModal.vue";
  import { useAbility } from '@casl/vue';

  import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

const { can } = useAbility()
const servicesList = ref( [])
let errorMessage = ref(null)
const serviceId = ref(null)
const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const servId = ref(null)
const showDialog = ref(false)

// Pagination variables
const itemsPerPage = 9 // Number of items per page
const currentPage = ref(1) // Current page
const totalPages = ref(1) // Total pages
const paginatedConditionList = ref([]) // Paginated condition list
const editMode = ref(false)
  
  onMounted(
      async () => {
        await serviceStore.fetchServicesList()
      } )
  

  watch (
    () => serviceStore.newServiceResponse,
    async (data) => {
      if(data){
        serviceStore.fetchServicesList()
   
      }
    }
)
  
  watch (
      () => serviceStore.errorMessage,
      async (data) => {
        if(data){
          showDialog.value = false
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
  )
   


const deleteService = async (sid) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + sid.name);
if (agreed) {
  serviceStore.deleteService(sid.number)
}


}

watch (
    () => serviceStore.deleteServiceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        await serviceStore.fetchServicesList()
        showDialog.value = false
      }
    },
    {deep:true}
)

function setServiceId(sId){
serviceId.value = sId
}

 const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
const gotoPage = (page) => {
  currentPage.value = page
}
// Watch for changes in conditionList and currentPage
watch(
  [() => serviceStore.servicesListResponse, () => currentPage.value],
  ([newData, currentPageValue]) => {
    if (newData) {
      totalPages.value = Math.ceil(newData.length / itemsPerPage)
      const startIndex = (currentPageValue - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage;
      servicesList.value = newData.slice(startIndex, endIndex)
    }
  },
  { deep: true }
)
// ================================================

const openAddServiceModal = () => {
  showDialog.value = true
  editMode.value = false
}

watch (
    () => serviceStore.newServiceResponse,
    async (data) => {
      if(data){
        showDialog.value = false
      }
    }
)

  </script>
  
  
    
    <style scoped>
    
    </style>