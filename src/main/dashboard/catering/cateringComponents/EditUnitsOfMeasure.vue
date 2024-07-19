<template>
    <div>
    <!-- {{ unitData }} -->
       
<form @submit.prevent="editUnitMeasurement">
<div class="row mt-5">
    <div class="col-3">
        <div class="mb-2">
    <label class="textColor"><small>Code</small></label>
    <input 
    v-model="form.code"
    @keypress="commons.codeValidator($event)"
    maxlength="10" 
    type="text"
    required class="form-control">
</div>
    </div>
    <div class="col-4">
        <div class="mb-2">
    <label class="textColor"><small>ABBREVIATION</small></label>
    <input  type="text" required class="form-control" v-model="form.abbreviation">
</div>
    </div>
    <div class="col-lg-5">
        <div class="mb-2">
    <label class="textColor"><small>Name</small></label>
    <input v-model="form.name"   type="text"  required class="form-control">
    
</div>
    </div>

</div>

<div class="text-right mt-4">
    <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>Update</small>
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
import useCommonsStore from "@/composables/useCommons.js";
const { can } = useAbility()

const props = defineProps({
    unitData:[]
    })  
    
    const form = reactive({
    code:null,
    name:null,
    abbreviation:null
})

onMounted(
    () => {
        if(props.unitData.unit_of_measure_number){
            form.code = props.unitData.code;
            form.name = props.unitData.name;
            form.abbreviation = props.unitData.abbreviation
        }

    
    }
)
 

const errorMessage = ref(null)

const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const cateringStore = useCateringStore()
const commons = useCommonsStore()


const editUnitMeasurement = (number) => {
    let myData = reactive({
    code:parseInt(form.code),
    name:form.name,
    abbreviation:form.abbreviation,
    unit_of_measure_number:props.unitData.unit_of_measure_number
    })
//    alert(JSON.stringify(myData))
    buttonLoader.value=true
    cateringStore.updateUnitOfMeasure(myData)
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