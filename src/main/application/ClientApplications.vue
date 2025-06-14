<script setup>
import {onMounted, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import ClientApplicationDetails from "@/main/application/ClientApplicationDetails.vue";
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import StudentApplicationDetails from '@/main/dashboard/studentApplication/StudentApplicationDetails.vue';
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import NewApplication from "@/main/dashboard/studentApplication/NewApplication.vue"

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
const isStaff = ref("")


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
const applicationN = ref(null)
const showAppmodal = ref(false)

const goToResume = (applicationId) => {
  showAppmodal.value = true
  applicationN.value = applicationId
// localStorage.setItem("application-id", applicationId)
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
      <StudentApplicationDetails :application-number="applications" />
    </AppModal>


    <AppModal title="New Application" v-model="showAppmodal" xl4>
      <NewApplication :applicationNumb="applicationN" :applicationMode="isStaff"></NewApplication>
    </AppModal>

    <ConfirmationModal ref="confirmationRef" />

    <!-- Loader -->
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Application List Profile View -->
    <div class="mt-1 w-[100%] mx-auto" v-if="!isLoading">
      <div class="row">
        <div class="col-12">
          <div class=" p-4 bg-white">
            <p class="mt-3 ml-3 text-sm mb-2">
             <i class="bi bi-book"></i>&nbsp;&nbsp;APPLICATIONS</p>
            <!-- <PaginationTemplate
              @perPageChanged="doFetchApplication"
              v-model:perPage="per_page"
              :per_page="per_page"
              :total_items="total_items"
              :total_rows="total_rows"
            /> -->

            <div class="row mt-3">
              <div v-for="(applist, index) in applicationInfoList" :key="index" class="col-md-6 mb-3">
                <div class="profile-card p-3 bg-gray-100 rounded-lg shadow">
                  <div class="flex justify-between">
                    <div>
                      <p><strong>#{{ index + 1 }}</strong></p>
                      <p style="text-transform: capitalize;">Parent/Guardian: {{ applist.Parent.surname + " " + applist.Parent.second_name + " " + applist.Parent.other_name }}</p>
                      <p>Status: {{ applist.status }}</p>
                      <p>Payment Status: {{ applist.application_fee_payment === false ? 'Pending' : 'Completed' }}</p>
                    </div>
                    <div class="flex items-center">
                      <!-- Action Buttons -->
                      <button
                        v-if="applist.status === 'DRAFT'"
                        @click="goToResume(applist.number)"
                        class="resume-btn text-red-600 border border-red-600 px-2 py-1 rounded-sm mr-2"
                        title="Resume"
                      >
                        <small><i class="bi bi-arrow-right"></i> Resume</small>
                      </button>

                      <button
                        v-if="applist.status === 'INTERVIEW_SCHEDULED' || applist.status === 'ADMITTED' || applist.status === 'SUBMITTED'"
                        @click="setApplicationNumber(applist.number)"
                        class="view-details-btn text-blue-600 border border-blue-600 px-2 py-1 rounded-sm"
                        title="View Details"
                      >
                        <small><i class="bi bi-eye"></i> View Details</small>
                      </button>

                      <!-- <button
                        @click="deleteThisData(applist)"
                        class="ml-2 text-red-600"
                        title="Delete"
                      >
                        <small><i class="bi bi-trash"></i></small>
                      </button> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
td {
  text-transform: capitalize !important;
}

.profile-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all 0.2s;
}

.profile-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.resume-btn,
.view-details-btn {
  transition: all 0.3s ease;
}

.resume-btn:hover,
.view-details-btn:hover {
  background-color: rgba(255, 0, 0, 0.1);
}

.scrollbar-thin {
  scrollbar-width: thin;
}
</style>
