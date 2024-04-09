<template>
    <div>
      <div class="row">
        <div class="col-12">
            <div class="card-body" style="padding: 0;">
              <div class="mt-5">
                <form @submit.prevent="createStock">
                    <div class="row">
                        <div class="col-lg-4">
                            <div class="mb-2">
                            <label class="textColor"><small>School</small> </label>
                            <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm" required
                                    v-model="school_number"
                                    @change="fetchCampuses(school_number)"
                            >
                                <option disabled value="">Select School</option>
                                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                                </option>
                            </select>
                        </div>

                        <div class="mb-2">
                    <label class="textColor"><small>Campus</small>  </label>
                    <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.campus_number" required
                    >
                    <option disabled value="">Select campus</option>
                    <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                    </select>
                    </div>
                        </div>
                    </div>
                    <div class="row">
            
            <div class="col-lg-12">
              <!-- New Design -->
                <table class="table bordered">
                  <thead>
                    <tr class="" style="padding: 0px;margin: 0px;">
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(itemData, index) in Items" :key="index" >
                      <td>
                        <select class="form-select form-select-sm form-control select-no-border" v-model="itemData.name" @change="updateItem(index)">
                          <option :value="option.name" v-for="option in availableOptions(index)">{{ option.name }}</option>
                        </select>
                      </td>
                      <td><input type="text" v-model="itemData.quantity" @input="updateAmount(index)" placeholder="1.0" class="inp"></td>
                      <td><input type="text" v-model="itemData.cost" @input="updateAmount(index)" placeholder="Unit Price" class="inp"></td>
                      <td>{{ itemData.amount }}</td>
                      <td><button type="button" @click="removeItem(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                    </tr>
                  </tbody>
                </table>
                <button class="btn btn-primary btn-sm textColor" @click.prevent="addItem" :disabled="isAddButtonDisabled"><small>ADD ANOTHER ITEM</small></button>
                <div class="row mt-10">
                  <div class="col-lg-8"></div>
                  <div class="col-lg-4">
                    <ul style="float: right;">
                      <!-- <li>Subtotal - {{ calculateSubtotal() }}</li> -->
                      <li>Total : <span style="color:rgba(173, 12, 12, 0.92)">{{ calculateTotal() }}</span> </li>
                    </ul>
                  </div>
                </div>
            
              <!-- ends here -->
            </div>
          </div> 
                <div class="row mt-5">
               
            <div class="col-lg-4">
               
             </div>
             <div class="col-lg-4"></div>
             <div class="col-lg-4 ">
               <button type="submit" class="btn btn-sm btn-outline-primary mb-2 mt-1" style="float: right !important;margin-right: 0px;">
                 <small>Submit</small>
             <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
               <span class="visually-hidden">Loading...</span>
             </div>
           </button>
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
import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useRouter} from "vue-router"

import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";



const campusList = ref([])
const schoolList = ref([])
const studentInfoList = ref( [])
const routerData = useRouter()
const serviceStore= useServiceStore()
const  invoiceStore  = useInvoiceStore()
const router = useRouter()
const applicationStore= useApplicationStore()

let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const form = reactive({
    campus_number:null
})

const goBack = () => {
  window.history.back()
}

// Creating invoice Logic =========================================================
const Items = ref([]);
const itemOption = ref([])


onMounted(
    async () => {
      await applicationStore.fetchApplicationList()
    } )

    watch(
    () => applicationStore.applicationListResponse,
    async (data) => {
      if(data){
        studentInfoList.value = data.data
       
      }
    },
    {deep:true}
    )


function updateItem(index) {
  const item = Items.value[index];
  const selectedOption = itemOption.value.find(option => option.name === item.name);
  if (selectedOption) {
    item.cost = selectedOption.cost;
    updateAmount(index);
  }
}

function updateAmount(index) {
  const item = Items.value[index];
  item.amount = item.quantity * item.cost;
}

function addItem() {
  Items.value.push({ name: '', quantity: 1, cost: 0, amount: 0 });
}

function removeItem(index) {
  Items.value.splice(index, 1);
}

function calculateTotal() {
  return Items.value.reduce((total, item) => total + item.amount, 0);
}

function availableOptions(index) {
  const selectedNames = Items.value.map(item => item.name);
  return itemOption.value.filter(option => !selectedNames.includes(option.name) || option.name === Items.value[index].name);
}

const isAddButtonDisabled = ref(false);
watch(Items, (newItems) => {
  isAddButtonDisabled.value = newItems.length === itemOption.value.length;
}, { deep: true });

// =
onMounted(
  async () => {
    await serviceStore.fetchServicesList()
  } )

watch(
  () => serviceStore.servicesListResponse,
  async (data) => {
    if (data) {
      itemOption.value = data.map(option => ({ name: option.Item.name, cost: option.Item.cost }));
    }
  },
  { deep: true }
)

// Connect invoice store ==========================================
const createStock = () => {
  const item_price_and_quantity = Items.value.map(itemData => ({
      name: itemData.name,
      quantity: itemData.quantity,
      unitPrice: itemData.unitPrice,
      amount: itemData.amount
    }))

  const data = {
    campus_number:form.campus_number,
    item_price_and_quantity
  }
  alert(JSON.stringify(data))

}


watch (
  () => invoiceStore.newInvoiceResponse,
  async (data) => {
    if (data) {
      notificationStore.successToast("Success", data.message)
      // router.push({ name: 'invoice-details', params: { studentNumber }})
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
      //redirecting to another page
      // router.push({ name: 'invoice-details', params: { studentNumber }})
    }
  },
  { deep: true }
)

onMounted(() => {
        schoolStore.fetchSchools()
    }
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)

  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}


watch(
    () => campusStore.campusListResponse,
    async (data) => {
        if (data) {
            campusList.value = data.data
        }
    },
    {deep: true}
)

  

</script>
  
 
  
  
  
  