<template>
    <div>
    <div class="container mt-4">
      <h6 style="margin-top:20px; text-align: left;font-size: 15px;">Admission Offer Conditions
        <button
        v-if="can('add_condition','general')"
        style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
        data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showInterviewDialog">
       <small> <b><i class="bi bi-plus"></i></b>
          Add Condition</small></button>
        <hr style="width:30px;"></h6>
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <!-- <th>Interview</th> -->
            <th>Name</th>
            <th>action</th>
          </tr>
         
        </thead>
        <tbody>
          <tr v-for="(cond, index) in paginatedConditionList" :key="index" >
            <td>{{ cond.description }}</td>
            <td>
              <button
              v-if="can('edit_condition','general')"
               @click="setConditionId(cond)" data-bs-target="#editConditionModal"  data-bs-toggle="modal" class="link-primary"><i class="bi bi-pencil"></i></button>&nbsp;&nbsp;   |
              &nbsp;&nbsp; 
              <button
              v-if="can('delete_condition','general')"
                @click="deleteCondition(cond.number)" class="link-danger"><i class="bi bi-trash"></i></button>        
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
    </div>
  
    <!-- schedule interview -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show:thisDialog }" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Conditions</small></h5>
              <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeInterviewDialog"></button>
            </div>
            <div class="offcanvas-body">
              <form @submit.prevent="addCondition">
                <div class="mb-2">
                  <label class="textColor"><small>Description</small></label>
                  <input v-model="formData.description"  type="text" required class="form-control">
                </div>
                <div class="mb-2">
                  <label class="textColor"><small>Custom Description</small></label>
                  <textarea v-model="formData.custom_admission_condition" required class="form-control textColor">

                  </textarea>
                  
                </div>
                
                <div class="text-right mt-4">
                  <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
                    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                      <span class="visually-hidden">Loading...</span>
                    </div></button>
                </div>
              </form>
            </div>
          </div>
  <!-- wnd  -->
  
  
    </div>
    </template>
    
    <script setup>
      import {onMounted,reactive, ref, watch} from "vue";
      import useNotificationStore from "@/composables/useNotification.js";
      import { useConditionStore } from "./conditionStore";

      
  import { useAbility } from '@casl/vue';

const { can } = useAbility()

      const conditionStore = useConditionStore()
      const  notificationStore  = useNotificationStore()
      const buttonLoader = ref(false)
      const thisDialog= ref(false)
      const conditionList = ref( [])
      const errorMessage = ref(null)
      const conditionId = ref(null)

      // Pagination variables
      const itemsPerPage = 9 // Number of items per page
      const currentPage = ref(1) // Current page
      const totalPages = ref(1) // Total pages
      const paginatedConditionList = ref([]) // Paginated condition list
  
      const formData = reactive({ 
        description:null,
        custom_admission_condition:null
      })
  
  const setConditionId = (cid) =>{
    conditionId.value = cid
  }
  
  const closeInterviewDialog = () => {
   thisDialog.value = false
  }

  const showInterviewDialog = () => {
   thisDialog.value = true
  }
  
  
   const addCondition = () => {
      //  alert(JSON.stringify(formData))
       thisDialog.value = true
       buttonLoader.value = true
      conditionStore.newOfferAdmissionCondition(formData)
      }

      watch (
    () => conditionStore.newOfferAdmissionConditionResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        await conditionStore.fetchOfferAdmissionCondition()
        // thisDialog.value = false
        formData.description = null
        formData.custom_admission_condition = null
      }
    },
    {deep:true}
)

watch (
      () => conditionStore.errorMessage,
      async (data) => {
        if(data){
          thisDialog.value = false
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
  )
   
  const deleteCondition = (sid) => {
if(!confirm("Are you sure, you want to delete: " + sid)){
  return
}
conditionStore.deleteCondition(sid)
}



watch (
    () => conditionStore.deleteCondition,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        conditionStore.fetchOfferAdmissionCondition()
      }
    },
    {deep:true}
)
    
onMounted(
      async () => {
        await conditionStore.fetchOfferAdmissionCondition()
      } )
  
  //     watch(
  //     () => conditionStore.offerAdmissionConditionResponse,
  //     async (data) => {
  //       if(data){
  //         conditionList.value = data
  //       }
  //     },
  //     {deep:true}
  // )
  // Methods to handle pagination
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
  [() => conditionStore.offerAdmissionConditionResponse, () => currentPage.value],
  ([newData, currentPageValue]) => {
    if (newData) {
      // Update total pages
      totalPages.value = Math.ceil(newData.length / itemsPerPage);
      // Update paginated condition list
      const startIndex = (currentPageValue - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      paginatedConditionList.value = newData.slice(startIndex, endIndex)
    }
  },
  { deep: true }
)
    </script>
  
  
    
    <style scoped>
    
    </style>