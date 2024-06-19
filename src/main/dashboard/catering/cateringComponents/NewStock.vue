<script setup>
import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

import useCommonsStore from "@/composables/useCommons.js";
const commons = useCommonsStore()


const buttonLoader = ref(false)
const campusList = ref([])
const schoolList = ref([])
// const school_number = ref(null)
let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const cateringStore = useCateringStore()

const form = reactive({
  campus_number:null,
  school_number:null
})

const Items = ref([]);
const itemOption = ref([])

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


onMounted(() => {
      schoolStore.fetchSchools()
    }
)



const createStock = () => {
  const item_price_and_quantity = Items.value.map(itemData => ({
    menu_item_number: itemData.menu_item_number,
    quantity: parseInt(itemData.quantity),
    unit_price: parseInt(itemData.unitPrice),
    unit_cost: parseInt(itemData.amount)
  }))

  const data = {
    campus_number:form.campus_number,
    item_price_and_quantity
  }
  // alert(JSON.stringify(data))
  cateringStore.newStock(data)
}

watch(
    () => cateringStore.newStockResponse,
    async (data) => {
      notificationStore.successToast("Success", data.message)
      cateringStore.fetchStock()
      clearFormData()
    },
    {deep: true}
)

watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep: true}
)

const clearFormData = () => {
  school_number.value = null
  form.campus_number = null
  Items.value = []
}



const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
}

const doFetchMenuItem = () => {
  let formD = {
    school_number:form.school_number,
    campus_number:form.campus_number
  }
  cateringStore.fetchMenuItem(formD)
}


watch(
    () => cateringStore.menuItemResponse,
    async (data) => {

      itemOption.value = data.map(option => ({ name: option.name, number: option.number }));

      // if(data && data.data) {
      //   itemOption.value = data.data.map(option => ({ name: option.name, number: option.number }));
      // }
    },
    {deep: true}
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
<template>
    <div>
      <div class="row">
        <div class="col-12">
            <div class="card-body" style="padding: 0;">
              <div class="mt-5">
                <form @submit.prevent="createStock">
                    <div class="row mx-auto">
                        <div class="col-lg-4">
                            <div class="mb-2">
                            <label class="textColor"><small>School</small> </label>
                            <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm" required
                                    v-model="form.school_number"
                                    @change="fetchCampuses(form.school_number)"
                            >
                                <option disabled value="">Select School</option>
                                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                                </option>
                            </select>
                        </div>
                        </div>
                        <div class="col-lg-4">

                        <div class="mb-2">
                    <label class="textColor"><small>Campus</small>  </label>
                    <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm"
                    v-model="form.campus_number" required
                    @change="doFetchMenuItem()"
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
                <table class="table table-hover caption-top mt-4 table-sm table-striped">
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
                        <select class="form-select form-select-sm form-control select-no-border" v-model="itemData.menu_item_number" @change="updateItem(index)">
                          <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                        </select>
                      </td>
                      <td><input   @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10" type="text" v-model="itemData.quantity" @input="updateAmount(index)" placeholder="1.0" class="inp"></td>
                      <td><input  @keypress="commons.numbersOnlyValidator($event)"
            maxlength="10" type="text" v-model="itemData.cost" @input="updateAmount(index)" placeholder="Unit Price" class="inp"></td>
                      <td>{{ itemData.amount }}</td>
                      <td><button type="button" @click="removeItem(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                    </tr>
                  </tbody>
                </table>


              <div>
                <button
                    class="btn btn-primary btn-sm textColor ml-3"
                    @click.prevent="addItem"
                    :disabled="isAddButtonDisabled">
                  <small>ADD ANOTHER ITEM</small>
                </button>
              </div>


              <div class="row mt-10 mx-auto">
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
                <div class="flex flex-grow justify-between">
                  &nbsp;
                     <div class="mr-3 mb-10">
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



  
 
  
  
  
  