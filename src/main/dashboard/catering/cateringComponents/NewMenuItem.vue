<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/NewUnitOfMeasurement.vue";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import AppModal from "@/components/AppModal.vue";
import useCommonsStore from "@/composables/useCommons.js";

const commons = useCommonsStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const notificationStore = useNotificationStore()
const cateringStore = useCateringStore()


const showUnitModal = ref(false)
const thisDialog = ref(false)
const buttonLoader = ref(false)
const campusList = ref([])
const schoolList = ref([])
const feedingSessionGroupData = ref([])
const menuOptions = ref([])
const menuItems = ref([])
const unitMeasurementData = ref([])
const item_number = ref(null)


onMounted(() => {
      schoolStore.fetchSchools()
      // cateringStore.fetchUnitOfMeasureInfo()
      getMenuItemInfo()
    }
)

const props = defineProps({
  menuItemsInfo:{}
})



const form = reactive({
  primary_item_number:null
})



const menuForm = reactive({
  name:null,
  code:null,
  type:"",
  unit_of_measure_number:"",
  campus_number:"",
  base_price:null,
  school_number:null,
  conversion_to_purchase_unit :null,
  purchase_unit_of_measure_number :""
} )

watch(
    () => props.menuItemsInfo,
    async (data) => {
      if(data) {
        getMenuItemInfo()
      }
    }
)



const getMenuItemInfo = () =>{
  let draft  = props.menuItemsInfo
  if (draft?.number){
        item_number.value = draft?.number ?? ""
        menuForm.name = draft?.name ?? ""
        menuForm.code = draft?.code ?? ""
        menuForm.type = draft?.type ?? ""
        menuForm.unit_of_measure_number = draft?.unit_of_measure_number ?? ""
        menuForm.campus_number = draft?.number ?? ""
        menuForm.base_price = draft?.unit_cost ?? ""
        menuForm.school_number = draft?.school_number ?? ""
        menuForm.purchase_unit_of_measure_number = draft?.purchase_unit_of_measure_number
        if(draft?.parts?.length > 0) {
          let items = draft?.parts
          items.forEach(lst => {
            lst.secondary_item_number = lst.number
          })
          menuItems.value = items
          doFetchMenuItem(draft.school_number)
        }
  }
}

const showUnitMeasurement = () => {
  showUnitModal.value = true
  thisDialog.value=false
}




watch(
    () => cateringStore.UnitOfMeasureInfoResponse,
    async (data) => {
      unitMeasurementData.value = data.data
    },
    {deep: true}
)



const addMenuItem = () =>{

  if(menuForm.type === 'ITEM'){
    menuForm.code = parseInt(menuForm.code)
    menuForm.base_price = parseFloat(menuForm.base_price)
    menuForm.conversion_to_purchase_unit = parseFloat(menuForm.conversion_to_purchase_unit.toString().replace(/,/g, ""))
    buttonLoader.value = true
    if(item_number.value){
      menuForm.menu_item_number = item_number.value
      cateringStore.updateMenuItem(menuForm)
    }else {
      // alert(JSON.stringify(menuForm))
      cateringStore.newMenuItemInfo(menuForm)
    }

  }else{
    //prepare data
    const secondaryItemNumbers = menuItems.value.map(menu => {
      return {
        secondary_item_number: menu.secondary_item_number,
        quantity:parseInt(menu.quantity)
      }
    })


    let myData = reactive({
      name:menuForm.name,
      code:parseInt(menuForm.code),
      type:menuForm.type,
      unit_of_measure_number:menuForm.unit_of_measure_number,
      campus_number:menuForm.campus_number,
      secondary_items:secondaryItemNumbers,
      school_number:menuForm.school_number

    })
    buttonLoader.value = true

    if(item_number.value){
      myData.menu_item_number = item_number.value
      cateringStore.updateAssemblyItem(myData)
    }else {
      cateringStore.newAssemblyItem(myData)
    }

  }
}

