<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";

const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const loader = ref(false)

const props = defineProps({
    classListData:String
  })
const form = reactive ({
    campusClassNumber:props.classListData.Number
})

const removeClass = () =>{
    alert(JSON.stringify(form))
    reportSetupStore.removeClassFromReportTemplate(form)
}

watch (
  () => reportSetupStore.removeClassFromReportTemplateResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
      loader.value=false
    }
  },
  {deep:true}
)

watch(
    () => reportSetupStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
)

const cancelPlease = () =>{
    
}

</script>
<template>
    <div>
        <p style="text-align:center">Are you sure to remove this Class : <b>{{classListData.ClassName}}</b> ?</p>
    </div>
    <div class="row">
        <div class="col-6">
<button style="float:left" class="btn btn-danger mb-2" @click="cancelPlease">Cancel</button>
        </div>
        <div class="col-6" >
            <button @click="removeClass" style="float:right" class="btn btn-success mb-2">Remove
                <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
             &nbsp; <span class="visually-hidden">Loading...</span>
                </span>
            </button>
</div>
    </div>
</template>

<style>
</style>

