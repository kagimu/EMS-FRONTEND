<template>
    <div>


            <!-- schedule interview -->
          <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialogg" :class="{ show:thisDialog }" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasRightLabel"><small>Feeding Group</small></h5>
              <button type="button" class="btn-close"  data-bs-dismiss="offcanvas" aria-label="Close" @click="closeDialog"></button>
            </div>
            <div class="offcanvas-body">
            <NewFeedingGroup></NewFeedingGroup>
            </div>
          </div>
  <!-- wnd  -->
  

  <AppModal title="Feeding Group" v-model="showingModal" lg>
    <NewFeedingGroup></NewFeedingGroup>
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
                    <h5 style="font-size: 14px;margin-top: 2px;">Feeding Group </h5>
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
              <div class="col-3">
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
          <th>#</th>
        <th>Name</th>
        <th>Status</th>
        <th>Campus</th>
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
      <td>{{ list.campus_name }}</td>
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
    import NewFeedingGroup from "@/main/dashboard/catering/cateringComponents/NewFeedingGroup.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
    import AppModal from "@/components/AppModal.vue";

    const showingModal = ref(false)
    const campusList = ref([])
    const schoolList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const classStore = useClassesStore()
    const school_number = ref(null)

    const showModal = () => {
    showingModal.value = true
    thisDialog.value=false
}
    
    const form = reactive({
    school_number:null,
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

    onMounted(() => {
        cateringStore.fetchFeedingGroup()
    }
)

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