watch(
    () => cateringStore.newMenuItemInfoResponse,
    async (data) => {

      notificationStore.successToast("Success", data.message)

          menuForm.name=null,
          menuForm.code=null,
          menuForm.type=null,
          menuForm.unit_of_measure_number=null,
          menuForm.campus_number=null
          menuForm.conversion_to_purchase_unit=null,
          menuForm.purchase_unit_of_measure_number=""
          buttonLoader.value = false
    },
    {deep: true}
)





watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)




watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)

const doFetchMenuItem = (school_number) => {
  let data = {
    school_number:school_number
  }
  cateringStore.fetchMenuItem(data)

  let dataa = {
        school_number:school_number
      }
      cateringStore.fetchUnitOfMeasureInfo(dataa)
}

watch(
    () => cateringStore.menuItemResponse,
    async (data) => {
      menuOptions.value = data.map(option => ({ number: option.number,name:option.name}));
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

const compute = (value) => {
  value = value.toString().replace(/,/g, "")
  if (!isNaN(value)) {
    value = value - 0;
  }
  menuForm.conversion_to_purchase_unit = eval(value) >= 0 ? eval(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
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
    secondary_items: secondaryItemNumbers
  }
  const formattedData = JSON.stringify(data)

  cateringStore.newAssemblyItem(formattedData)
}

watch(
    () => cateringStore.newAssemblyItemResponse,
    async (data) => {
      notificationStore.successToast("Success", data.message)
      clearFormData()
      buttonLoader.value = false;
    },
    {deep: true}
)

watch(
    () => cateringStore.updateItemAssemblyResponse,
    async (data) => {
      if (data) {
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch(
    () => cateringStore.updateMenuItemResponse,
    async (data) => {
      if (data) {
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
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
<template>
    <div class="mt-1">

    
    <AppModal v-model="showUnitModal" lg title="Add Unit of Measure">
      <NewUnitOfMeasurement></NewUnitOfMeasurement>
    </AppModal>




<form @submit.prevent="addMenuItem">

  <div class="row">

    <div class="col-lg-6">
<div class="mb-2">
  <label class="textColor"><small>School</small> </label>
  <select
      v-model="menuForm.school_number"
      class="form-select form-select-sm" required
      style="box-shadow: none;"
      @change="doFetchMenuItem(menuForm.school_number)"
  >
    <option disabled :value="null">Select School</option>
    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
    </option>
  </select>
</div>




      <div class="mb-2">
            <label class="textColor"><small>Code</small></label>
            <input
                v-model="menuForm.code"
                class="form-control shadow-none"
                maxlength="10"
                required
                type="text"
                @paste.prevent
                @keypress="commons.codeValidator($event)">
          </div>

          <div class="mb-2">
        <label class="textColor"><small>Item Name</small></label>
        <input v-model="menuForm.name"   class="form-control shadow-none" required type="text">
      </div>
 
</div>





    
       
        <div class="col-lg-6">

          
          <div class="mb-2">
            <label class="textColor"><small> Unit of use</small></label>
            <div class="input-group">
            <select
                v-model="menuForm.unit_of_measure_number"
                class="form-control form-select shadow-none" id="inputGroupSelect02">
              <option disabled value="">--Select Unit of use--</option>
              <option v-for="(list, indx) in unitMeasurementData" :key="indx" :value="list.unit_of_measure_number">{{list.name}}</option>
            </select>
            <span class="input-group-text p-0 px-1"  ><i  class="bi bi-plus-circle" @click="showUnitMeasurement()"></i></span>
          </div>
        </div>

          <div class="mb-2">
        <label class="textColor"><small>Conversion Purchase Unit</small></label>
            <input
                v-model="menuForm.conversion_to_purchase_unit"
                @keypress="commons.onlyNumberValidator($event)"
                v-on:blur="compute(menuForm.conversion_to_purchase_unit)"
                class="form-control shadow-none"
                maxlength="20"
                required
                type="text"
                @paste.prevent>
          </div>

          <div class="mb-2">
            <label class="textColor"><small>Purchase Unit of measure</small></label>
            <div class="input-group">
            <select
                v-model="menuForm.purchase_unit_of_measure_number "
                class="form-control form-select shadow-none" id="inputGroupSelect02">
              <option disabled value="">--Select Purchase Unit of measure--</option>
              <option v-for="(list, index) in unitMeasurementData" :key="index" :value="list.unit_of_measure_number">{{list.name}}</option>
            </select>
            <span class="input-group-text p-0 px-1"  ><i  class="bi bi-plus-circle" @click="showUnitMeasurement()"></i></span>
          </div>
        </div>
       
     
      

      <div class="mb-2" v-if="menuForm.type === 'ITEM'">
        <label class="textColor"><small>Unit Price</small></label>
        <input
            v-model="menuForm.base_price"
            class="form-control shadow-none"
            maxlength="10"
            required
            type="text"
            @keypress="commons.numbersOnlyValidator($event)">
      </div>

      <div class="mb-2">
        <label class="textColor"><small>Item Type</small> </label>
        <select
            v-model="menuForm.type"
            class="form-select form-select-sm" required
            style="box-shadow: none;"

        >
          <option disabled value="">Select Type</option>
          <option value="ITEM">Ingredients (ITEM)</option>
          <option>ASSEMBLED</option>
        </select>
      </div>
    </div>
  </div>
  
  
 



<div v-if="(menuForm.type==='ASSEMBLED') && menuForm.school_number">
    <div class="mx-auto">

      <div class="mt-4 text-[15px] ml-3">Assembled Items</div>

      <table class="table table-hover caption-top  border-t table-sm table-striped">
          <thead>
            <tr>
              <td>#</td>
              <td>Item</td>
              <td><div class="pl-4">Quantity</div></td>
              <td><div class="pl-4">Action</div></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(menu, index) in menuItems" :key="index" >
              <td class="text-sm text-[#8a8888]">{{(index + 1)}}</td>
              <td>
                <select v-model="menu.secondary_item_number" class="form-select form-control select-no-border border">
                  <option v-for="option in availableOptions(index)" :value="option.number">{{ option.name }}</option>
                </select>
              </td>

              <td>
                <input
                    v-model="menu.quantity"
                    class="form-control shadow-none ml-5"
                    maxlength="10"
                    placeholder="1.0"
                    type="text"
                    @keypress="commons.numbersOnlyValidator($event)">
              </td>
              <td>
                <div  class="ml-5">
                  <button
                      v-if="index > 0"
                      type="button"
                      @click="removeMenuItem(index)">
                    <i class="bi bi-x-lg" style="color:red"></i>
                  </button>
                </div>

              </td>
            </tr>
          </tbody>
        </table>

          <div>
            <button
                class="btn btn-primary btn-sm textColor ml-3"
                @click.prevent="addItem">
              <small>ADD ANOTHER ITEM</small>
            </button>
          </div>


    </div>
</div>


<div class="mt-4 mb-5 flex justify-between">
  &nbsp;
    <button
        class="btn btn-primary btn-sm float-end mb-2 mr-4"
        type="submit">
            <i class="bi bi-arrow-right-circle mr-2"></i>
            <small>{{menuItemsInfo ? "Edit" : "submit" }}</small>
            <div v-if="buttonLoader" class="spinner-border spinner-border-sm" role="status" >
                <span class="visually-hidden">Loading...</span>
            </div>
    </button>
</div>

 

</form>
    </div>
</template>
 

    <style>
  .bi.bi-plus-lg {
    cursor: pointer; /* Change cursor to pointer on hover */
}

.bi.bi-plus-lg:hover {
    color: blue; /* Change color on hover */
}

</style>