<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js"
import NewService from "./NewService.vue"
import UpdateService from "./UpdateService.vue"
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
import AppModal from "@/components/AppModal.vue";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

import { useAbility } from '@casl/vue';

import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

const { can } = useAbility()
const servicesList = ref( [])
const serviceDetails = ref(null)
const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const showDialog = ref(false)

// Pagination variables
const itemsPerPage = 15 // Number of items per page
const currentPage = ref(1) // Current page
const totalPages = ref(1) // Total pages
const editMode = ref(false)
const schoolStore = useSchoolStore()
const school_number = ref("")
const schoolList = ref([])

onMounted(
    async () => {
      await schoolStore.fetchSchools()

      fetchServices()

    } )


const fetchServices = () => {

  let defaultSchoolNo =  localStorage.getItem("defaultSchoolNo")
  if(defaultSchoolNo){
    school_number.value = defaultSchoolNo
  }
  if(school_number.value) {
    filterServices()
  }
}

const filterServices = () =>{
  if(school_number.value){
  let data = {
    school_number:school_number.value
  }
  serviceStore.fetchServicesList(data)
    }
}

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    },
    {deep: true}
)



watch (
    () => serviceStore.newServiceResponse,
    async (data) => {
      if(data){
       fetchServices()
      }
    }
)

watch (
    () => serviceStore.errorMessage,
    async (data) => {
      if(data){
        // showDialog.value = false
        // errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    }
)



const deleteService = async (sid) => {

  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + sid.name);
  if (agreed) {
    await serviceStore.deleteService(sid.number)
  }


}

watch (
    () => serviceStore.deleteServiceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        fetchServices()
        showDialog.value = false
      }
    },
    {deep:true}
)

function setServiceId(serviceData){
  showDialog.value = true
  serviceDetails.value = serviceData
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

const sortedServiceList = ref([])

watch(
    [() => serviceStore.servicesListResponse, () => currentPage.value],
    ([newData, currentPageValue]) => {
      if (newData) {
        totalPages.value = Math.ceil(newData.length / itemsPerPage)
        const startIndex = (currentPageValue - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage;
        // servicesList.value = newData.slice(startIndex, endIndex)

        servicesList.value = newData
            .slice()
            .sort((a, b) => a.item.code - b.item.code)
            .slice(startIndex, endIndex)


      }
    },
    { deep: true }
)


const openAddServiceModal = () => {
  serviceDetails.value = ""
  showDialog.value = true
  editMode.value = false
}



watch (
    () => serviceStore.updateServiceResponse,
    async (data) => {
      if(data){
        fetchServices()
        showDialog.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => serviceStore.newServiceResponse,
    async (data) => {
      if(data){
        fetchServices()
        showDialog.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

</script>
<template>
    <div>

      <AppModal :title="serviceDetails ? 'Edit Service' : 'New Service'"   v-model="showDialog" xl4>
        <NewService :serviceDetails="serviceDetails" productType="service"></NewService>
      </AppModal>


    </div>
  <div class="row">
    <div class="col-lg-6">
      <div class="mb-2 ">
        <label class="text-sm"><small>School</small> </label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="school_number"
            @change="filterServices(school_number)"
        >
          <option disabled value=""> --Filter By School--</option>
          <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
          </option>
        </select>
      </div>
    </div>

  </div>


        <div class="row">
      <div class="col-12">
        <div class="car mt-3">
          <div class="card-body" style="padding: 0;">

    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Services
        <button
        v-if="can('create_service','general')"
        style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
      @click="openAddServiceModal">
        <i class="bi bi-plus"></i>&nbsp;<small>
          Add Service</small></button>
          
        <hr style="width:30px;"></h6>

      <table
        id="datatable"
        class="table table-hover caption-top mt-4 table-sm table-striped text-xs"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th class="w-[1%]">#</th>
            <th>Serial Code</th>
            <th>Service Name</th>
            <th>Cost</th>
            <th>Addition Info</th>
            <th>#</th>
          </tr> 
        </thead>
        <tbody>
<!--        {{sortedServiceList}}-->
          <tr v-for="(serviceData, index) in servicesList" :key="index" >
            <td>{{ serviceData?.item?.code }}</td>
            <td>{{ serviceData.item.serial_code}}</td>
            <td>{{ serviceData?.item?.name}}</td>
            <td>{{ serviceData?.item?.cost.toLocaleString()}}</td>
            <td>{{ serviceData?.item?.description}}</td>
            <td>

             <div class="flex">
               <button
                   v-if="can('edit_service','general')"
                   @click="setServiceId(serviceData)" class="link-primary mr-2">
                 <i class="bi bi-pencil"></i>
               </button>

               <button
                   v-if="can('delete_service','general')"
                   @click="deleteService(serviceData?.item)" class="link-danger"><i class="bi bi-trash"></i>
               </button>
             </div>

              </td>
          </tr>      
        </tbody>
      </table>
        <!-- Pagination controls -->
        <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{disabled: currentPage === 1}">
            <button class="page-link btn-sm text-sm" @click="prevPage"><small>Previous</small></button>
          </li>
          <li class="page-item" :class="{active: page === currentPage}" v-for="page in totalPages" :key="page">
            <button class="page-link btn-sm text-sm" @click="gotoPage(page)"><small>{{ page }}</small></button>
          </li>
          <li class="page-item" :class="{disabled: currentPage === totalPages}">
            <button class="page-link btn-sm text-sm" @click="nextPage"><small>Next</small></button>
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
    

  
  
    
    <style scoped>
    
    </style>