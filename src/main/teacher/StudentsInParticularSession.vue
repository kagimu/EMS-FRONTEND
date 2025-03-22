<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import { useSchemeOfWorkStore } from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
   import '@vuepic/vue-datepicker/dist/main.css';
   import useCommonsStore from "@/composables/useCommons.js";

   const useCommon = useCommonsStore()
   
   const schemeOfWorkStore = useSchemeOfWorkStore();
   const streamList = ref([])
   const promDialog = ref(false)
   const loading = ref(false)
   const page = ref(1)
   const per_page = ref(20)
   const total_items = ref(0)
   const total_rows = ref(0)
   const studentDataList = ref( [])
   const  notificationStore  = useNotificationStore()
   const adn_no = ref(null)
   const showV = ref(false)


   const openCommentField = (adn) =>{
   adn_no.value = adn
   showV.value = true
   }
   
   const closeCommentField = (adn) =>{
   adn_no.value = adn
   showV.value = false
   }
   
   
   const props = defineProps({
    stepsData: [],
   })


   onMounted(() => {
    doFetchStudentDetails()
  })
   

  const doFetchStudentDetails = () =>{

  let data = {
    page: 1,
    per_page: per_page.value,
    session_number:props.stepsData.number
  }
  loading.value = true;
  studentDataList.value = []
  schemeOfWorkStore.fetchStudentsInSession(data)

}

function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      session_number:props.stepsData.number
    }

    schemeOfWorkStore.fetchStudentsInSession(data)
  }
}


const fetchStudentList = (data) => {
  if(data) {
    let current_page = data.page
    page.value = current_page
    loading.value = false;

    let per_page_item = data.per_page;
    per_page.value = per_page_item;

    let objArray = data.content

    let count_items = (current_page * per_page_item)
    let totalItems = data?.total_rows


    if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
      objArray.forEach((list, i) => {

        list.key =  (current_page - 1) * per_page_item + i + 1

        const index = studentDataList.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          studentDataList.value.push(list);
        }
      })
    }

  }
}



   watch(
      () => schemeOfWorkStore.classSessionStudentsResponse,
      async (data) => {
        if (data) {
            fetchStudentList(data)
        }
      }
   )



</script>
<template>


   <div>
            <div class="row mb-3">
               <div class="col-3"></div>
               <div class="col-3"></div>
               <div class="col-3"></div>
               <div class="col-3">
                  <PaginationTemplate
                     v-model:perPage="per_page"
                     :per_page="per_page"
                     :total_items="total_items"
                     :total_rows="total_rows"
                     ></PaginationTemplate>
               </div>
            </div>
            <div
               class="w-full overflow-auto max-h-[820px] scrollbar-thin"
               @scroll="onScroll">
               <div class="row">
                  <div class="col-lg-12">
                     <table
                        class="table table-hover caption-top table-sm table-striped"
                        style="font-size: 13px !important;"
                        >
                        <thead>
                           <tr>
                              <th>#</th>
                              <th>Student Name</th>
                              <th>Gender</th>
                           </tr>
                        </thead>
                        <tbody>
                            
                           <tr v-for="(lst,index) in studentDataList" :key="index" >
                              <td>{{index+1}}</td>
                              <td style="text-transform: capitalize;">
                                {{ lst.surname}} {{ lst.second_name}} {{ lst.other_name}}
                              </td>
                           
                           <td style="text-transform: capitalize;">
                                {{ lst.gender}} 
                              </td>
                            </tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
         
  </template>
<style scoped>
   .buttonStyle {
   font-size: 12px;

   }
</style>