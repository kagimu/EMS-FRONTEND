<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewFeedingGroup from "@/main/dashboard/catering/cateringComponents/NewFeedingGroup.vue";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import AppModal from "@/components/AppModal.vue";

import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

import { useAbility } from '@casl/vue';
const { can } = useAbility()


const showingModal = ref(false)
const campusList = ref([])
const schoolList = ref([])
const classList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const classStore = useClassesStore()
const errorMessage = ref(null)
// const school_number = ref(null)
const notificationStore = useNotificationStore()
const editModel = ref(false)

const showModal = () => {
  showingModal.value = true
  thisDialog.value=false
  editModel.value = false
  dataList.value = ""
}

const form = reactive({
  school_number:"",
  campus_class_number: null,
  campus_number: null,
})


const cateringStore = useCateringStore()
const thisDialog = ref(false)
const feedingGroupData = ref([])
const showDialog = () => {
  thisDialog.value = true
}

const closeDialog = () => {
  thisDialog.value = false
}

const fetchGroup = (school) => {
  cateringStore.fetchFeedingGroup(school)
}

watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
      feedingGroupData.value = data.data
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

      let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
 if(defaultSchoolNo){
    form.school_number= defaultSchoolNo
    cateringStore.fetchFeedingGroup(form?.school_number)
  }
  
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

//edit
const dataList = ref([])
const namee = ref(null)

const editThisData = (num) => {
  editModel.value = true
  dataList.value = num
  namee.value = num.name
  showingModal.value = true
}

const deleteThisData = async (id,name) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + name);
if (agreed) {
  let data = {
     feeding_group_number:id
    }
     cateringStore.deleteFeedingGroup(data)
}


}


watch (
    () => cateringStore.deleteFeedingGroupResponse,
    async (data) => {
      if(data){
        // buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        await cateringStore.fetchFeedingGroup(form?.school_number)
      
      
      }
    },
    {deep:true}
)


watch (
    () => cateringStore.editFeedingGroupInfoResponse,
    async (data) => {
      if(data){
        showingModal.value = false
        await cateringStore.fetchFeedingGroup(form?.school_number)
      }
    },
    {deep:true}
)
</script>
<template>
    <div>
      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
  <AppModal :title="editModel ? 'Edit ' + namee:'New Feeding Group'" v-model="showingModal" lg>
    <NewFeedingGroup :groupData="dataList"></NewFeedingGroup>
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
                   
                    </div>
    
                <div class="col-lg-4">
                <button v-if="can('create_feeding_group','general')"
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
              <div class="col-3">
                <div class="mb-2">
         
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="form.school_number"
                  @change="fetchGroup(form.school_number)"
          >
              <option disabled value="">-filter School -</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div>
              
              
</div>



            </div>

    <table
    id="datatable"
    class="table table-striped table table-hover caption-top table-sm"
    style="font-size: 14px !important;"
    >
    <thead >
        <tr>
          <th>#</th>
        <th>Name</th>
        <th>Status</th>
        <th>School</th>
        <th>Action</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
      <tr v-for="(list, index) in feedingGroupData" :key="index">
        <td>{{ index+1 }}</td>
      <td>{{ list.name }}</td>
      <td>{{ list.status }}</td>
      <td>{{ list.school_name }}</td>
      <td>
        <button v-if="can('edit_feeding_group','general')" @click="editThisData(list)" data-bs-toggle="offcanvas" aria-controls="rolesDialogg">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button v-if="can('delete_feeding_group','general')" type="button" @click="deleteThisData(list.number,list.name)">
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