<script setup>
import {onMounted, ref, watch} from "vue";
import router from "@/config/router.js";
import {useAuthStore} from "@/main/auth/store/auth.js";
import useNotificationStore from "@/composables/useNotification.js"
import NewEntity from "@/main/dashboard/entity/entityComponents/NewEntity.vue"
import AppModal from "@/components/AppModal.vue";
import {useEntityStore}  from "@/main/dashboard/entity/store/entity.js"
import DashboardConfig from "@/main/dashboard/entity/entityComponents/DashboardConfig.vue"
import { useAbility } from '@casl/vue';

const { can } = useAbility()


const  authStore = useAuthStore();
const name = ref(null)
const  notificationStore  = useNotificationStore()
const entityStore = useEntityStore()
const entityList = ref(null)
const entityNumber = ref(null)
const draftData = ref(null)
const entityDialog = ref(false)
const buttonLoader = ref(null)
const entityData = ref(null)
const deletionLoader = ref(null)
const showDashboardModal = ref(false)

let p = authStore.profile

name.value = p.first_name+" "+p.second_name+" "+p.last_name

onMounted(() => {
      entityStore.fetchEntity()
      entityStore.currentSelectedEntity()

    }
)


const showAddModal = () =>{
  entityData.value = null
  entityDialog.value = true
}

const editEntity = (list) => {
  entityData.value = list
  entityDialog.value = true
}

const deleteEntity = (list, index) => {
  let confirm_delete = confirm(
      "Are you sure you want to delete this entity."
  );
  if (!confirm_delete) {
    return false;
  }

  deletionLoader.value = index

  entityStore.deleteEntity(list.number)
}

const configDashboard = () => {
  showDashboardModal.value = true
}



watch(
    () => entityStore.deleteEntityResponse,
    async (data) => {
      if(data){
        await entityStore.fetchEntity()
        deletionLoader.value = null
        notificationStore.successToast("Success", data.message)
      }
    }
)


function userLogout(){

  localStorage.clear();

  let r = router.resolve({
    name: "login"
  });
  window.location.assign(r.href);

}





const GoToDashboard = (entity, index) =>{
if(entity) {
  let entityNo = entity.number

 /* if(draftData.value?.number === entityNo){
    saveStorage(draftData.value)
  }else {*/
    buttonLoader.value = index
    entityStore.switchEntity(entityNo)
  // }

}
}


watch (
    () => entityStore.currentEntityResponse,
    async (data) => {
      if (data) {
        let draft = data.data
        saveStorage(draft)
      }
    }
)


const saveStorage = (data) => {
  buttonLoader.value = false
  localStorage.setItem('entity_number', data.number)
  localStorage.setItem('entity_name', data.name)
  router.push({name: 'dashboard'})
}


watch (
    () => entityStore.currentSelectedEntityResponse,
    async (data) => {
      if (data) {
        let draft = data.data
        entityNumber.value = draft.number
        draftData.value = draft
      }
    }
)

watch (
    () => entityStore.entityResponse,
    async (data) => {
      if (data) {
        entityList.value = data
      }
    }
)

watch(
    () => entityStore.errorMessage,
    async (data) => {
      if (data) {
        deletionLoader.value = false
        notificationStore.errorToast("Error", data.message)
      }
    }
)

watch (
    () => entityStore.newEntityResponse,
    async (data) => {
      if(data){
        entityDialog.value = false
        await entityStore.fetchEntity()
      }
    },
    {deep:true}
)


watch (
    () => entityStore.editEntityResponse,
    async (data) => {
      if(data){
        await entityStore.fetchEntity()
        notificationStore.successToast("Success", data.message)
      }
    }
)


