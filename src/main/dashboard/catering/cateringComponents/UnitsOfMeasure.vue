<template>
    <div>


  
    <AppModal title="Add Unit of Measure" v-model="showUnitModal" lg>
      <NewUnitOfMeasurement></NewUnitOfMeasurement>
    </AppModal>

      
    <AppModal :title="'Edit' +' '+ namee" v-model="showEditModal" lg>
      <EditUnitsOfMeasure :unitData="unitOfMeasureList"></EditUnitsOfMeasure>
    </AppModal>

    <!-- end  -->
    <div class="row mt-3">
    <div class="col-12">
        <div class="">
        <div class="" style="padding: 0;">
         <div class="containe mt-4">
           <div class="row">
              <div class="col-lg-12">
                <div class="">
                 <div class="">
                    <div class="row">
                    <div class="col-lg-4">
                      <div class="mb-2 ml-2">
                        <p style="font-size: 14px;margin-top: 2px;" class="mb-2">Unit of Measure</p>
                    <select
                        v-model="schoolNumber"
                        class="form-select form-select-sm" required
                        style="box-shadow: none;"
                        @change="getMenuItemInfo(schoolNumber)"
                    >
                      <option disabled :value="null">Select School</option>
                      <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                      </option>
                    </select>
                  </div>
                       
                    </div>
    
                <div class="col-lg-4">
                 
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    
    <table
    id="datatable"
    class="table table-striped"
    style="font-size: 14px !important; width: 100%;"
    >
    <thead >
        <tr>
        <th>code</th>
        <th>Name</th>
        <th>Abbreviation</th>
        <th>Action</th>
        </tr>
    </thead>
    <tbody>
      <tr v-for="(list, index) in unitMeasurementData" :key="index">
      <td>{{ list?.code }}</td>
      <td>{{ list?.name }}</td>
      <td>{{ list?.abbreviation }}</td>
      <td>
        <button @click="editUnit(list)" data-bs-toggle="offcanvas" aria-controls="rolesDialogg">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button" @click="deleteUnitOfMeasurer(list.unit_of_measure_number,list.name)">
            <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
            <!-- <div class="spinner-border spinner-border-sm" role="status" v-if="deleteLoader" >
        <span class="visually-hidden">Loading...</span>
    </div> -->
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
    import NewUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/NewUnitOfMeasurement.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    import AppModal from "@/components/AppModal.vue";
    import EditUnitsOfMeasure from "@/main/dashboard/catering/cateringComponents/EditUnitsOfMeasure.vue";

    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    const schoolStore = useSchoolStore()
    const schoolList = ref([])

    const showUnitModal = ref(false)
    const cateringStore = useCateringStore()
    const thisDialog = ref(false)
    const unitMeasurementData = ref([])
    const notificationStore = useNotificationStore()
    const schoolNumber = ref("")
    const deleteLoader = ref(false)
    const showUnitMeasurement = () => {
    showUnitModal.value = true
    thisDialog.value=false

}

onMounted(
    () => {
      getMenuItemInfo()
      schoolStore.fetchSchools()
    } )

    const getMenuItemInfo = (unitN) =>{
      let data = {
        school_number:unitN
      }
      cateringStore.fetchUnitOfMeasureInfo(data)
    }

    const showDialog = () => {
        thisDialog.value = true
    }

    const closeDialog = () => {
        thisDialog.value = false
    }
  
    watch(
    () => cateringStore.UnitOfMeasureInfoResponse,
    async (data) => {
          unitMeasurementData.value = data.data
    },
    {deep: true}
  )

  //edit
  const unitOfMeasureList = ref([])
  const showEditModal = ref(false)
 const namee = ref(null)
  const editUnit = (num) => {
    unitOfMeasureList.value = num
    namee.value = num.name
    showEditModal.value = true
  }
//delete
  const deleteUnitOfMeasurer = (id,name) => {
deleteLoader.value = true;
if(!confirm("Are you sure, you want to delete: " + name)){
  return
}
// delete endpoint
cateringStore.deleteUnitOfMeasure(id)
}

watch(
    () => cateringStore.deleteUnitOfMeasureInfoResponse,
    async (data) => {
      deleteLoader.value = false
      notificationStore.successToast("Success", data.message)
      getMenuItemInfo()
    },
    {deep: true}
  )
  watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if (data) {
        schoolList.value = data.data
      }
    }
)

watch (
    () => cateringStore.updateUnitOfMeasureInfoResponse,
    async (data) => {
      if(data){
   
     showEditModal.value = false
     getMenuItemInfo()
      }
    },
    {deep:true}
)
    </script>
    
    
    
    <style scoped>
    
    </style>