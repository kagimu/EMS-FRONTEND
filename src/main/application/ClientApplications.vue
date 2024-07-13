<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";
import ClientApplicationDetails from "@/main/application/ClientApplicationDetails.vue";
import router from "@/config/router.js";

const applicationInfoList = ref( [])
let errorMessage = ref(null)

const applications= ref(null)
const isLoading = ref(true);



const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

const setApplicationNumber = (ap) =>{
  applications.value = ap
}



onMounted(
    async () => {
      await applicationStore.fetchApplicationList()
    } )

watch(
    () => applicationStore.applicationListResponse,
    async (data) => {
      if(data){
        isLoading.value = false;
        applicationInfoList.value = data.data
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

</script>
<template>
    <div>

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

                  <hr >
                  <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                    {{errorMessage}}
                  </div>
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
                              class="border-b border-r border-t border-l border-[red] rounded-sm px-2 text-[red]"
                              title="">
                          <small style="color:rgb(244, 27, 27)">
                            <i class="bi bi-arrow-right">&nbsp;Resume</i>
                          </small></button>
                          
                        </router-link>
                      </td>

                      <td v-if="applist.status == 'INTERVIEW_SCHEDULED' || applist.status == 'ADMITTED' || applist.status == 'SUBMITTED'">
                        <button
                            data-bs-toggle="modal"
                            data-bs-target="#infoModal"
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
              </div></div></div>
        </div>
      </div>


    </div>
</template>





<style scoped>

</style>