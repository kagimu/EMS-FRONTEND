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
    
    onMounted(() => {
            schoolStore.fetchSchools()
            if(props.groupData.number != ""){
            // form.code = props.groupData.code;
            form.name = props.groupData.name;
            form.school_number = props.groupData.school_number;
            showSchool.value = "true"
          }
        }
    )
    
    const form = reactive({
        // code:null,
        name:null,
        status:"ACTIVE",
        campus_number:null,
        school_number:null
    })
    const addFeedingSessionGroup = () => {

  const menu_items = Items.value.map(itemData => ({
      menu_item_number: itemData.menu_item_number,
      quantity: parseInt(itemData.quantity),
    }))

        let myData = reactive({
        // code:parseInt(form.code),
        name:form.name,
        status:"ACTIVE",
        menu_items,
        school_number:form.school_number
        
    })
        buttonLoader.true
        if(props.groupData.number){
        if(!confirm("Sure want Edit " + props.groupData.name )){
          return
        }
        let formD = {
          feeding_session_number:props.groupData.number,
          name:form.name,
          // code:parseInt(form.code),
          status:"ACTIVE",
          school_number:form.school_number
        }
        cateringStore.updateFeedingSession(formD)
    }else{
        // alert(JSON.stringify(myData))
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
if(!form.campus_number){
  isSelected.value = false
  notificationStore.errorToast("Error", "No Campus Selected ! ")
}else{
  isSelected.value = true
  Items.value.push({ name: '', quantity: 1, cost: 0, amount: 0 });
}

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
    },
    {deep: true}
  )



    watch (
        () => cateringStore.newFeedingGroupSessionsInfoResponse,
        async (data) => {
          if(data){
            buttonLoader.value = false
            notificationStore.successToast("Success", data.message)
            // await cateringStore.fetchFeedingGroupSessions()
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
            // form.code = ""
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
                   @change="fetchCampuses(form.school_number)"
                   >
                   <option disabled value="">Select School</option>
                   <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                   </option>
                </select>
             </div>
             <div class="mb-2">
                <label class="textColor"><small>Campus</small>  </label>
                <select
                   class="form-select form-select-sm"
                   v-model="form.campus_number" required
                    @change="doFetchMenuItem()"
                    :style="!isSelected ? 'border:1px solid red' : '' "
                   >
                   <option disabled value="">Select campus</option>
                   <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                   </option>
                </select>
             </div>
             <!-- <div class="mb-2" >
                <label class="textColor"><small>Code</small></label>
                <input
                   v-model="form.code"
                   @keypress="commons.codeValidator($event)"
                   maxlength="10"
                   type="text"
                   @paste.prevent
                   required
                   class="form-control shadow-none">
             </div> -->
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
                   <tr v-for="(itemData, index) in Items" :key="index" >
                      <td>
                         <select
                            class="form-select form-select-sm form-control shadow-none"
                            v-model="itemData.menu_item_number"
                            @change="updateItem(index)">
                            <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                         </select>
                      </td>
                      <td>
                         <input
                            @keypress="commons.numbersOnlyValidator($event)"
                            maxlength="10"
                            type="text"
                            v-model="itemData.quantity"
                            @input="updateAmount(index)"
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
