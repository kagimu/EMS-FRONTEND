<template>
    <div>


      <div class="row">
        <div class="modal fade" id="admitMainModal" tabindex="-1" :class="{ show: enrolShow }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">ENROL STUDENT</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
           <AdmitModel></AdmitModel>
          </div>
          </div>

        </div>
      </div>
    </div>


          
                 <div class="ant-alert-action mt-3">
                  <button type="submit" class="mb-2 btn btn-outline-primary btn-sm" style="float: right;"><i></i>Preview/Print</button>
                  <button @click="showDialog()" data-bs-toggle="modal" data-bs-target="#admitMainModal" type="submit" class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " style="float: right;"><i></i>Offer Admission</button>
                  <button @click="showEnrol()"  type="submit" class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " style="float: right;"><i></i>Enrol Student</button>

                </div>
                <div class="ant-card-body mt-0 mb-5">
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
                  <table class="text-sm table table-sm table-striped table-bordered">
                    <thead>
                        <th>ADN</th>
                        <th>School</th>
                        <th>Campus</th>
                        <th>Class</th>
                        <th>Stream</th>
                        <th>Year</th>
                        <th>Study Period</th>
                        <th>COMMENT</th>
                    </thead>
                    <tbody>
              <tr>

              </tr>
        
                    </tbody>
                    </table>
  
                  </div>
                </div>
            </div>

  </div></div></div>

    
    </template>
    
    <script setup>
    import {onMounted, ref, watch,watchEffect,computed} from "vue"
    import useNotificationStore from "@/composables/useNotification.js"
    import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";
    import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
    import {useRouter} from "vue-router"

  const routerData = useRouter()
  const router = useRouter()
  let errorMessage = ref(null)
  const emit = defineEmits()
  const enrolShow = ref(false)
  const admissionStore = useAdmissionStore()
  const  notificationStore  = useNotificationStore()
  const studentNumber = routerData.currentRoute.value.query.st_id;
  // const interviewNumber = routerData.currentRoute.value.query.interview_id;
  const admissionData = ref([])

  onMounted(
      () => {
        admissionStore.fetchAdmissionByStudentId(studentNumber)
      }
  )
  watch(
      () => admissionStore.admissionByStudentResponse,
      async (data) => {
        if(data){
          // notificationStore.successToast("Success", data.message)
          admissionData.value = data.data
        }
      },
      {deep:true}
  )

  watch (
      () => admissionStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
        }
      },
      {deep:true}
  )

  const showDialog = () => {
    enrolShow.value = true
  }
  
    
    </script>
  
  
    
    <style scoped>
    
    </style>