<template>
    <div>


  <AppModal :title="editModel ? 'Edit ' + namee:'New Feeding Group'" v-model="showingModal" lg>
    <NewFeedingSession :groupData="dataList"></NewFeedingSession>
    </AppModal>

    <!-- <AppModal :title="editModel ? 'Edit ' + namee:'New Feeding Group'" v-model="showingModal" lg>
    <NewFeedingGroup :groupData="dataList"></NewFeedingGroup>
    </AppModal> -->

               
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
                    <h5 style="font-size: 14px;margin-top: 2px;">Feeding Sessions </h5>
                    </div>
    
                <div class="col-lg-4">
                <button
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
                  <label class="textColor"><small>School</small>  </label>

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
              <input class="form-control mt-1 mb-0" placeholder="Search..." type="text">
          </div>
     </div>

            </div>

    <table
    id="datatable"
    class="table table-hover caption-top mt-4 table-sm table-striped"
    style="font-size: 14px !important;"
    >
    <thead >
        <tr>
        <th>Code</th>
        <th>Name</th>
        <th>Action</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
      <tr v-for="(list, index) in feedingSessionGroupData" :key="index">
      <td>{{ list.code }}</td>
      <td>{{ list.name }}</td>
      <td>
        <button @click="editThisData(list)" data-bs-toggle="offcanvas" aria-controls="rolesDialogg">
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
    </template>
  <script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import NewFeedingSession from "@/main/dashboard/catering/cateringComponents/NewFeedingSession.vue";
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import AppModal from "@/components/AppModal.vue";

  const showingModal = ref(false)

  const showModal = () => {
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
  const notificationStore = useNotificationStore()
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


//delete
const deleteThisData = (id,name) => {
  if(!confirm("Are you sure, you want to delete: " + name)){
    return
  }else{
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
        // buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
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
  
  
    
    
    <style scoped>
    
    </style>