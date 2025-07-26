
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

const deleteSosInfo = async (SosInfo) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+SosInfo.name);
  if (agreed) {
    let data = {
      source_of_school_number:SosInfo
    }
    sosInfo.deleteSos(data)
  }
}

watch(
    () => sosInfo.deletesosInfoResponse,
    async (data) => {
      if(data){
        sosInfoDialog.value =false
        notificationStore.successToast("Success", data.message)
        sosInfo.fetchSosInfo()
      }
    },
    {deep:true}
)

</script>

<template>
  <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
<div>
  <!-- source of info bootstrap modal -->
  <div class="modal fade" id="infoModal" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: sosInfoDialog }">
      <div class="modal-dialog">
        <SosInformation :sosnumber="sosNumber" ></SosInformation>
      </div>
    </div>
  <div class="row g-4">
    <!-- Left Form Section -->
    <div class="col-lg-4">
      <form @submit.prevent="addSos" class="card shadow-sm p-3 border-0">


        <div class="mb-3">
          <label class="form-label small">Source of Info <span class="text-danger">*</span></label>
          <input
              type="text"
              v-model="form.name"
              required
              class="form-control form-control-sm shadow-none"
              placeholder="Enter source of info"
          />
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-primary btn-sm">
            Submit <i class="bi bi-box-arrow-in-right ms-1"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- Right Table Section -->
    <div class="col-lg-8">
      <div class="card shadow-sm border-0 p-3">
        <h6 class="mb-3 text-gray-600">Source of School Information</h6>

        <table class="table table-hover table-sm align-middle text-sm">
          <thead class="table-light">
          <tr>
            <th>Name</th>
            <th style="width: 100px;">Action</th>
          </tr>
          </thead>
          <tbody>
<!--          {{sosInfoList}}-->
          <tr v-for="(SosInfo, index) in sosInfoList" :key="index">
            <td>{{ SosInfo.name }}</td>
            <td>
              <div class="d-flex gap-2">
                <button
                    v-if="can('edit_source_of_school_info','general')"
                    class="btn btn-sm p-0 text-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#infoModal"
                    @click="setSosNumber(SosInfo)"
                    title="Edit"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                    v-if="can('delete_source_of_school_info','general')"
                    class="btn btn-sm p-0 text-danger"
                    @click="deleteSosInfo(SosInfo.number)"
                    title="Delete"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="sosInfoList.length === 0">
            <td colspan="2" class="text-muted text-center small">No source information added yet.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>

</template>


<style scoped>

</style>