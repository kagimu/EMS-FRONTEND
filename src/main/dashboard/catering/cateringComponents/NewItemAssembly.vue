<template>
    <div>
      <div class="row">
        <div class="col-12">
            <div class="card-body" style="padding: 0;">
              <div class="mt-5">
                <form @submit.prevent="createFeedingSessionItem">
                <div class="row">
                  <div class="col-lg-12">
                    <!-- New Design -->
                      <table class="table table-striped">
                        <thead>
                          <tr class="" style="padding: 0px;margin: 0px;">
                            <th>Primary Item</th>
                            <th>Secondary Item</th>
                            <th>Quantity</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(menu, index) in menuItems" :key="index" >
                            <td>
                              <select class="form-select form-select-sm form-control select-no-border" v-model="menu.primary_item_number" @change="updateService(index)">
                                <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                              </select>
                            </td>
                            
                            <td>
                              <select class="form-select form-select-sm form-control select-no-border" v-model="menu.secondary_item_number" @change="updateService(index)">
                                <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                              </select>
                            </td>

                            <td><input type="text" v-model="menu.quantity" placeholder="1.0" class="inp"></td>
                            <td><button type="button" @click="removeMenuItem(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                          </tr>
                        </tbody>
                      </table>
                      <button class="btn btn-primary btn-sm textColor" @click.prevent="addItem" :disabled="isAddButtonDisabled"><small>ADD ANOTHER ITEM</small></button>
                    
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
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
  import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";



  const serviceStore= useServiceStore()
  const  invoiceStore  = useInvoiceStore()
  let errorMessage = ref(null)
  const  notificationStore  = useNotificationStore()
  const feedingSessionGroupData = ref([])
 
  const Services = ref([]);
  const menuOptions = ref([])

  const cateringStore = useCateringStore()
  const menuItems = ref([])
  const menuItemOptions = ref([])
 
  const form = reactive({
    feeding_session_number:null
  })

  onMounted(
    async () => {
        cateringStore.fetchMenuItem()
        cateringStore.fetchFeedingGroupSessions()
    } )

  watch(
    () => cateringStore.menuItemResponse,
    async (data) => {
        if (data) {
        menuOptions.value = data.data.map(option => ({ number: option.number,name:option.name}));
      }
    },
    {deep: true}
  )

  watch(
  () => cateringStore.feedingGroupSessionsInfoResponse,
  async (data) => {
      feedingSessionGroupData.value = data.data
  },
  {deep: true}
)


  onMounted(
    async () => {
      await serviceStore.fetchServicesList()
    } )
  
    
  watch(
    () => serviceStore.servicesListResponse,
    async (data) => {
      if (data) {
        // menuOptions.value = data.map(option => ({ name: option.Item.name}));
      }
    },
    { deep: true }
  )


  
  function addItem() {
    menuItems.value.push({ name: '', quantity: 1 });
  }
  
  function removeMenuItem(index) {
    menuItems.value.splice(index, 1);
  }
  
  function availableOptions(index) {
    const selectedNames = menuItems.value.map(menu => menu.name);
    return menuOptions.value.filter(option => !selectedNames.includes(option.name) || option.name === menuItems.value[index].name);
  }
  
//   const isAddButtonDisabled = ref(false);
//   watch(Services, (newServices) => {
//     isAddButtonDisabled.value = newServices.length === menuOptions.value.length;
//   }, { deep: true });
  

  
  const createFeedingSessionItem = () => {
    const selectedData = menuItems.value.map(service => ({
        primary_item_number: service.primary_item_number,
        secondary_item_number: service.secondary_item_number,
        quantity: service.quantity,
      }))
  
    const data = {
      quantity: 1,
      selectedData
    }
    alert(JSON.stringify(data))

  }
  
  </script>
  
  
  
  