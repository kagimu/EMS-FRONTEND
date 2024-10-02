<script setup>
import {onMounted, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import ClientApplicationDetails from "@/main/application/ClientApplicationDetails.vue";
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import StudentApplicationDetails from '@/main/dashboard/studentApplication/StudentApplicationDetails.vue';
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

const showingModal = ref(false)
const tableLoader = ref(true)

const applicationInfoList = ref( [])
let errorMessage = ref(null)
const applications= ref(null)
const isLoading = ref(true);

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const loading = ref(false)
const page = ref(1)
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)


const setApplicationNumber = (ap) =>{
    applications.value = ap
    showingModal.value = true
}



onMounted(
    async () => {
      doFetchApplication()
    } )




    const doFetchApplication = () =>{
   let data = {
      page: 1,
      per_page: per_page.value,   
      
   }
   loading.value = true;
   applicationInfoList.value = []
   applicationStore.fetchApplicationList(data).finally(() => {
    loading.value = false; 
  })

  }

  function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    tableLoader.value = true

    let data = {
      page: (page.value+1),
      per_page: per_page.value,   
     
   }
   loading.value = true;
  //  applicationInfoList.value = []
   applicationStore.fetchApplicationList(data).finally(() => {
    loading.value = false; 
  })
  }
}

  const fetchApplications = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page
      tableLoader.value = false

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content

      let count_items = (current_page * per_page_item)
      let totalItems = data?.total_rows

      if(objArray && objArray.length > 0){
      
      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items

        objArray.forEach((list, i) => {

          list.key =  (current_page - 1) * per_page_item + i + 1

          const index = applicationInfoList.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            applicationInfoList.value.push(list);
          }

        })
      }


    }
  }



watch(
    () => applicationStore.applicationListResponse,
    async (data) => {
      if(data){
        isLoading.value = false;
        // applicationInfoList.value = data.data
        fetchApplications(data)
      }
    },
    {deep:true}
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

const goToResume = (applicationId) => {
// alert(applicationId)q
localStorage.setItem("application-id", applicationId)
}

  //delete
  const deleteThisData = async (applicationData) => {
  // if(!confirm("Are you sure, you want to delete: " + applicationData.Student.surname+' '+applicationData.Student.second_name )){
  //   return
  // }else{

  //   let data = {
  //     application_number:applicationData.number
  //   }
  //   applicationStore.deleteApplication(data)
  // }

  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+ applicationData.Student.surname+' '+applicationData.Student.second_name);
  if (agreed) {
    let data = {
      application_number:applicationData.number
    }
    applicationStore.deleteApplication(data)
  }
}

watch (
    () => applicationStore.deleteApplicationResponse,
    async (data) => {
      if(data){
         doFetchApplication()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

</script>
<template>
    <div>
      <AppModal title="Application Details" v-model="showingModal" xl6>
        <student-application-details :application-number="applications"></student-application-details>
     </AppModal>

       <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

          <!-- Loader -->
          <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- modal for viewing more details -->
        <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <client-application-details :application-number="applications"></client-application-details>
            </div>
        </div>

      <div class="mt-[60px;] w-[80%] mx-auto" v-if="isLoading==false">
        <div class="row">
          <div class="col-12">
            <div class="card p-0 bg-white">
              <div>
                <div>

                  <p class="mt-3 ml-3"><b>Student Application List</b></p>
<!-- {{ applicationInfoList }} -->
<PaginationTemplate
                    @perPageChanged="doFetchApplication"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>
                  <hr >

                  <!-- <div class="alert alert-danger"  style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                    {{errorMessage}}
                  </div> -->
                  <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">
                  <table
                      id="datatable"
                      class="table table-sm table-striped text-sm"
                  >
                    <thead>
                    <tr>
                      <th><div class="ml-5">#</div></th>
                      <th>Parent/Guardian</th>
                      <th>Status</th>
                      <th>Payment Status</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(applist, index) in applicationInfoList" :key="index">
                      <td><div class="ml-5">{{(index + 1) }}</div> </td>
                      <td>{{ applist.Parent.surname+ " "+ applist.Parent.second_name+ " "+ applist.Parent.other_name  }} </td>
                      <td>{{ applist.status }} </td>
                      <td>{{ applist.application_fee_payment === false ? 'pending' : 'completed' }}</td>
 
                      <td v-if="applist.status == 'DRAFT'">
                        <router-link
                            :to="{name:'application', query:{applicationId:applist.number}}"
                        >
                          <button  
                          @click="goToResume(applist.number)"
                              class="border-b border-r border-t border-l border-[red] rounded-sm px-2 text-[red]"
                              title="">
                          <small style="color:rgb(244, 27, 27)">
                            <i class="bi bi-arrow-right">&nbsp;Resume</i>
                          </small></button>
                          
                        </router-link>

                        <button @click="deleteThisData(applist)"
                             style="border-width: 0px;text-decoration: none;" title="Delete"><small>
                              <i class="bi bi-trash ml-2" style="color: red;"></i>
                         
                          </small>
                          </button>
                      </td>

                      <td v-if="applist.status == 'INTERVIEW_SCHEDULED' || applist.status == 'ADMITTED' || applist.status == 'SUBMITTED'">
                        <button
                            @click="setApplicationNumber(applist.number)"
                            class="border-b border-r border-t border-l border-[#0d56c3] rounded-sm px-2 text-[#0d56c3] mr-2"
                            title="View Details">
                          <small><i class="bi bi-eye"></i> view Details</small>
                        </button>
                       
                      </td>


                    </tr>
                    </tbody>
                  </table>
                </div>
                </div>
              </div></div></div>
        </div>
      </div>


    </div>
</template>





<style scoped> 
td {
  text-transform: capitalize !important;
}

</style>