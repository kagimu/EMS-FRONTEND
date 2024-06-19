<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import updateFoodMenuItem from "@/main/dashboard/catering/cateringComponents/updateFoodMenuItem.vue";

import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import AppModal from "@/components/AppModal.vue";


const showingModal = ref(false)
const isLoading = ref(true);
const loading = ref(true)
const editModal = ref(true)

const showModal = () => {
    showingModal.value = true
    thisDialog.value=false
}

const notificationStore = useNotificationStore()
const thisDialog = ref(false)
const updateMenuDialog = ref(false)
const menuItemsinfoData = ref(null)
const errorMessage = ref(null)
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const menuItemDataParts = ref([])
const cateringStore = useCateringStore()
const page = ref(1)
const per_page = ref(15)

const form = reactive({
    school_number:"",
    campus_number: "",
    type:""
})


onMounted(() => {
      schoolStore.fetchSchools()
    }
)


const filterBySchool = (school_number) => {
    if(school_number) {
      campusStore.fetchCampuses(school_number)
    }
}


const doFetchMenuItem = () => {
    let data = {
    page: page.value,
    per_page: per_page.value, 
     school_number:form.school_number,
     campus_number:form.campus_number,
     type:"ITEM"
    }
    cateringStore.fetchMenuItemPaginated(data)

}

const fetchFoodMenuItem = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content


      if(objArray && objArray.length > 0){
        objArray.forEach((list, i) => {

          list.key =  (current_page - 1) * per_page_item + i + 1

          const index = menuItemData.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            menuItemData.value.push(list);
          }

        })
      }


    }
  }

  watch(
    () => cateringStore.menuItemPaginatedResponse,
    async (data) => {
        fetchFoodMenuItem(data)
            isLoading.value = false;
    }
)


const filterByCampus = () =>{
    doFetchMenuItem()
}

const menuItemData=ref([])


const showUpdateDialog = (menuList) => {
    menuItemsinfoData.value = menuList
    showingModal.value = true
    thisDialog.value=false
}


const closeDialog = () => {
    thisDialog.value = false
    updateMenuDialog.value = false
}


const sta = ref(null)

const showItems = (primaryItemNumber) =>{
    sta.value=primaryItemNumber
    // alert(primaryItemNumber)
    cateringStore.fetchMenuItemDetails(primaryItemNumber)
}
const hideItems = () =>{
    sta.value=""
}




watch(
    () => cateringStore.menuItemDetailsResponse,
    async (data) => {
        menuItemDataParts.value = data
        loading.value=false;
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

//delete
const deleteThisData = (id,name) => {
if(!confirm("Are you sure, you want to delete: " + name)){
  return
}
}

</script>
<template>
    <div>

<AppModal v-model="showingModal" lg title="Update Menu Item">
    <NewMenuItem :menuItemsinfoData="menuItemsinfoData"></NewMenuItem>
</AppModal>


  <!-- wnd  -->

    <!-- end  -->
    <div class="row mt-3">
    <div class="col-12">
        <div class="">
        <div class="" style="padding: 0;">
         <div class="container mt-4">
           <div class="row">
              <div class="col-lg-12">
                <div class="">
                 <div class="">
                    <div class="row">
                    <div class="col-lg-8">
                    <h5 style="font-size: 14px;margin-top: 2px;">Menu Items </h5>
                    </div>

                <div class="col-lg-4">

                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    
    <!-- filters -->
    <div class="row">
              <div class="col-4">
                <div class="mb-2">
                

          <select
                  v-model="form.school_number"
                  class="form-select form-select-sm"
                  style="box-shadow: none;"
                  @change="filterBySchool(form.school_number)"           
          >
              <option disabled value="">--Select School--</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div>
              </div>

              <div class="col-4">
      <div class="mb-2">
        
          <select
                  v-model="form.campus_number"
                  class="form-select form-select-sm"
                  required style="box-shadow: none;"
                  @change="filterByCampus(form.campus_number)"
          >
              <option disabled value="">--Select Campus--</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div></div>

     
  


      <div class="col-4">
          <div class="mb-2">
              <input class="form-control mb-0" placeholder="Search..." type="text">
          </div>
     </div>

            </div>

<div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
        {{errorMessage}}
    </div>
    <table 
    id="datatable"
    class="table table-striped"
    style="font-size: 14px !important;"
    >
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Unit</th>
                <th>Current Quantity</th>
                <th>School</th>
                <th>Type</th>
                <th>Action</th>
            </tr>
        </thead>
    <tbody>

        <tr v-for="(list, index) in menuItemData" v-if="isLoading===false" :key="index">
          <td>{{ index+1 }}</td>
      <td>{{ list.name }} [{{ list.code }}]</td>
      <td>{{ list.unit_of_measure_name }}</td>
      <td>{{ list.current_quantity }}</td>
      <td>{{ list.school_name }}</td>
      <td>{{ list.type }}&nbsp;
       <span  v-if="list.type==='ASSEMBLED'">
        <ul class="list-group">
          <li class="list-group-item"  v-for="(ldData,idx) in list.parts" :key="idx">[{{ldData.code}}] {{ ldData.name }} - {{ ldData.quantity }} {{ ldData.unit_of_measure }}
                        <i class="bi bi-x" style="color: red;"></i>
                        </li>
            </ul>
       
        </span> 
        </td>
      <td>
          <button @click="showUpdateDialog(list)" >
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button" @click="deleteThisData(list.number,list.name)">
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
    
    
    </div>
    </template>
    

    
    
    
    <style scoped>
    
    </style>