</script>
<template>

      <AppModal :title="(entityData?.number ? 'Edit' : 'Create')+' Entity'" v-model="entityDialog" lg>
        <NewEntity :entityData="entityData"></NewEntity>
      </AppModal>

      <AppModal title="Configure Landing Page" v-model="showDashboardModal" lg>
        <DashboardConfig></DashboardConfig>
      </AppModal>

    <nav class="navbar navbar-expand-lg navbar-dark bg-[#2c2f8c] sticky-top"  style="position: absolute; top: 0; left: 0; width: 100%;">
      <div class="container-fluid">
        <button class="navbar-toggler" data-bs-target="#navbarCollapse" data-bs-toggle="collapse" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarCollapse" class="navbar navbar-collapse">
          <div class="navbar-nav">
          </div>
          <div class="navbar-nav">

            <span class="nav-item dropdown">
                <a aria-expanded="false"
                   aria-label="Toggle theme (light)" class="btn btn-link nav-link dropdown-toggle d-flex align-items-center" data-bs-display="static"
                   data-bs-toggle="dropdown" style="border: 0px;">
                    {{name}}
                            </a>
                <ul aria-labelledby="bd-theme-text" class="dropdown-menu dropdown-menu-end">
                <li class="text-sm2">
                    <i class="bi bi-person-circle"></i> &nbsp;My Profile
                </li>
                <li  class="text-sm2">
                    <i class="bi bi-person-fill-lock"></i>&nbsp;Change Password
                </li>
                <li  class="text-sm2">
                    <span class="text-sm2" style="cursor: pointer" @click="userLogout"><i class="bi bi-box-arrow-right"></i>&nbsp;Logout</span>
                </li>
                </ul>
                </span>
          </div>
        </div>
      </div>
    </nav>

    <div class="m-5">

      <div class="flex justify-between">
        <span class="text-[16px]">Entities</span>
        <div class="flex justify-content-between">
          <div class="mr-1">
            <button @click="showAddModal" class="btn btn-sm btn-primary"  v-if="can('can_create_entity','general')">New Entity</button>
          </div>
          <div>
            <button @click="configDashboard" class="btn btn-sm btn-primary"  v-if="can('can_configure_entity','general')">Configure</button>
           </div>

        </div>
       
      </div>

        <hr>

        <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <div  v-for="(list, index) in entityList" :key="index" >

          <div class="border rounded-md bg-white mt-3 p-0">

            <div class="p-3 text-[#5e5e5e]">
            <div class="mb-3 flex justify-between text-[20px]">
              <div class="flex">
                  <div>{{ list.name }}  </div>
                  <span v-if="entityNumber === list.number" class="italic text-sm ml-3 px-2 py-1 rounded-md bg-[#186a3b] text-white">
                    {{entityNumber === list.number ? "Active" : ""}}
                  </span>
              </div>
              <div>
              <i
                   v-if="can('can_update_entity','general')"
                  @click="editEntity(list)"
                  class="bi-pencil ml-2 cursor-pointer"
                  style="font-size: 14px;"
               ></i>
              <i
                  v-if="can('can_delete_entity','general')"
                  @click="deleteEntity(list, index)"
              style="font-size: 14px;" class="bi-trash cursor-pointer ml-1"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div class="text-[15px]">
                    Address:  {{list.address}}
                </div>
                <div class="text-[13px] text-[#575656]">
                 
                </div>
              </div>
              <div class="mt-2">
                <div class="ml-2" >
                  <div class="text-[13px] text-[#575656]">
                  Contact :  {{ list.phone }}
                  </div>
                  <div class="text-[13px] text-[#575656]">
                  Email :  {{ list.email }}
                  </div>
                </div>
              </div>
            </div>

          </div>

            <div class="bg-[#0d6efd] hover:bg-[#0d6efd] rounded-b-md mt-3">
                <button
                    @click="GoToDashboard(list, index)"
                    type="button"
                    class="bg-[#0d6efd]  text-white text-sm text-center w-full rounded-b-md py-2"
                    :class="entityNumber === list.number ? 'bg-[#186a3b]' : 'bg-[#0d6efd] hover:bg-[#0c62e1]'"
                >
                      <span>
                         {{entityNumber === list.number ? "Continue" : "Select"}}
                      </span>

                  <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="buttonLoader === index">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
            </div>



        </div>

      </div>


    </div>
    </div>
  

  
  
    <footer class="absolute bottom-0 left-0 w-screen bg-[#2c2f8c] py-0">
      <div class="flex justify-between px-3 py-1">
        <div class="text-white text-sm"><small>© 2011 Wholesome Education System, All rights reserved.</small></div>
        <a  class="text-white no-underline text-sm" href="#"><small><span>Powered by</span> <b>Hamsoft</b></small></a>
      </div>
    </footer>
  
  
  
  </template>
  
  
  
  <style scoped>
  .center {
    padding: 70px 0;
    /* border: 3px solid green; */
    text-align: center;
  }
  html, body {
    height: 100%;
  }
  /* .cd{
    padding:20px;
    width:300px;
    box-shadow: black;
  } */
  div.card {
    width: 300px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    text-align: center;
    height: 180px;
    padding-top: 15px;
  }
  .text-gray {
    --tw-text-opacity: 1;
    color: rgba(80, 80, 80, var(--tw-text-opacity));
  }
  .card-title{
    font-size: 1.25rem;
  
  }
  .hr{
    display: none;
    border-top:none;
    width: 150px;
    border-bottom: 2px solid rgb(0, 123, 255);
    border-left: none;
    border-right: none;
    margin-left: 30%;
    margin-right: 30%;
  }
  .navbar-expand-lg .navbar-nav .nav-link{
    color:white;
  }
  .container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
    padding: 0px !important; }
  .bg-primary{
    background-color: rgb(13, 86, 195) !important;
  }
  .navbar{
    padding: 0px;;
  }
  .footer {
    position: absolute !important;
    margin-top: 20px;
    left: 0  !important;;
    bottom: 0  !important;
    width: 100%  !important;;
    background-color:  rgb(13, 86, 195) !important;
    color: rgb(216, 214, 214);
    text-align: center;
    padding-left: 10px;
    font-size: 12px;
  }
  .nav-link {
    font-size: 12px !important;
    line-height: 0.2rem!important;
    color:rgba(236, 232, 232, 0.831) !important;
    font-weight: bold !important;
    border:1px solid rgba(244, 244, 244, 0.251);
    margin: 5px;
    border-radius: 0px;
  
  }
  .text-sm2 {
    font-size: 13px !important;
    line-height: 0.5rem!important;
    color:rgba(0, 0, 0, 0.868) !important;
    font-weight: 900px !important;
    padding: 4px;
    text-decoration: none;
  }
  </style>
  

  