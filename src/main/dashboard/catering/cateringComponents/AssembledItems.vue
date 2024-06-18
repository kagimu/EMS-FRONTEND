<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import updateFoodMenuItem from "@/main/dashboard/catering/cateringComponents/updateFoodMenuItem.vue";

import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import AppModal from "@/components/AppModal.vue";
import MenuParts from "@/main/dashboard/catering/cateringComponents/MenuParts.vue";



const showingModal = ref(false)
const isLoading = ref(false);
const loading = ref(true)


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
const sta = ref(null)
const page = ref(1)
const per_page = ref(15)

const form = reactive({
    school_number:"",
    campus_number: "",
})


const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number ?? "")
}

const filter = (campusN) =>{
    // cateringStore.filterMenuItem(campusN)
    doFetchMenuItem()
}



const menuItemData=ref([])
const showDialog = () => {
    thisDialog.value = true
}

const showUpdateDialog = (a) => {
    menuItemsinfoData.value = a
    showingModal.value = true
    thisDialog.value=false
}

const cateringStore = useCateringStore()

const closeDialog = () => {
    thisDialog.value = false
    updateMenuDialog.value = false
}

onMounted(
    () => {

        schoolStore.fetchSchools()
    }

)



const doFetchMenuItem = () => {
    let data = {
    page: page.value,
    per_page: per_page.value, 
     school_number:form.school_number,
     campus_number:form.campus_number,
     type:"ASSEMBLED"
    }
    isLoading.value = true
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
        if(data) {
          isLoading.value = false;
          fetchFoodMenuItem(data)
        }
    }
)


const showItems = (primaryItemNumber) =>{
    sta.value=primaryItemNumber
    cateringStore.fetchMenuItemDetails(primaryItemNumber)
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
    () => cateringStore.filterMenuResponse,
    async (data) => {
        menuItemData.value = data.data
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
</script>
<template>
    <div>
      <!-- schedule interview -->
      <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show:thisDialog }" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Menu Item</small></h5>
          <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeDialog"></button>
        </div>
        <div class="offcanvas-body">
          <NewMenuItem></NewMenuItem>
        </div>
      </div>
      <!-- wnd  -->
      <!-- schedule interview -->
   
      <AppModal title="Update Menu Item" v-model="showingModal" lg>
        <NewMenuItem></NewMenuItem>
        <!-- <updateFoodMenuItem :menuItemsinfoData="menuItemsinfoData"></updateFoodMenuItem> -->
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
                            <h5 style="font-size: 14px;margin-top: 2px;">Assembled Items </h5>
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
                      <label class="textColor"><small>School</small>  </label>
                      <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.school_number"
                        @change="fetchCampuses(form.school_number)"           
                        >
                        <option disabled value="">--Select School--</option>
                        <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="mb-2">
                      <label class="textColor"><small>Campus</small>  </label>
                      <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.campus_number" required
                        @change="filter(form.campus_number)"
                        >
                         <option disabled value="">--Select campus--</option>
                        <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="mt-4">
                      <input type="text" class="form-control mt-1 mb-0" placeholder="Search..."> 
                    </div>
                  </div>
                </div>
                <div>
                  
                  <table 
                    id="datatable"
                    class="table table-hover caption-top mt-4 table-sm table-striped"
                    style="font-size: 14px !important;"
                    >
                    <thead >
                      <tr>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Qty</th>
                        <th>School</th>
                        <th>Parts</th>
                        <th>#</th>
                      </tr>
                      <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                        {{errorMessage}}
                      </div>
                    </thead>
                    <tbody>
                     
                      <tr v-if="isLoading===false" v-for="(list, index) in menuItemData" :key="index">
                        <td   v-if="list.type==='ASSEMBLED'">{{ list.name }} [{{ list.code }}]</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ list.unit_of_measure_name }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ list.current_quantity }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ list.school_name }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">
                          <span  v-if="list.type==='ASSEMBLED'">
                            <!-- <MenuParts :menuNumber="list.number"></MenuParts> -->
                     
                      
                        <ul>
                        <li  v-for="(ldData,idx) in list.parts" :key="idx">[{{ldData.code}}] {{ ldData.name }} - {{ ldData.quantity }} {{ ldData.unit_of_measure }}
                        <i class="bi bi-x" style="color: red;"></i>
                        </li>
                        </ul>
                   
                          </span>
                        </td>
                        <td   v-if="list.type==='ASSEMBLED'">
                          <button @click="showUpdateDialog(list)" >
                          <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                          </button>
                          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
                          <button type="button">
                          <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div v-if="isLoading" class="flex justify-center" >
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      </div>
                      
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