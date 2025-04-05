<script setup>
import { onMounted, ref, watch, reactive, computed } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import NewBillables from "@/main/settings/bills/NewBillables.vue";
import { useBillStore } from "@/main/settings/bills/store/bills.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import BillableDetails from "@/main/settings/bills/BillableDetails.vue";

const notificationStore = useNotificationStore();
const schoolStore = useSchoolStore();
const mymodal = ref(false);
const errorMessage = ref(null);
const loader = ref(false);
const { can } = useAbility();
const schoolList = ref([]);
const billStore = useBillStore();
const school_number = ref("");
const billableData = ref([]);
const modalDetails = ref(false);
const billD = ref(null);
const billablesInfo = ref([]);
const searchQuery = ref(""); // Search query ref

onMounted(async () => {
  schoolStore.fetchSchools();

       let defaultSchoolNo =   localStorage.getItem("defaultSchoolNo")
      if(defaultSchoolNo){
        school_number.value = defaultSchoolNo
        }
        doFetchBillables(school_number.value)
});

const showModal = () => {
  billablesInfo.value = "";
  mymodal.value = true;
};

const showModalDetails = (billNumber) => {
  modalDetails.value = true;
  billD.value = billNumber;
};

const editModalBillables = (billables) => {
  mymodal.value = true;
  billablesInfo.value = billables;
};

const doFetchBillables = (schoolN) => {
  let data = {
    school_number: schoolN,
  };
  billStore.fetchBillable(data);
};

watch(
  () => billStore.newBillableResponse,
  async (data) => {
    if (data) {
      billStore.fetchBillable(data);
    }
  },
  { deep: true }
);

watch(
  () => billStore.billableResponse,
  async (data) => {
    if (data) {
      billableData.value = data.data;
    }
  },
  { deep: true }
);

watch(
  () => schoolStore.schoolsResponse,
  async (data) => {
    if (data) {
      schoolList.value = data.data;
    }
  },
  { deep: true }
);

watch(
  () => billStore.newBillableResponse,
  async (data) => {
    if (data) {
      mymodal.value = false;
    }
  },
  { deep: true }
);

watch(
  () => billStore.errorMessage,
  async (data) => {
    if (data) {
      errorMessage.value = data.message;
      notificationStore.errorToast("Error", data.message);
      loader.value = false;
    }
  },
  { deep: true }
);

watch(
  () => billStore.updateBillableResponse,
  async (data) => {
    if (data) {
      mymodal.value = false;
      let data = {
        school_number: schoolN,
      };
      billStore.fetchBillable(data);
    }
  }
);

// Computed property for filtered billable data based on search query
const filteredBillableData = computed(() => {
  if (!searchQuery.value) {
    return billableData.value;
  }
  return billableData.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});
</script>



<template>
    <div>
      <AppModal title="Creating New Billable" v-model="mymodal" xl6>
        <NewBillables :userNumber="userNumber" :billablesInfo="billablesInfo" :schoolN="school_number"></NewBillables>
      </AppModal>

      <AppModal title="Billable" v-model="modalDetails" xl6>
        <BillableDetails :billableNumber="billD"></BillableDetails>
      </AppModal>

  
      <div class="rw mt-3"  >
        <div class="">
       <div class="row">
        <div class="col-lg-4">
        </div>
        <div class="col-lg-8">
          <button  @click="showModal()" class="btn btn-primary btn-sm mb-2 mr-2" style="float: right;" v-if="can('create_billables','general')">
          <small><i class="bi bi-plus"> Add New Billable</i></small></button></div>
       </div>
         
            <div class="card-bdy" style="padding: 0;">
    <div class="m-2">

      <div class="row">
       
                  <div class="col-lg-4">
                    <div class="mb-2">
            <!-- <label class="text-sm"><small>School</small></label> -->
         <select
                 style="box-shadow: none;"
                 class="form-select form-select-sm" required
                 v-model="school_number"
                 @change="doFetchBillables(school_number)"
         >
             <option disabled value="">-filter School -</option>
             <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
             </option>
         </select>
     </div>
     </div>
     <div class="col-lg-4"></div>
     <div class="col-lg-4">
      <input type="text" placeholder="search ..." class="form-control" v-model="searchQuery">
     </div>
     </div>
  
      <table
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;width: 100%;"
      >
        <thead>
          <tr>
            <th>No.</th>
            <th>Amount</th>
            <th>Campus</th>
            <!-- <th>Academic Year</th> -->
            <th>StudyPeriod</th>
            <th>Class</th>
            <th>Curriculum</th>
            <th>ModeOfStudy</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
 
        <tbody>
          
          <!-- {{ billableData }} -->
         <tr  v-for="(list, index) in  filteredBillableData" :key="index" >
        
          <td>{{ index+1 }}</td>
          <td>{{ list.total_amount?.toLocaleString() }}</td>
          <td>{{ list.campus_name }}</td>
          <td>{{ list.study_period_name }}</td>
          <td>{{ list.class_name }}</td>
          <td>{{ list.curriculum_name }}</td>
          <td>{{ list.mode_of_study_name }}</td>
          <td>{{ list.bill_type.replace("_", " ") }}</td>
          <td>{{list.status}}</td>
          <td>

            <button v-if="can('edit_billables','general')" data-bs-toggle="offcanvas" aria-controls="rolesDialogg"  @click="editModalBillables(list.billable_number)">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button v-if="can('delete_billables','general')" type="button" @click="showModalDetails(list.billable_number)">
            <i class="bi bi-eye" style="color:blue"></i>
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
    
  
  
  
    <div>
  
  
  
  
    </div>
    </template>
  
  
  
  
  <style>
  
  </style>
 