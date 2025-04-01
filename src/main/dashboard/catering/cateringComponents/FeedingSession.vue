  <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import NewFeedingSession from "@/main/dashboard/catering/cateringComponents/NewFeedingSession.vue";
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import AppModal from "@/components/AppModal.vue";
  import ConfirmationModal from "@/components/ConfirmationModal.vue";

  
import { useAbility } from '@casl/vue';
  import useCommonsStore from "@/composables/useCommons.js";

const { can } = useAbility()
  const notificationStore = useNotificationStore()
  const commons = useCommonsStore()

const confirmationRef = ref(null);
  const showingModal = ref(false)

  const showModal = () => {
  dataList.value = ""
  showingModal.value = true
  thisDialog.value=false
  editModel.value = false
  }


  const form = reactive({
    school_number:"",
})

  const schoolList = ref([])
  const schoolStore = useSchoolStore()
  const cateringStore = useCateringStore()
  const thisDialog = ref(false)
  const feedingSessionGroupData = ref([])
  const showDialog = () => {
      thisDialog.value = true
  }

  const closeDialog = () => {
      thisDialog.value = false
  }

  onMounted(() => {
      // cateringStore.fetchFeedingGroupSessions()
      schoolStore.fetchSchools()
  }
)

const filterBySchool = (school_number) => {
    doFetchFeedingSessions()
}


const doFetchFeedingSessions = () => {
    let data = {
     school_number:form.school_number
    }
    cateringStore.fetchFeedingGroupSessions(data)

}

watch(
  () => cateringStore.feedingGroupSessionsInfoResponse,
  async (data) => {
      feedingSessionGroupData.value = data.data
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

//edit
const dataList = ref([])
const namee = ref(null)
const editModel = ref(false)

const editThisData = (num) => {
  editModel.value = true
  dataList.value = num
  namee.value = num.name
  showingModal.value = true
}


const deleteThisData = async (id,name) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
if (agreed) {
     // delete endpoint
     let data = {
      feeding_session_number:id
    }
     cateringStore.deleteFeedingSession(data)
}


}


watch (
    () => cateringStore.deleteFeedingSessionResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        doFetchFeedingSessions()

      
      }
    },
    {deep:true}
)

watch (
        () => cateringStore.newFeedingGroupSessionsInfoResponse,
        async (data) => {
          if(data){
            showingModal.value = false
            doFetchFeedingSessions()
          }
        },
        {deep:true}
    )

watch (
    () => cateringStore.updateFeedingSessionResponse,
    async (data) => {
      if(data){
      showingModal.value = false
      doFetchFeedingSessions()
      }
    },
    {deep:true}
)

  
watch (
        () => cateringStore.updateFeedingSessionResponse,
        async (data) => {
          if(data){
            showingModal.value = false
            doFetchFeedingSessions()
          }
        },
        {deep:true}
    )
  </script>


<template>
  <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

      <AppModal :title="editModel ? 'Edit ' + namee:'New Feeding Pack'" v-model="showingModal" xl4>
        <NewFeedingSession :groupData="dataList"></NewFeedingSession>
      </AppModal>

             
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
                  <h5 style="font-size: 14px;margin-top: 2px;">Menu Packs </h5>
                  </div>
  
              <div class="col-lg-4">
              <button v-if="can('create_menu_pack','general')"
              style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"  
              @click="showModal()">
              <small> <b><i class="bi bi-plus"></i></b>
              Add New</small></button>
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

 </div>
    <div class="col-4">
        <div class="mt-4">
        </div>
   </div>

          </div>


  <div class="grid grid-cols-12 gap-4 my-4">
      <div
          v-for="(list, index) in feedingSessionGroupData" :key="index"
          class="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4">
        <div class="border rounded-md h-[200px]">
          <div class="bg-[#f7f7f7] px-2 py-2 rounded-t-md">
     
            <div class="">

              <div class="flex flex-grow justify-between text-xs text-gray-600">
              <div>
                <div class="font-bold">{{ list?.name }}</div>
                <div class="text-red-800">Cost: Shs {{ commons.formatNumbersWithComma(list?.pack_cost) }}</div>
              </div>

              <div>
                <button
                v-if="can('edit_menu_pack','general')"
                    @click="editThisData(list)">
                  <i class="bi bi-pencil-square mr-2" style="color:rgb(3, 85, 148);"></i>
                </button>
                <button v-if="can('delete_menu_pack','general')" type="button" @click="deleteThisData(list.feeding_session_number,list.name)">
                  <i class="bi bi-trash" style="color:rgb(201, 10, 10);"></i>
                </button>
              </div>

            </div>
            
            </div>



          </div>
          <div class="max-h-[140px] overflow-y-scroll scrollbar-thin">
            <table class="table table-hover table-sm table-striped text-[12px] mt-3">
              <th>Name</th>
              <th>Qty</th>
              <th>User UOM</th>
              <tbody>
              <tr v-for="menuItem in list.pack_items" :key="menuItem.number" class="m-1">
                <td>{{ menuItem.name }}</td>
                <td>{{ commons.formatNumbersWithComma(menuItem.consumption_quantity) }}</td>
                <td>{{ menuItem.unit_of_consumption.name }}</td>
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
  </div>
  
  
  </div>
  </template>
  
  
    
    
    <style scoped>
    
    </style>