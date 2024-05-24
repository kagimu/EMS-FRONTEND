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
                    <div class="col-lg-8">
                    <h5 style="font-size: 14px;margin-top: 2px;">Unit of Measure</h5>
                    </div>
    
                <div class="col-lg-4">
                <!-- <button
                style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4" @click="showUnitMeasurement()">
                <small> <b><i class="bi bi-plus"></i></b>
                Add New</small></button> -->
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
        <th>Action</th>
        </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
    {{errorMessage}}
    </div>
    </thead>
    <tbody>
      <tr v-for="(list, index) in unitMeasurementData" :key="index">
      <td>{{ list.code }}</td>
      <td>{{ list.name }}</td>
      <td>
        <button @click="editUnit(list)" data-bs-toggle="offcanvas" aria-controls="rolesDialogg">
            <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
          </button>
          &nbsp;<span style="color: rgba(200, 195, 195, 0.363);"></span>&nbsp;
          <button type="button" @click="deleteUnitOfMeasure(list.number,list.name)">
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
    import NewUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/NewUnitOfMeasurement.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    import AppModal from "@/components/AppModal.vue";
    import EditUnitsOfMeasure from "@/main/dashboard/catering/cateringComponents/EditUnitsOfMeasure.vue";


    const showUnitModal = ref(false)
    const cateringStore = useCateringStore()
    const thisDialog = ref(false)
    const unitMeasurementData = ref([])

    const showUnitMeasurement = () => {
    showUnitModal.value = true
    thisDialog.value=false
}


    const showDialog = () => {
        thisDialog.value = true
    }

    const closeDialog = () => {
        thisDialog.value = false
    }
    onMounted(
    () => {
      cateringStore.fetchUnitOfMeasureInfo()
    } )

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
  const deleteUnitOfMeasure = (id,name) => {
if(!confirm("Are you sure, you want to delete: " + name)){
  return
}
// delete endpoint

}


    </script>
    
    
    
    <style scoped>
    
    </style>