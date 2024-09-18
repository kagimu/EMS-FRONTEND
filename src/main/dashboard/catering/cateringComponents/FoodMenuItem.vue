<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import AppModal from "@/components/AppModal.vue";
import PaginationTemplate from "@/components/PaginationTemplate.vue";

import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);



import { useAbility } from '@casl/vue';

const { can } = useAbility()


const showingModal = ref(false)
const isLoading = ref(true);
const loading = ref(true)
const tableLoader = ref(true)


const notificationStore = useNotificationStore()
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
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)


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
  if(!form.school_number){
    return
  }
  menuItemData.value = []
  let data = {
    page: 1,
    per_page: per_page.value,
    school_number:form.school_number,
    campus_number:form.campus_number,
    type:"ITEM"
  }
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
    tableLoader.value = false

    let per_page_item = data.per_page;

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
      fetchFoodMenuItem(data)
      isLoading.value = false;
    }
)


const filterByCampus = () =>{
  doFetchMenuItem()
}

const menuItemData=ref([])


const showUpdateDialog = (menuItemInfo) => {
  menuItemsinfoData.value = menuItemInfo
  showingModal.value = true
}





watch(
    () => cateringStore.menuItemDetailsResponse,
    async (data) => {
      menuItemDataParts.value = data
      loading.value=false;
    }
)


watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    }
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

watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
      if (data) {
        classList.value = data.data
      }
    }
)


watch(
    () => cateringStore.updateMenuItemResponse,
    async (data) => {
      if (data) {
        showingModal.value = false
        menuItemData.value = []
        doFetchMenuItem()
      }
    }
)


// const deleteThisData = (id,name) => {
//   if(!confirm("Are you sure, you want to delete: " + name)){
//     return
//   }

//   let data = {
//     menu_item_number:id
//   }
//   cateringStore.deleteMenuItem(data)

// }

const deleteThisData = async (id,name) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
if (agreed) {
  let data = {
    menu_item_number:id
  }
  cateringStore.deleteMenuItem(data)
}


}


watch(
    () => cateringStore.deleteMenuItemResponse,
    async (data) => {
      doFetchMenuItem()
      notificationStore.successToast("Success", data.message)
    }
)



</script>
<template>
  <div>
    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal v-model="showingModal"  title="Update Menu Item" xl4>
      <NewMenuItem :menuItemsInfo="menuItemsinfoData"></NewMenuItem>
    </AppModal>


    <!-- wnd  -->

    <!-- end  -->
    <div class="row mt-3">
      <div class="col-12">
        <div class="">
          <div class="" style="padding: 0;">
            <div class="container mt-4">



              <div>
                <h5 style="font-size: 14px;margin-top: 2px;">Menu Items </h5>
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
                        @change="filterByCampus()"
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


                <PaginationTemplate
                    @perPageChanged="doFetchMenuItem"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>




                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll"
                >
                  <table
                      id="datatable"
                      class="table table-hover table-sm text-[12px]">
                    <thead>
                    <tr>
                      <th>#</th>
<!--                      <th>Code</th>-->
                      <th>Name</th>
                      <th>Unit Of Use</th>
                      <th>Unit of Purchase</th>
                      <th>Current Quantity</th>
                      <th>Unit Cost</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(list, index) in menuItemData" v-if="isLoading===false" :key="index">
                      <td>{{ list?.key }}</td>
<!--                      <td>{{ list?.code }}</td>-->
                      <td>{{ list?.name }}</td>
                      <td>{{ list?.unit_of_measure_name }}</td>
                      <td>{{ list?.purchase_unit_of_measure_name }}</td>
                      <td>{{ list?.current_quantity }}</td>
                      <td>{{ list?.unit_cost }}</td>
                      <td>
                        <button v-if="can('edit_menu_item','general')" @click="showUpdateDialog(list)" >
                          <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                        </button>
                        &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
                        <button v-if="can('remove_menu_item','general')" type="button" @click="deleteThisData(list.number,list.name)">
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