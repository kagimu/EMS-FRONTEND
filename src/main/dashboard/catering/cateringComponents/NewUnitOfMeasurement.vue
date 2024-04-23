<template>
    <div>
<form @submit.prevent="unitMeasurement">
<div class="row">
    <div class="col-6">
        <div class="mb-2">
    <label class="textColor"><small>Code</small></label>
    <input v-model="form.code"  type="number" required class="form-control">
</div>
    </div>
    <div class="col-6">
        <div class="mb-2">
    <label class="textColor"><small>ABBREVIATION</small></label>
    <input v-model="form.abbreviation"  type="text" required class="form-control">
</div>
    </div>

</div>
<div class="mb-2">
    <label class="textColor"><small>Name</small></label>
    <input v-model="form.name"   type="text" required class="form-control">
    
</div>

<div class="text-right mt-4">
    <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
        <span class="visually-hidden">Loading...</span>
    </div></button>
</div>
</form>
    </div>
</template>
 
<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

import { useAbility } from '@casl/vue';

const { can } = useAbility()
const errorMessage = ref(null)

const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const cateringStore = useCateringStore()

const form = reactive({
    code:null,
    name:null,
    abbreviation:null
})
const unitMeasurement = () => {
    buttonLoader.true
    cateringStore.newUnitOfMeasureInfo(form)
}
watch (
    () => cateringStore.newUnitOfMeasureInfoResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchUnitOfMeasureInfo()
        form.code=null,
    form.name=null
      }
    },
    {deep:true}
)

watch (
      () => cateringStore.errorMessage,
      async (data) => {
        if(data){
          errorMessage.value = data.message
          notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
  )
   


</script>