<template>
    <div>
    <p class="ml-4 mt-4 mb-10" style="text-align: center !important;">Payments</p>
   </div>
<div class="container mt-0">
  <div>
      <div class="row">
            <div  style="padding: 0;">
        <div class="container mt-0">
          <form @submit.prevent="submitInvoice">
            <div class="row">      
              <div class="col-lg-12">              
                <div>
                  <div>
        <div class="mb-3">
          <div class="row align-services-center">
          <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="col-md-12">
            <ul class="list-group text-sm mb-4" style="border-radius: 0;">
              <li class="list-group-item" v-for="(item, index) in column" :key="index">
                <input class=" me-1" type="checkbox" :id="'itemCheckbox' + index" v-model="selectedservices" :value="(columnIndex * 7) + index">
                <label class=" cursor-pointer textColor" :for="'itemCheckbox' + index">{{ item.description }} - [ ugshs {{ item.cost }} ]</label>
              </li>
            </ul>
          </div>
          </div>
        </div>
  </div>  
      </div>

      <div class="text-end">
          <!-- <strong>Total: {{ total }}</strong> -->
        <div class="row">
          <div class="col-lg-7">
  
          </div>
          <div class="col-lg-2">
         <b>TOTAL</b> 
        </div>
        <div class="col-lg-3">
          <input style="color:rgb(15, 15, 15); border: none; font-size: 15px !important;font-weight: 600;" disabled  class="form-control" v-model="total">
        </div>
        </div>


  
      </div>
  
              </div>
  
            </div>
   <div class="text- mt-4">
          <div class="row">
          
            <div class="col-lg-4">
              <button @click="goBack()" type="button" class="btn btn-sm btn-success mb-2 mr-4" style="color: white;">
              <small><i class="bi bi-box-arrow-in-left"></i> Back</small>  
          </button>
            </div>
            <div class="col-lg-4"></div>
            <div class="col-lg-4">
              <button type="submit" class="btn btn-sm btn-primary mb-2 mr-4" style="color: white;float: right !important;margin-right: 0px;">
                <small><i class="bi bi-save"></i> Submit</small>
            <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
            </div>
          </div>
        </div>
            </form>
  
        </div>
    </div>
    </div>
    </div>
    </div>
    </template>
 


 
 <script setup>
    
  import {onMounted,reactive, ref, watch,computed} from "vue";
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"

  
const services = ref( [])
const serviceStore= useServiceStore()
const emit = defineEmits()


onMounted(
      async () => {
        await serviceStore.fetchServicesList()
      } )
      
      watch(
      () => serviceStore.servicesListResponse,
      async (data) => {
        if(data){
          services.value = data
        }
      },
      {deep:true}
  )
  const goBack = () => {
     emit("next", 2)
    }

const applicationNumber = '1203039490402st';
const invoice = ref({
  services
})

const selectAllAll = ref(false)
const selectedservices = ref([])

const total = computed(() => selectedservices.value.reduce((acc, index) => acc + invoice.value.services[index].cost, 0))

const columns = computed(() => {
  const services = invoice.value.services
  const numColumns = Math.ceil(services.length / 7)
  const columns = Array.from({ length: numColumns }, (_, columnIndex) => {
    const startIndex = columnIndex * 7
    return services.slice(startIndex, startIndex + 7)
  })
  return columns
})

const selectAllservices = () => {
  if (selectAllAll.value) {
    const allservices = invoice.value.services.map((_, index) => index)
    selectedservices.value = [...new Set([...selectedservices.value, ...allservices])]
  } else {
    selectedservices.value = []
  }
}

const submitInvoice = () => {
  const selectedservicesData = selectedservices.value.map(index => {
    const item = invoice.value.services[index]
    return item.number
  })
  const data = {
    services: selectedservicesData
  }
  alert(JSON.stringify(data))
 //function to create invoice goes here
}

  
    </script>
    
 <style scoped>
  .mb-8 {
    margin-bottom: 2rem;
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    font-size: 17px;
}
.mb-2 {
    text-align: left;
    color: rgb(0, 0, 0);
    font-family: Roboto, sans-serif;
    border-radius: 3px !important;
}
input{
  background-color: #f8f9fa;
  border-radius: 2px;
  font-size: 10px !important;
}
.tit{
  text-align: center;
  margin-top: 15px;
  text-decoration: underline;
}
.star{
  color:red;
}
textarea{
  border-radius: 2px !important;
}
select{
  border-radius: 2px !important;
}
.small-input {
  width: 150px;
  font-size: 13px;
}
</style> 

