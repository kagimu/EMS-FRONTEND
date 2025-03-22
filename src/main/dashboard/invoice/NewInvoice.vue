<script setup>
import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useRouter} from "vue-router"
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useCommonsStore from "@/composables/useCommons.js";
const commons = useCommonsStore()

const studentInfoList = ref( [])
const routerData = useRouter()
const serviceStore= useServiceStore()
const  invoiceStore  = useInvoiceStore()
const router = useRouter()
const applicationStore= useApplicationStore()
let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const isAddButtonDisabled = ref(false);
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const studentNumber = routerData.currentRoute.value.query.st_id;
const user_number = ref(null)
const buttonLoader = ref(false)
const school_number = ref(null)

const props = defineProps({
  userNumber:String,
  studentDataInfo:{}
})

// Creating invoice Logic =========================================================
const Services = ref([{ name: "", quantity: 1, cost: 0, amount: 0 }]);
const ServiceOptions = ref([])

const form = reactive({
  due_date:null,
  description:null
})

watch(
    () => props.userNumber,
    async (data) => {
      if(data){
        user_number.value = props.userNumber
      }
    },
    {deep:true}
)



onMounted(
    async () => {
      // await serviceStore.fetchServicesList()
      // await applicationStore.fetchApplicationList()
      fetchCurrentSchoolInfo()
      fetchServicesData()
    } )


    const fetchCurrentSchoolInfo = () => {
  let draft = props.studentDataInfo
  school_number.value = draft?.current_enrollment?.school_number
}

watch (
    () => props.studentDataInfo,
    async (data) => {
      if (data) {
        fetchCurrentSchoolInfo()
      }
    }
)


const fetchServicesData = () => {
  let data = {
    school_number:school_number.value
  }

  serviceStore.fetchServicesList(data)
}




watch(
    () => applicationStore.applicationListResponse,
    async (data) => {
      if(data){
        studentInfoList.value = data.data

      }
    },
    {deep:true}
)


function updateService(index) {
  const Service = Services.value[index];
  const selectedOption = ServiceOptions.value.find(option => option.item_number === Service.number);
  if (selectedOption) {
    Service.cost = selectedOption.cost;
    updateAmount(index);
  }
}

function updateAmount(index) {
  const Service = Services.value[index];
  Service.amount = Service.quantity * Service.cost;
}

function addService() {
  Services.value.push({ name: "", quantity: 1, cost: 0, amount: 0 });
}

function removeService(index) {
  Services.value.splice(index, 1);
}

function calculateTotal() {
  return Services.value.reduce((total, Service) => total + Service.amount, 0);
}

function availableOptions(index) {
  const selectedNames = Services.value.map(Service => Service.number);
  return ServiceOptions.value.filter(option => !selectedNames.includes(option.item_number) || option.item_number === Services.value[index].number);
}


watch(Services, (newServices) => {
  isAddButtonDisabled.value = newServices.length === ServiceOptions.value.length;
}, { deep: true });



watch(
    () => serviceStore.servicesListResponse,
    async (data) => {
      if (data) {
        ServiceOptions.value = data.map(option => ({ name: option.item.name, cost: option.item.cost,item_number:option.item.number }));
      }
    },
    { deep: true }
)

// Connect invoice store ==========================================
const createInvoice = () => {
  buttonLoader.value=true
  const selectedItems = Services.value.map(
      service => ({
        item_number: service.number,
        quantity: parseInt(service.quantity),
        // unitPrice: service.unitPrice,
        unit_cost: parseInt(service.cost)
      }))


  let data = {
    user_number:props.userNumber,
    due_date : form.due_date,
    description:form.description,
    items:selectedItems,
    // student_number:studentNumber
  }
//  alert(JSON.stringify(data))
  invoiceStore.createNewInvoice(data)
}


watch (
    () => invoiceStore.newInvoiceResponse,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
        buttonLoader.value=false
        form.description = null,
            form.due_date = null
      }
    },
    { deep: true }
)

