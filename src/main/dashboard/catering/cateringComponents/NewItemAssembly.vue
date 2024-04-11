<template>
    <div>
      <div class="row">
        <div class="col-12">
            <div class="card-body" style="padding: 0;">
              <div class="mt-5">
                <form @submit.prevent="createFeedingSessionItem">
                  <div class="mb-3 mt-4 col-6">
                    <label>Primary Item</label>
                  <select class="form-select form-select-sm form-control " v-model="form.primary_item_number" @change="updateService(index)">
                    <option v-for="(list,index) in menuData" :key="index" :value="list.number" >{{ list.name }}</option>
                  </select>
                    </div>

                <div class="row">
                  <div class="col-lg-12">
                   
                    <!-- New Design -->
                      <table class="table table-striped">
                        <thead>
                          <tr class="" style="padding: 0px;margin: 0px;">
                            <th>Secondary Item</th>
                            <th>Quantity</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(menu, index) in menuItems" :key="index" > 
                            <td>
                              <select class="form-select form-select-sm form-control select-no-border" v-model="menu.secondary_item_number" @change="updateService(index)">
                                <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                              </select>
                            </td>

                            <td><input type="number" v-model="menu.quantity" placeholder="1.0" class="inp"></td>
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
    primary_item_number:null
  })
  
  const menuData = ref([])

  onMounted(
    async () => {
        cateringStore.fetchMenuItem()
        cateringStore.fetchFeedingGroupSessions()
    } )

  watch(
    () => cateringStore.menuItemResponse,
    async (data) => {
        if (data) {
          menuData.value = data.data
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



  function addItem() {
    menuItems.value.push({ name: '', quantity: 1 })
  }
  
  function removeMenuItem(index) {
    menuItems.value.splice(index, 1)
  }
  
  function availableOptions(index) {
    const selectedNames = menuItems.value.map(menu => menu.name);
    return menuOptions.value.filter(option => !selectedNames.includes(option.name) || option.name === menuItems.value[index].name)
  }


const createFeedingSessionItem = () => {
    const secondaryItemNumbers = menuItems.value.map(menu => {
        return {
            secondary_item_number: menu.secondary_item_number,
            quantity: menu.quantity
        }
    })

  const data = {
        primary_item_number: form.primary_item_number,
        secondary_item_quantity: secondaryItemNumbers
    }
    const formattedData = JSON.stringify(data)
    alert(formattedData)
    cateringStore.newAssemblyItem(formattedData)
}

watch(
    () => cateringStore.newAssemblyItemResponse,
    async (data) => {
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchAssemblyItem()
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
    form.primary_item_number = null
    menuItems.value = []
}

  </script>
  
  
  
  