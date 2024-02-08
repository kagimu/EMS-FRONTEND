<template>

    <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <!-- {{ sosnumber }} -->
            <h6 class="modal-title ml-3 mt-2 mb-2"><small>Edit Source of School Information</small></h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editSos" > 
            <div class="row mx-auto">
                <div class="col-12" style="margin-top: 20px;">
                    <div class="mb-6">
                    <label class="textColor text-sm"><small>Source Of Info</small> <span class="star">*</span></label>
                    <input type="text" style="outline: none 0 !important; box-shadow: none; font-size: 10px;" v-model="form.name"  required class="form-control form-control-sm">
                    <div class="text- mt-4">
                    <div class="row">
                        <div class="col-lg-4">
                        <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4" style="color: white;">
                            <small>Update &nbsp;<i class="bi bi-box-arrow-in-right"></i></small> 
                            <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Loading...</span>
                        </span>
                    </button>
                        </div>
                    </div>
                    </div>
                    
                    </div>
                    </div>
                </div>
          </form>
        </div>
</div>
  </template>
  
  <script setup>
import {reactive, ref, watch} from "vue";
import {useSosStore} from  "@/main/settings/sosinfo/store/sos.js";

const loader = ref(false)
const sosinform = useSosStore()


const props = defineProps({
    sosnumber:{}
})


const form = reactive({ 
name : null
})

const editSos= () => {
    loader.value = true
    sosinform.updateSos(props.sosnumber.number,form)
}

   watch (
    () => props.sosnumber,
    async (data) => {
      if(data){
        form.name = props.sosnumber.name
      }
    },
    {deep:true}
)

watch(
    () => sosinform.updateSosInfoResponse,
    async (data) => {
      if(data){
        loader.value =false
        // notificationStore.successToast("Success", data.message)
        await sosinform.fetchSosInfo()
      }
    },
    {deep:true}
)
watch (
    () => sosinform.errorMessage,
    async (data) => {
      if(data){
        loader.value =false
      }
    },
    {deep:true}
)


</script>


  
  <style scoped>
  .mb-2 {
    text-align: left;

    font-family: Roboto, sans-serif;
    /* font-size: 17px; */
    border-radius: 3px !important;
}
  .details{
    color:rgba(0, 0, 0, 0.824);
  }
  </style>