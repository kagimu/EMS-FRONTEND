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
<div class="offcanvas offcanvas-end" tabindex="-1" id="updateMenuDialog" :class="{ show:updateMenuDialog }" aria-labelledby="offcanvasRightLabel">
<div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Update Menu Item</small></h5>
    <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeDialog"></button>
</div>
<div class="offcanvas-body">
    <updateFoodMenuItem :menuItemsinfoData="menuItemsinfoData"></updateFoodMenuItem>
</div>
</div>

<AppModal title="Update Menu Item" v-model="showingModal" lg>
  <updateFoodMenuItem :menuItemsinfoData="menuItemsinfoData"></updateFoodMenuItem>
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
                <!-- <button
                style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
                data-bs-toggle="offcanvas" aria-controls="rolesDialogg" @click="showDialog">
                <small> <b><i class="bi bi-plus"></i></b>
                Add New</small></button> -->
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
              <option disabled value="">Select School</option>
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
              <!-- <option disabled value="">Select campus</option> -->
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div></div>

   
      <div class="col-4">
          <div class="mt-4">
              <input type="text" class="form-control mt-1 mb-0" placeholder="Search..."> 
          </div>
     </div>

            </div>

<div>
    <table 
    id="datatable"
    class="table table-striped"
    style="font-size: 14px !important;"
    >
    <thead >
        <tr>
          <th>#</th>

        <th>Name</th>
        <th>Unit</th>
        <th>Current Quantity</th>
        <th>Campus</th>
        <th>Type</th>
        <th>Action</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
 
      <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    </div>

        <tr v-if="isLoading==false" v-for="(list, index) in menuItemData" :key="index">
          <td>{{ index+1 }}</td>
      <td>{{ list.name }} [{{ list.code }}]</td>
      <td>{{ list.unit_of_measure_name }}</td>
      <td>{{ list.current_quantity }}</td>
      <td>{{ list.campus_name }}</td>
      <td>{{ list.type }}&nbsp;
       <span  v-if="list.type=='ASSEMBLED'"><button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i  class="bi bi-eye" style="color:rgb(3, 85, 148)" @click="showItems(list.number)"></i>
          </button><button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
            <i class="bi bi-dash" style="color:rgb(3, 85, 148)" @click="hideItems"></i>
          </button>
          <div  v-if="sta==list.number">
          <span v-for="(listD,indx) in menuItemDataParts" :key="indx">

    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    </div>
            <ul v-if="loading==false">
              <li  v-for="(ldData,idx) in listD.parts" :key="idx">{{ ldData.name }}</li>
            </ul>
          </span>
        </div>
        </span> 
        </td>
      <td>
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
  </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    
    
    </div>
    </template>
    
    <script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import useNotificationStore from "@/composables/useNotification.js";
    import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    import updateFoodMenuItem from "@/main/dashboard/catering/cateringComponents/updateFoodMenuItem.vue";
  
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
    import AppModal from "@/components/AppModal.vue";


const showingModal = ref(false)
const isLoading = ref(true);
const loading = ref(true)

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
    const classStore = useClassesStore()
    const school_number = ref(null)
    const menuItemDataParts = ref([])

    const form = reactive({
    school_number:null,
    campus_number: null,
    })

    
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}

const filter = (campusN) =>{
   cateringStore.filterMenuItem(campusN)
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
      cateringStore.fetchMenuItem()
    }

)
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
    () => cateringStore.menuItemResponse,
    async (data) => {
        menuItemData.value = data.data
        isLoading.value = false; 
    },
    {deep: true}
  )

  
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
    
    
    
    <style scoped>
    
    </style>