<template>
    <div>


            <!-- schedule interview -->
          <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show:thisDialog }" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Stock</small></h5>
              <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeDialog"></button>
            </div>
            <div class="offcanvas-body">
        
            </div>
          </div>
  <!-- wnd  -->



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
    
     <!-- filters -->
     <div class="row">
              <div class="col-4">
                <div class="mb-2">
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
              </div>

              <div class="col-4">
      <div class="mb-2">
          <label class="textColor"><small>Campus</small>  </label>
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="form.campus_number" required
                  @change="fetchClasses(form.campus_number)"
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
    
    <table
    id="datatable"
    class="table table-striped"
    style="font-size: 14px !important;"
    >
    <thead >
        <tr>
        <th style="width: 2px;">#</th>
        <th>Menu Item</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Campus</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
    <tr v-for="(list, index) in stockData" :key="index">
      <td>{{ index+1 }}</td>
      <td>{{ list.menu_item_name }}</td>
     <td> {{ list.quantity }}</td>
     <td>{{ list.unit_cost }}</td>
     <td>{{ list.campus_name }}</td>
     <td>
          <button >
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
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
    
    <script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import useNotificationStore from "@/composables/useNotification.js";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";

    const notificationStore = useNotificationStore()
    const cateringStore = useCateringStore()
    const errorMessage = ref(null)
    const stockData = ref([])

    const campusList = ref([])
    const schoolList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const classStore = useClassesStore()
    const school_number = ref(null)
    
    const form = reactive({
    school_number:null,
    campus_class_number: null,
    campus_number: null,
    })


    const closeDialog = () => {
        thisDialog.value = false
    }

    onMounted(() => {
        cateringStore.fetchStock()
    }
  )

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
//delete
const deleteThisData = (id,name) => {
if(!confirm("Are you sure, you want to delete: " + name)){
  return
}
}
    </script>
    
    
    
    <style scoped>
    
    </style>