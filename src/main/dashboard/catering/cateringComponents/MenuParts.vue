<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
   import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
   import updateFoodMenuItem from "@/main/dashboard/catering/cateringComponents/updateFoodMenuItem.vue";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import AppModal from "@/components/AppModal.vue";
   import api from "@/config/api.js";
   
   const props = defineProps({
       menuNumber:String,
     })
   
   
   const showingModal = ref(false)
   const isLoading = ref(true);
   const loading = ref(true)
   const notificationStore = useNotificationStore()
   const thisDialog = ref(false)
   const updateMenuDialog = ref(false)
   const menuItemsinfoData = ref(null)
   const errorMessage = ref(null)
   const campusList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const classStore = useClassesStore()
   const school_number = ref(null)
   const menuItemDataParts = ref([])
   
   const form = reactive({
   school_number:null,
   campus_number: null,
   })
   
   
   onMounted(() => {
     fetchMenuParts()
       }
   )
   
   watch (
     () => props.reportTemplateId,
     async (data) => {
       if(data){
           fetchMenuParts()
       }
     }
   )
   
   const fetchMenuParts = () =>{
      fetchMenuItemDetails(props.menuNumber)
   }


   const  fetchMenuItemDetails = async (menuNumber) => {
    return await api.get("main/catering/menu-items/"+menuNumber)
        .then((response) => {
          if(response && response.data){
            menuItemDataParts.value = response.data
          }
        })
        .catch((response) => {
            if(response){
                errorMessage.value = response.response.data
            }
        })
}

   
   
   const showModal = () => {
   showingModal.value = true
   thisDialog.value=false
   }
   
   
   
   
   const fetchCampuses = (school_number) => {
   campusStore.fetchCampuses(school_number)
   }
   
   const filter = (campusN) =>{
   cateringStore.filterMenuItem(campusN)
   }
   
   const menuItemData=ref([])
   const showDialog = () => {
       thisDialog.value = true
   }
   
   const showUpdateDialog = (a) => {
     menuItemsinfoData.value = a
     showingModal.value = true
     thisDialog.value=false
   }
   
   const cateringStore = useCateringStore()
   
   const closeDialog = () => {
       thisDialog.value = false
       updateMenuDialog.value = false
   }
   
   onMounted(
   () => {
     cateringStore.fetchMenuItem()
   }
   
   )
   const sta = ref(null)
   
   const showItems = (primaryItemNumber) =>{
   sta.value=primaryItemNumber
   // alert(primaryItemNumber)
   // cateringStore.fetchMenuItemDetails(primaryItemNumber)
   }
   const hideItems = () =>{
   sta.value=""
   }
   
   watch(
   () => cateringStore.menuItemResponse,
   async (data) => {
     if(data && data.data) {
       menuItemData.value = data.data
       isLoading.value = false;
     }
   }
   )
   
   
  //  watch(
  //  () => cateringStore.menuItemDetailsResponse,
  //  async (data) => {
  //      menuItemDataParts.value = data
  //      loading.value=false;
  //  },
  //  {deep: true}
  //  )
   
   watch(
   () => cateringStore.filterMenuResponse,
   async (data) => {
       menuItemData.value = data.data
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
<template>
   <div>
      <span v-for="(listD,indx) in menuItemDataParts" :key="indx">
         <ul>
            <li  v-for="(ldData,idx) in listD.parts" :key="idx">[{{ldData.code}}] {{ ldData.name }} - {{ ldData.quantity }} {{ ldData.unit_of_measure }}
            <i class="bi bi-x" style="color: red;"></i>
            </li>
         </ul>
      </span>
   </div>
</template>
<style scoped>
</style>