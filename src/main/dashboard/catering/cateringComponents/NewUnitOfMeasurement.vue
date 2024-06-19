<template>
    <div>
<form @submit.prevent="unitMeasurement">
<div class="w-[50%] pl-5 pt-10">


  <p>New Unit Of Measure</p>

         <div class="mb-2">
            <label class="textColor"><small>Code</small></label>
            <input
            v-model="form.code"
            @keypress="commons.codeValidator($event)"
            maxlength="10"
            @paste.prevent
            type="text"
            required class="form-control shadow-none">
        </div>




        <div class="mb-2">
            <label class="textColor"><small>ABBREVIATION</small></label>
            <input v-model="form.abbreviation"  type="text" required class="form-control shadow-none">
        </div>




            <div class="mb-2">
            <label class="textColor"><small>Name</small></label>
            <input v-model="form.name"   type="text" required class="form-control shadow-none">


    </div>




<div class="flex flex-grow justify-between mt-4">
  &nbsp;
    <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-10"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
        <span class="visually-hidden">Loading...</span>
    </div></button>
</div>

</div>

</form>
    </div>
</template>
 
<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import { useAbility } from '@casl/vue';
import useCommonsStore from "@/composables/useCommons.js";

const { can } = useAbility()
const errorMessage = ref(null)

const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const cateringStore = useCateringStore()
const commons = useCommonsStore()

const form = reactive({
    code:null,
    name:null,
    abbreviation:null
})
const unitMeasurement = () => {
    let myData = reactive({
    code:parseInt(form.code),
    name:form.name,
    abbreviation:form.abbreviation
    })
    buttonLoader.true
    cateringStore.newUnitOfMeasureInfo(myData)
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
   
watch(() => form.code, (newValue, oldValue) => {
    if (newValue !== null && isNaN(newValue)) {
        form.code = oldValue
        notificationStore.errorToast("Warning", "Code must be a number.")
    }
})

</script>