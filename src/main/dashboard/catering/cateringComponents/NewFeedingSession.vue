<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import { useAbility } from '@casl/vue';
   import useCommonsStore from "@/composables/useCommons.js";
   
   const commons = useCommonsStore()
   const { can } = useAbility()
   const  notificationStore  = useNotificationStore()
   const buttonLoader = ref(false)
   const cateringStore = useCateringStore()
   const campusList = ref([])
   const schoolList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const errorMessage = ref(null)
   const showSchool = ref("none")
   const Items = ref([])
   const itemOption = ref([])
   const isSelected = ref(true)
   
   const props = defineProps({
     groupData:[]
   })

   const form = reactive({
       name:null,
       status:"ACTIVE",
       school_number:null
   })
   
   onMounted(() => {
           schoolStore.fetchSchools()
           getFeedingPackInfo()
       }
   )

   const getFeedingPackInfo = () => {
    let draftData = props.groupData
    if(draftData.feeding_session_number){
           form.name = draftData.name;
           form.school_number = draftData.school_number;
           showSchool.value = "true"
           doFetchMenuItem()
           Items.value = props.groupData?.pack_items
         }
   }


   watch(
   () => props.groupData,
   async (data) => {
     getFeedingPackInfo()

   }
   )
   


   const addFeedingSessionGroup = () => {
    buttonLoader.value = true
   const menu_items = Items.value.map(itemData => ({
     menu_item_number: itemData?.item_number,
     quantity:parseFloat(itemData?.consumption_quantity.toString().replace(/,/g, ""))
   }))
   
       let myData = reactive({
       name:form.name,
       status:"ACTIVE",
       menu_items,
       school_number:form.school_number
       
   })
       
       if(props.groupData.feeding_session_number){
       let formD = {
         feeding_session_number:props.groupData.feeding_session_number,
         name:form.name,
         status:"ACTIVE",
         menu_items,
         school_number:form.school_number
       }
      //  alert(JSON.stringify(formD))
       cateringStore.updateFeedingSession(formD)
   }else{
       cateringStore.newFeedingGroupSessionsInfo(myData)
   }
      
   }
   
   
   
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
   if(!form.school_number){
   isSelected.value = false
   notificationStore.errorToast("Error", "Select School")
   }else{
   isSelected.value = true
   Items.value.push({ name: '', quantity: 1, cost: 0, amount: 0 });
   }
   
   }
   
   function removeItem(index) {
   Items.value.splice(index, 1);
   }
   
   
   function availableOptions(index) {
   const selectedNames = Items.value.map(item => item.name);
   return itemOption.value.filter(option => !selectedNames.includes(option.name) || option.name === Items.value[index].name);
   }
   
   const isAddButtonDisabled = ref(false);
   watch(Items, (newItems) => {
   isAddButtonDisabled.value = newItems.length === itemOption.value.length;
   }, { deep: true });
   
   
  //  const fetchMenuItems = () => {
  //      doFetchMenuItem()
  //  }
   
   
   const doFetchMenuItem = () => {
   if(props.groupData.feeding_session_number){
   let formD = {
   school_number:props.groupData.school_number,
   campus_number:form.campus_number
   }
   cateringStore.fetchMenuItem(formD)
   }else {
   let formD = {
   school_number:form.school_number,
   campus_number:form.campus_number
   }
   cateringStore.fetchMenuItem(formD)
   }
   
   
   }
   
   
   const compute = (value, index) => {
       if(value) {
         value = value.toString().replace(/,/g, "")
         if (!isNaN(value)) {
           value = value - 0;
         }
   
         let calculator = math.evaluate(value);
         Items.value[index].quantity = calculator >= 0 ? calculator.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
       }
   }
   
   
   watch(
   () => cateringStore.menuItemResponse,
   async (data) => {
     itemOption.value = data.map(option => ({ name: option.name, number: option.number }));
   },
   {deep: true}
   )
   
   watch (
       () => cateringStore.newFeedingGroupSessionsInfoResponse,
       async (data) => {
         if(data){
           buttonLoader.value = false
           notificationStore.successToast("Success", data.message)
         }
       },
       {deep:true}
   )
   
   watch (
       () => cateringStore.updateFeedingSessionResponse,
       async (data) => {
         if(data){
           buttonLoader.value = false
           notificationStore.successToast("Success", data.message) 
           form.name = ""
   
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
      
   watch(
       () => schoolStore.schoolsResponse,
       async (data) => {
           if (data) {
               schoolList.value = data.data
           }
       },
       {deep: true}
   )
   
   
   
   
</script>
<template>
   <!-- {{ groupData }} -->
   <div>
      <form @submit.prevent="addFeedingSessionGroup">
         <div class="row">
            <div class="col-lg-4">
               <div class="mb-2" v-if="showSchool">
                  <label class="textColor"><small>School</small> </label>
                  <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm" required
                     v-model="form.school_number"
                     @change="doFetchMenuItem(form.school_number)"
                     :style="!isSelected ? 'border:1px solid red' : '' "
                     >
                     <option disabled value="">Select School</option>
                     <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                     </option>
                  </select>
               </div>
               <div class="mb-2">
                  <label class="textColor"><small>Name</small></label>
                  <input v-model="form.name"   type="text" required class="form-control shadow-none" placeholder="eg. Break fast 1">
               </div>
            </div>
            <div class="col-lg-8">
               <div class="mt-2">
                  <table class="table table-hover caption-top mt-4 table-sm table-striped  text-[13px]">
                     <thead>
                        <tr class="" style="padding: 0px;margin: 0px;">
                           <th>Menu Item</th>
                           <th style="width: 25%;">Qty</th>
                           <th></th>
                        </tr>
                     </thead>
                     <tbody>
                      <!-- {{ Items }} -->
                        <tr v-for="(itemData, index) in Items" :key="index" >
                           <td>
                              <select
                                 class="form-select form-select-sm form-control shadow-none"
                                 v-model="itemData.item_number"
                                 @change="updateItem(index)">
                                 <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                              </select>
                           </td>
                           <td>
                              <input
                                 maxlength="20"
                                 type="text"
                                 v-model="itemData.consumption_quantity"
                                 @input="updateAmount(index)"
                                 @keypress="commons.onlyNumberValidator($event)"
                                 v-on:blur="compute(itemData.quantity, index)"
                                 placeholder=""
                                 class="form-control shadow-none">
                           </td>
                           <td>
                              <button
                                 type="button"
                                 @click="removeItem(index)">
                              <i class="bi bi-x-circle" style="color:red"></i>
                              </button>
                           </td>
                        </tr>
                     </tbody>
                  </table>
                  <div>
                     <button
                        class="btn btn-primary btn-sm textColor ml-3"
                        @click.prevent="addItem"
                        :disabled="isAddButtonDisabled">
                     <small><i class="bi bi-plus-lg"></i></small>
                     </button>
                  </div>
               </div>
            </div>
         </div>
         <div>
            <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mt-3"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog">
               <i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
               <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                  <span class="visually-hidden">Loading...</span>
               </div>
            </button>
         </div>
      </form>
   </div>
</template>