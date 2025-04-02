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
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import useCommonsStore from "@/composables/useCommons.js";
const confirmationRef = ref(null);

const showingModal = ref(false)
const isLoading = ref(false);
const loading = ref(true)
const tableLoader = ref(true)

const notificationStore = useNotificationStore()
const commons = useCommonsStore()
const cateringStore = useCateringStore()
const thisDialog = ref(false)

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
const per_page = ref(20)
const menuItemData=ref([])
const total_items = ref(0)
const total_rows = ref(0)

const form = reactive({
    school_number:"",
    campus_number: "",
})


const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number ?? "")
    doFetchMenuItem(school_number)
}

// const filter = (campusN) =>{
//     doFetchMenuItem()
// }

const showUpdateDialog = (menuList) => {
    menuItemsinfoData.value = menuList
    showingModal.value = true
    thisDialog.value=false
}



onMounted(
    () => {

        schoolStore.fetchSchools()
    }

)



const doFetchMenuItem = (schoolNumber) => {
      if(!form.school_number){
        return
      }
      let data = {
      page: 1,
      per_page: per_page.value,
      school_number:schoolNumber,
      campus_number:form.campus_number,
      type:"ASSEMBLED"
    }
    isLoading.value = true
    cateringStore.fetchMenuItemPaginated(data)

}


function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {
    if(!form.school_number){
      return
    }
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      school_number:form.school_number,
      campus_number:form.campus_number,
      type:"ITEM"
    }
    cateringStore.fetchMenuItemPaginated(data)

  }
}


const fetchFoodMenuItem = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page
      tableLoader.value = false

      let per_page_item = data.per_page;
      
      per_page.value = per_page_item;

      let objArray = data.content
      let totalItems = data?.total_rows


      if(objArray && objArray.length > 0){
      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      let count_items = (current_page * per_page_item)

      total_items.value = (count_items > totalItems) ? totalItems : count_items

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
    }
)


watch(
    () => cateringStore.updateItemAssemblyResponse,
    async (data) => {
      if (data) {
          showingModal.value = false
          menuItemData.value = []
         doFetchMenuItem()
      }
    }
)


const deleteThisData = async (id,name) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete this Item ? ");
if (agreed) {
  let data = {
 
  }
}


}


</script>
<template>
    <div>  
      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

      <AppModal title="Update Menu Item" v-model="showingModal" xl4>
        <NewMenuItem :menuItemsInfo="menuItemsinfoData"></NewMenuItem>
      </AppModal>
 
      
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
                      <label class="text-sm"><small>School</small>  </label>
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
                      <!-- <label class="text-sm"><small>Campus</small>  </label>
                      <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.campus_number" required
                        @change="filter(form.campus_number)"
                        >
                         <option disabled value="">--Select campus--</option>
                        <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                        </option>
                      </select> -->
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="mt-4">
                      <input type="text" class="form-control mt-1 mb-0" placeholder="Search..."> 
                    </div>
                  </div>
                </div>
                <div>


                  <PaginationTemplate
                    @perPageChanged="doFetchMenuItem"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>

                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">
                  <table 
                    id="datatable"
                    class="table table-hover caption-top mt-4 table-sm text-[12px] table-striped "
                    >
                    <thead >
                      <tr>
                        <th>#</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>User UOM</th>
                        <th>Purchase Unit</th>
                        <th>Qty</th>
                        <th >Unit Cost of Purchase</th>
                        <th>Parts</th>
                        <th class="w-[5%]">Action</th>
                      </tr>
                      <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                        {{errorMessage}}
                      </div>
                    </thead>
                    <tbody>
                     
                      <tr v-if="isLoading===false" v-for="(list, index) in menuItemData" :key="index">
                        <td   v-if="list.type==='ASSEMBLED'">{{ index+1}}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ list?.code }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ list?.name }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ list?.unit_of_measure_name }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ list?.purchase_unit_of_measure_name }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ commons.formatNumbersWithComma(list?.current_quantity) }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">{{ commons.formatNumbersWithComma(list?.unit_cost) }}</td>
                        <td   v-if="list.type==='ASSEMBLED'">
                          <div  v-if="list.type==='ASSEMBLED'">


                       <div class="border rounded-md my-2 cursor-pointer">
                         <div  v-for="(ldData,idx) in list.parts" :key="idx" class="hover:bg-[#dee2e6]" :class="(idx+1) !== list?.parts?.length?'border-bottom':''">
                           <div class="flex flex-grow justify-between px-3 py-1">
                             <div>{{(idx+1)}}. {{ ldData.name }} </div>
                             <div>{{ ldData.quantity }} {{ ldData.unit_of_measure }}</div>
                             <div>{{ ldData?.unit_cost?.toLocaleString() }}</div>
                           </div>
                         </div>
                       </div>

                   
                          </div>
                        </td>
                        <td   v-if="list.type==='ASSEMBLED'">
                          <button @click="showUpdateDialog(list)" class="mr-1" >
                          <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                          </button>

                          <button type="button" @click="deleteThisData(list)">
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
    </div>
  </template>

  <style scoped>
  </style>