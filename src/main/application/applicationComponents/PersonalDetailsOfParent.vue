<script setup>

import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";

const routerData = useRouter()
const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()
const commons = useCommonsStore()

let  applicationNumber = routerData.currentRoute.value.query.applicationId

const buttonLoader = ref(false)
let errorMessage = ref(null)
const emit = defineEmits()



const form = reactive({
  surname:null,
  second_name:null,
  other_name:null,
  main_telephone_number:null,
  email:null,
  alternative_email:null,
  alternative_telephone_number:null
})

const formData = reactive ({
  parent_number:null
})

// const page = ref(1)
// const per_page = ref(15)

function handleInput(data) {
  if (data ==="main" && form.main_telephone_number.length > 15) {
    form.main_telephone_number = form.main_telephone_number.slice(0, 15);
  }

  if (data ==="alternative" && form.alternative_telephone_number.length > 15) {
    form.alternative_telephone_number = form.alternative_telephone_number.slice(0, 15);
  }
}

watch (
    () => applicationStore.newApplicationDetailsResponse,
    async (data) => {
      if(data){
        let id = data.application_number
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", {id:data.application_number, step:2})
      /*  let dataa = {
          page: page.value,
          per_page: per_page.value,
          status: "SUBMITTED"
        }
        applicationStore.fetchApplicationList(dataa)*/

      }
    }
)


watch (
    () => applicationStore.updateParentPersonalDetailsresponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        emit("next", {id:data.application_number, step:2})
      }
    }
)

watch (
    () => applicationStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


onMounted(
    () => {
      if(applicationNumber !=""){
        applicationStore.fetchApplicationById(applicationNumber)
      }
    }
)

watch(
    () => routerData.currentRoute.value.query.applicationId,
    async (data) => {
      if (data) {
        // localStorage.removeItem('applicationId')
        applicationStore.fetchApplicationById(data)
      }
    },
    { deep: true }
)



watch (
    () => applicationStore.applicationByIdResponse,
    async (data) => {
      if(data){
        form.surname = data.Parent.surname
        form.second_name = data.Parent.second_name
        form.other_name = data.Parent.other_name
        form.main_telephone_number = data.Parent.main_telephone_number
        form.alternative_telephone_number= data.Parent.alternative_telephone_number
        form.email= data.Parent.email
        form.alternative_email=data.Parent.alternative_email
        formData.parent_number= data.Parent.number
        // alert(JSON.stringify(data))
        // notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

const addParentPersonalDetails = () => {
  buttonLoader.value = true
  if(!formData.parent_number){
    applicationStore.newApplicationDetails(form)
  }else {
    applicationStore.updateParentDetails(formData.parent_number,form)
//  nextGo()
  }

}



</script>
<template>
<div>
<p class="ml-4 mt-4 mb-1" style="text-align: center !important;">GUARDIAN/PARENT DETAILS
  <!-- {{ applicationNumber }} -->
</p>

  <form  @submit.prevent="addParentPersonalDetails" style="margin-top: 6px;"> 
  <div class="row mx-auto">
    <div class="col-12">
        <div class="mb-8">
          <input type="hidden"  v-model="formData.parent_number">
          <label class="textColor text-sm"><small>Surname/Family name</small> <span class="star">*</span></label>
          <input type="text" style="outline: none 0 !important; box-shadow: none; font-size: 10px;;" v-model="form.surname" required class="form-control form-control-sm">
        </div>

        <div class="mb-8">
          <label class="textColor text-sm"><small>Second name </small><span class="star">*</span></label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.second_name"  required class="form-control form-control-sm">
        </div>

        <div class="mb-8">
          <label class="textColor text-sm"><small>Other names</small> </label>
          <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.other_name" class="form-control form-control-sm">
        </div>

      <div class="mb-2">
        <label class="textColor text-sm"><small>Email</small> <span class="star">*</span></label>
        <input type="email" style="outline: none 0 !important; box-shadow: none;" v-model="form.email"  required class="form-control form-control-sm">
      </div>


      <div class="mb-2">
        <label class="textColor text-sm"><small>Alternative Email</small></label>
        <input type="email" style="outline: none 0 !important; box-shadow: none;" v-model="form.alternative_email" class="form-control form-control-sm">
      </div>
    </div>

      <div class="mb-2">
        <label class="textColor text-sm"> <small>Telephone No </small><span class="star">*</span></label>
        <div class="input-group">
          <vue-tel-input
              @input="handleInput('main')"
              @keypress="commons.onlyNumberValidator($event)"
              style="padding:0; outline: none 0 !important; box-shadow: none;"
              class="form-control"
              :input-options="{placeholder: ''}"
              v-model="form.main_telephone_number"
              :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
              :preferredCountries="['UG']"
              mode="international"></vue-tel-input>
        </div>
      </div>

      <div class="mb-2">
        <label class="textColor text-sm"> <small>Alternative Telephone No </small></label>
        <div class="input-group">
          <vue-tel-input
              @input="handleInput('alternative')"
              @keypress="commons.onlyNumberValidator($event)"
              style="padding:0; outline: none 0 !important; box-shadow: none;"
              class="form-control"
              :input-options="{placeholder: ''}"
              v-model="form.alternative_telephone_number"
              :dropdown-options="{ showDialCodeInSelection: true, showFlags: true, showDialCodeInList: true}"
              :preferredCountries="['UG']"
              mode="international"></vue-tel-input>
        </div>
      </div>

         <div class="row">
          

        
    </div>
        <div class="text- mt-2">
          <div class="row">
            <div class="col-lg-8"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-0" style="color: white;float: right;">
                <small>Next &nbsp;<i class="bi bi-box-arrow-in-right"></i></small> 
                <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                  <span class="visually-hidden">Loading...</span>
                </div>
      </button>
            </div>
           
          </div>
        </div>

    </div>
    
  </form>
</div>
</template>



<style scoped>

.mb-8 {
    margin-bottom: 0.5rem !important;
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
}
.mb-2 {
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    /* font-size: 17px; */
    border-radius: 3px !important;
}
input{
  /* width:480px; */
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
.star{
  color:red;
}

</style>