<template>
    <div>

    <form @submit.prevent="doAction">
    
      <div>
        <div class="row">
            <div class="col-lg-12 mb-3"><p>Are you sure ? 
              <!-- {{ action }} -->
            </p></div>
            <div class="col-lg-6"> 
                <button style="float: left;"
            type="button" @click="cancelAction()"
            class="btn btn-danger border-0 btn-sm">
           <small> Cancel </small>
              <span v-if="loaderCancel" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
        </button>

            </div>
            <div class="col-lg-6">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
           <small> Confirm </small>
              <span v-if="loaderConfirm" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
        </button>
       </div>

        </div>
     
      </div>

    </form>
</div>
</template>

<script setup>
  import {onMounted,reactive, ref, watch,computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import useCommonsStore from "@/composables/useCommons.js";
  import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";

  const emit = defineEmits()

  const commons = useCommonsStore()
  const enrollmentStore = useEnrolmentStore()
  const  notificationStore  = useNotificationStore()
  const loaderCancel = ref(false)
  const loaderConfirm = ref(false)
  const errorMessage = ref(null)

  const props = defineProps({
    studentNumber:String,
    action:String
  })

const doAction = () =>{
    loaderConfirm.value = true
    if(props.action=="reEnroll"){
enrollmentStore.reEnrollment(props.studentNumber)
    }else{
        enrollmentStore.terminateEnrollment(props.studentNumber)
    }
    
}


watch (
       () => enrollmentStore.terminateEnrolmentResponse,
       async (data) => {
         if(data){
           loaderConfirm.value=false
           notificationStore.successToast("Success", data.message)
         }
       },
       {deep:true}
     )

     watch (
       () => enrollmentStore.reEnrolmentResponse,
       async (data) => {
         if(data){
           loaderConfirm.value=false
           notificationStore.successToast("Success", data.message)
         }
       },
       {deep:true}
     )
     
     
 
watch(
    () => enrollmentStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )

const cancelAction = () => {
  emit("next", 1 )
}

</script>
<style>
</style>