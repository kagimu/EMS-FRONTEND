<template>
    <div>
      <div class="row">
        <div class="col-12">
            <div class="card-body" style="padding: 0;">
                <div class="row">
            <div class="col-lg-3 mt-5 mb-4">
            <label class="textColor"><small>Feeding Session</small></label>
            <select v-model="form.feeding_session_number" class="form-control form-select"> 
            <option disabled value="">Select</option>
            <option v-for="(list, index) in feedingSessionGroupData" :key="index" :value="list.number">{{list.name}}</option>
            </select>

            </div>
                </div>
              <div class="mt-1">
                <form @submit.prevent="createFeedingSessionItem">
        
            <div class="row">
            <div class="col-lg-12">
              <!-- New Design -->
                <table class="table bordered">
                  <thead>
                    <tr class="" style="padding: 0px;margin: 0px;">
                      <th>Item</th>
                      <th>Quantity</th>                   
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
                      <td><input type="number" v-model="itemData.quantity" @input="updateAmount(index)" placeholder="1.0" class="inp"></td>
                      <td><button type="button" @click="removeItem(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                    </tr>
                  </tbody>
                </table>
                <button class="btn btn-primary btn-sm textColor" @click.prevent="addItem" :disabled="isAddButtonDisabled"><small>ADD ANOTHER ITEM</small></button>
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
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

const campusList = ref([])
const schoolList = ref([])
const school_number = ref(null)
let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const cateringStore = useCateringStore()
const feedingSessionGroupData = ref([])

const form = reactive({
    feeding_session_number:null
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




onMounted(
    async () => {
        cateringStore.fetchMenuItem()
    } )

  watch(
    () => cateringStore.menuItemResponse,
    async (data) => {
        if (data) {
        itemOption.value = data.data.map(option => ({ name: option.name, number: option.number }));
      }
    },
    {deep: true}
  )


const createFeedingSessionItem = () => {
  const menu_item_quantity = Items.value.map(itemData => ({
      menu_item_number: itemData.menu_item_number,
      quantity: itemData.quantity,
    }))

  const data = {
    feeding_session_number:form.feeding_session_number,
    menu_item_quantity
  }
  // alert(JSON.stringify(data))
  cateringStore.newFeedingGroupSessionsItemsInfo(data)
}

watch(
    () => cateringStore.newFeedingGroupSessionsItemsInfoResponse,
    async (data) => {
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchFeedingSessionsItems()
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
    form.feeding_session_number = null
    Items.value = []
}


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

onMounted(() => {
      cateringStore.fetchFeedingGroupSessions()
  }
)

watch(
  () => cateringStore.feedingGroupSessionsInfoResponse,
  async (data) => {
      feedingSessionGroupData.value = data.data
  },
  {deep: true}
)

  

</script>
  
  