

<template>
<div>
<div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
  </div>
 <form  @submit.prevent="addSos"> 
  <div class="row mx-auto">
    <div class="col-12" style="margin-top: 20px;">
        <div class="mb-6">
          <label class="textColor text-sm"><small>Source Of Info</small> <span class="star">*</span></label>
          <input type="text" style="outline: none 0 !important; box-shadow: none; font-size: 10px;;" v-model="form.name" required class="form-control form-control-sm">
          <div class="text- mt-4">
          <div class="row">
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4" style="color: white;">
                <small>Submit &nbsp;<i class="bi bi-box-arrow-in-right"></i></small> 
           </button>
            </div>
          </div>
        </div>
        
        </div>
        </div>
    </div>
    </form>
    <table class="table table-hover caption-top table-sm" style="font-size: 14px;margin-left:20px;margin-right: 20px;">
              <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(SosInfo, index) in sosInfoList" :key="index">
                <td>{{SosInfo.name }}</td>
                <td>
                  <div>
                    <i
                        style="font-size: 13px;color:rgb(5, 32, 171)"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" ></i>
                    <i style="font-size: 13px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer" @click="deleteSosInfo(SosInfo)" ></i>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

</div>
</template>



<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useSosStore} from  "@/main/settings/sosinfo/store/sos.js";

const sosInfoList = ref( [])

const sosInfo= useSosStore()
let errorMessage = ref(null)

const form = reactive({
    name:null
})

const addSos = () => {
    sosInfo.newSosInfo(form)
}

onMounted(
    async () => {
      await sosInfo.fetchSosInfo()
    } )

watch (
    () => sosInfo.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)
watch(
    () => sosInfo.sosInfoResponse,
    async (data) => {
      if(data){
        sosInfoList.value = data.data
      }
    },
    {deep:true}
)


const deleteSosInfo = (SosInfo) => {

if(!confirm("Are you sure, you want to delete: "+SosInfo.name)){
  return
}
let data = {
  sosinfodata:SosInfo.name
}
sosInfo.deleteSos(data)

}

</script>

<style scoped>

</style>