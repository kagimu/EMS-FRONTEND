<template>
    <div>
  
  
      <AppModal title="Creating New Entity" v-model="mymodal" lg>
      <NewEntity></NewEntity>
      </AppModal>
  
      <div class="row mt-0"  >
        <div class="col-12">    
     
         <button @click="showAddModal" class="btn btn-primary mb-2 ml-3 mr-3 mt-3" style="float: right;">New Entity</button>
            <div class="card-body" style="padding: 0;">
    <div class="container mt-1">
      <table
        id="datatable"
        class="table table-hover caption-top mt-4 table-sm table-striped"
        style="font-size: 13px !important;"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
     </thead>
     <tbody>
          <tr v-for="(list,index) in entityList" :key="index">
          <td>{{ list.name }}</td>
          <td>{{ list.phone }}</td>
          <td>{{ list.email }}</td>
          <td>{{ list.address }}</td>
          </tr>  
        </tbody>
      </table>
    </div>
    </div>
    </div>
    </div>
  
  
    </div>
    </template>
  
  <script setup>
  import {onMounted, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js"
  import NewEntity from "@/main/dashboard/entity/entityComponents/NewEntity.vue"
  import AppModal from "@/components/AppModal.vue";
  import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"

  const  notificationStore  = useNotificationStore()
  const mymodal = ref(false)
  const entityStore = useEntityStore()
  const entityList = ref(null)
  const errorMessage = ref("")
  
  const showAddModal = () =>{
    mymodal.value = true 
  }
    
  onMounted(() => {
    entityStore.fetchEntity()
   }
  )

  watch (
  () => entityStore.entityResponse,
  async (data) => {
    if (data) {
  entityList.value = data
    }
  },
  { deep: true }
)

  watch(
    () => entityStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )

  watch (
    () => entityStore.newEntityResponse,
    async (data) => {
      if(data){
        mymodal.value = false 
        entityStore.fetchEntity()
      }
    },
    {deep:true}
)

  </script>
  
  
  <style>
  
  </style>