watch (
    () => invoiceStore.errorMessage,
    async (data) => {
      if (data) {
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    { deep: true }
)

</script>
<template>
  <div>
    <div class="row">
      <div class="col-12">
          <div class="card-body" style="padding: 0;">
            <div class="container mt-4">
              <form @submit.prevent="createInvoice">
                <div class="row">
                  <div class="col-lg-5">
                     <div class="mb-2">
                      <label class="text-sm">Due Date</label>
                      <input
                      type="date"
                      v-model="form.due_date"
                      required
                      class="form-control shadow-none py-2">
                   </div>

                  </div>
                  <div class="col-lg-7">
                    <div class="mb-2">
                    <label class="text-sm">Description</label>
                    <textarea
                        v-model="form.description"
                        required
                        class="form-control shadow-none h-[4rem]"></textarea>
                  </div>

                  </div>

                </div>
               
              <div class="row mt-3">
        
                <div class="col-lg-12">
                  <!-- New Design -->
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th class="w-[5%]">#</th>
                          <th class="w-[30%]">Item</th>
                          <th class="w-[20%]">Quantity</th>
                          <th class="w-[20%]">Unit Price</th>
                          <th class="w-[20%]">Amount</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="" v-for="(Service, index) in Services" :key="index" >
                          <td>{{(index + 1)}}</td>
                          <td>
                            <select
                                class="form-control shadow-none py-2"
                                v-model="Service.number" @change="updateService(index)">
                              <option disabled value="">--Select item--</option>
                              <option :value="option.item_number" v-for="option in availableOptions(index)">
                                {{ option.name }} ({{ option.cost }})
                              </option>
                            </select>
                          </td>
                          <td>
                            <input class="form-control shadow-none py-2" maxlength="10"  required  type="text"
                             @keypress="commons.numbersOnlyValidator($event)" 
                              v-model="Service.quantity" 
                              @input="updateAmount(index)" placeholder="1.0" >
                            </td>
                          <td>
                            <input
                                readonly
                                type="text"
                                v-model="Service.cost"
                                @keypress="commons.numbersOnlyValidator($event)" 
                                @input="updateAmount(index)"
                                placeholder="Unit Price"
                                class="form-control shadow-none py-2" >
                          </td>
                          <td>{{ Service.amount }}</td>
                          <td><button type="button" @click="removeService(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                        </tr>
                      </tbody>
                    </table>
                    <button
                        class="btn btn-primary btn-sm text-sm"
                        @click.prevent="addService"
                        :disabled="isAddButtonDisabled">
                        <small class="px-4">
                          <i class="bi bi-plus-lg" title="Add Item"></i> Add Item
                        </small>
                    </button>
                    <div class="row mt-10">
                      <div class="col-lg-8"></div>
                      <div class="col-lg-4">
                        <ul style="float: right;">
                          <li>Total : <span style="color:rgba(173, 12, 12, 0.92)">{{ calculateTotal() }}</span> </li>
                        </ul>
                      </div>
                    </div>
                
                </div>
              </div> 
              <div class="row">
             
             <div class="col-lg-4">
            
           </div>
           <div class="col-lg-4"></div>
           <div class="col-lg-4 ">
             <button type="submit" class="btn btn-sm btn-primary mb-2 mt-1" style="float: right !important;margin-right: 0px;">
               <small>Create Invoice</small>
           <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
             <span class="visually-hidden">Loading...</span>
           </div>
         </button>
           </div>
          
           </div>
             </form>
            </div>
          </div>
          <hr>
        </div>
      
    </div>
  </div>
</template>



<style>
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
  /* font-size: 10px !important; */
}
select{
  background-color: transparent;
  border-radius: 2px;
  font-size: 10px !important;
}
.star{
  color:red;
}
.text-sm2{
  /* font-size: 1px !important; */
}
  .select-no-border {
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
  }
  .inp{
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
  }

</style>
