<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

import ConfirmationModal from "@/components/ConfirmationModal.vue";
import useCommonsStore from "@/composables/useCommons.js";
const confirmationRef = ref(null);



const notificationStore = useNotificationStore()
const commons = useCommonsStore()
const cateringStore = useCateringStore()
const errorMessage = ref(null)
const stockData = ref([])

const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const menuItemList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()


  const  school_number = ref("")
  const  campus_number = ref("")
  const  menu_item_number = ref("")


  onMounted(() => {
      schoolStore.fetchSchools()
      
  let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
  let defaultCampusNo =   localStorage.getItem("defaultCampusNo")
  let defaultCampusCurriculumNo =   localStorage.getItem("defaultCampusCurriculumNo")


 if(defaultSchoolNo){
    school_number.value = defaultSchoolNo
    fetchCampuses(school_number.value)
  }

  if(defaultCampusNo){
    campus_number.value = defaultCampusNo
  }

    }
)


const fetchCampuses = () => {
  campusStore.fetchCampuses(school_number.value)
  fetchAllStock()
}

const fetchMenuItemFilter = () => {
  fetchAllStock()
  doFetchMenuItem()
}




const fetchAllStock = () => {
  let data = {
    school_number:school_number.value,
    campus_number:campus_number.value,
    menu_item_number:menu_item_number.value
  }
  cateringStore.fetchStock(data)
}


const doFetchMenuItem = () => {
  menuItemList.value = []
  let formD = {
    school_number:school_number.value,
    campus_number:campus_number.value
  }
  cateringStore.fetchMenuItem(formD)
}


watch(
    () => cateringStore.stockResponse,
    async (data) => {
      stockData.value = data.data
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

watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
      if (data) {
        classList.value = data.data
      }
    },
    {deep: true}
)


const deleteThisData = async (id,name) => {
const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete this item " + name);
if (agreed) {
  let data = {
 
  }
}


}


watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)

watch(
    () => cateringStore.menuItemResponse,
    async (data) => {

      menuItemList.value = data.map(option => ({ name: option.name, number: option.number }));


    }
)

</script>
<template>
    <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
    <!-- end  -->
    <div class="row mt-3">
    <div class="col-12">
        <div class="cad">
        <div class="card-bod" style="padding: 0;">
         <div class="container mt-4">
           <div class="row">
              <div class="col-lg-12">
                <div class="">
                 <div class="">
                    <div class="row">
                    <div class="col-lg-8">
                    <h5 style="font-size: 14px;margin-top: 2px;">Stock</h5>
                    </div>
    
                <div class="col-lg-4">
              
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>


           <div class="grid grid-cols-3 gap-2 px-3 mb-4">

             <div>
               <div>
                 <label class="text-sm"><small>School</small> </label>
                 <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm" required
                     v-model="school_number"
                     @change="fetchCampuses">
                   <option disabled value="">--Select School--</option>
                   <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                   </option>
                 </select>
               </div>
             </div>

             <div>
               <label class="text-sm"><small>Campus</small>  </label>
               <select
                   style="box-shadow: none;"
                   class="form-select form-select-sm"
                   v-model="campus_number" required
                   @change="fetchMenuItemFilter">
                 <option disabled value="">--Select campus--</option>
                 <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                 </option>
               </select>
             </div>

             <div>
               <label class="text-sm"><small>Item</small>  </label>
               <select
                   style="box-shadow: none;"
                   class="form-select form-select-sm"
                   v-model="menu_item_number" required
                   @change="fetchAllStock">
                 <option disabled value="">--Select Item--</option>
                 <option v-for="(list, index) in menuItemList" :key="index" :value="list.number">{{ list.name }}
                 </option>
               </select>

             </div>
           </div>

    
    <table
    id="datatable"
    class="table table-striped text-xs text-gray-600"
    style="font-size: 14px !important;"
    >
    <thead>
        <tr class="font-bold">
        <td>#</td>
        <td>Menu Item</td>
        <td>Quantity</td>
        <td>Unit Price</td>
        <td>Campus</td>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
    <tr v-for="(list, index) in stockData" :key="index">
      <td>{{ index+1 }}</td>
      <td>{{ list.menu_item_name }}</td>
     <td> {{ commons.formatNumbersWithComma(list.quantity) }}</td>
     <td>{{ commons.formatNumbersWithComma(list.unit_cost) }}</td>
     <td>{{ list.campus_name }}</td>
     <td>
          <!-- <button >
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button> -->
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button" @click="deleteThisData(list.number,list.menu_item_name)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
          </button>
      </td>
    </tr>
                
    </tbody>
    </table>
    </div>
    </div>
    </div>
    </div>
    </div>
    
    
    </div>
    </template>
    

    
    
    
    <style scoped>
    
    </style>