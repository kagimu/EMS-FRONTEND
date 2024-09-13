<template>
<div>

  <!-- source of info bootstrap modal -->
  <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: sosInfoDialog }">
      <div class="modal-dialog">
        <SosInformation :sosnumber="sosNumber" ></SosInformation>
      </div>
    </div>
 <form  @submit.prevent="addSos"> 
  <div class="row mx-auto">
    <div class="col-12" style="margin-top: 20px;">
        <div class="mb-6">
          <label class="text-sm text-sm"><small>Source Of Info</small> <span class="star">*</span></label>
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
                    <button 
                    v-if="can('edit_source_of_school_info','general')"
                    data-bs-toggle="modal" data-bs-target="#infoModal" @click="setSosNumber(SosInfo)" 
                    class="link-primary" style="border-width: 0px;text-decoration: none;"><small>
                      
                    <i  style="font-size: 13px;color:rgb(5, 32, 171)" class="bi-pencil mr-2 cursor-pointer"></i></small></button>
                    <i v-if="can('delete_source_of_school_info','general')" style="font-size: 13px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer" @click="deleteSosInfo(SosInfo)" ></i>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

</div>
 <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
</template>


<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useSosStore} from  "@/main/settings/sosinfo/store/sos.js";
import SosInformation from './SosInformation.vue';
import useNotificationStore from "@/composables/useNotification.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);






import { useAbility } from '@casl/vue';

const { can } = useAbility()

const  notificationStore  = useNotificationStore()

const sosInfoList = ref( [])

const sosInfo= useSosStore()
let errorMessage = ref(null)

const sosNumber = ref(null)

const sosInfoDialog = ref(false)

function setSosNumber(sosN){
sosNumber.value = sosN
sosInfoDialog.value = true
}

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
        // await sosInfo.fetchSosInfo()
      }
    },
    {deep:true}
)





watch(
    () => sosInfo.updateSosInfoResponse,
    async (data) => {
      if(data){
        sosInfoDialog.value =false
        notificationStore.successToast("Success", data.message)
        await sosInfo.fetchSosInfo()
      }
    },
    {deep:true}
)

watch (
    () => sosInfo.errorMessage,
    async (data) => {
      if(data){
        sosInfo.errorToast("Error",data.message)
        console.log(data.message)
      }
    },
    {deep:true}
)

watch (
    () => sosInfo.errorMessage,
    async (data) => {
      if(data){
        // sosInfoDialog.value =false
      }
    },
    {deep:true}
)
// newsosInfoResponse.value = response.data
watch(
    () => sosInfo.newsosInfoResponse,
    async (data) => {
      if(data){
        sosInfoDialog.value =false
        notificationStore.successToast("Success", data.message)
        sosInfo.fetchSosInfo()
      }
    },
    {deep:true}
)

// const deleteSosInfo = (SosInfo) => {
// if(!confirm("Are you sure, you want to delete: "+SosInfo.name)){
//   return
// }
// let data = {
//   sosinfodata:SosInfo.name
// }
// sosInfo.deleteSos(data)

// }

const deleteSosInfo = async (SosInfo) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+SosInfo.name);
if (agreed) {
  let data = {
  sosinfodata:SosInfo.name
}
sosInfo.deleteSos(data)
}


}
</script>

<style scoped>

</style>