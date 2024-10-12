<script setup>
import { useAuthStore } from "@/main/auth/store/auth.js";
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";

const classStore = useClassesStore()
const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()
const showSelected = ref(null)
let entityN = localStorage.getItem("entity_number")
let campusListData = ref([])

const schoolsList = ref( [])
const authStore = useAuthStore();
const todayDate = ref('');
const currentTime = ref('');
const streamList = ref([])
  
  const updateTime = () => {
    const now = new Date();
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    todayDate.value = now.toLocaleDateString(undefined, dateOptions);
  
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    currentTime.value = now.toLocaleTimeString(undefined, timeOptions);
  };
  
  onMounted(() => {
    schoolStore.fetchSchools(entityN)
    updateTime();
    setInterval(updateTime, 1000);
    campusListData.value = JSON.parse(localStorage.getItem("Campus"))
  })




watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    },
    {deep:true}
)


watch (
    () => schoolStore.errorMessage,
    async (data) => {
      if(data){
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


const toggleStream = (number) =>{
  let sData = {
      campus_class_number:number,
     }
    classStore.fetchClassStreamsByCampusClassNumber(sData)
  showSelected.value = (showSelected.value === number) ? undefined : number
  // showSelected.value = "show"
}



watch(
    () => classStore.byCampusClassStreams,
    async (data) => {
      if (data) {
        streamList.value = data.data
      }
    },
    {deep: true}
)


  </script>

<template>
    <div class="dashboard">
      <!-- Welcome Banner -->
      <div class="welcome-card pa-5 mb-4 ">
      
          <div class="row" >
            <div class="col-8">
            <div class="icon mr-2 yellow-text">👋</div>
            <h2 class="welcome-message">Welcome Back !</h2>
            <p class="welcome-subtext">We're glad to see you again. Here's an overview of your latest activity.</p>
          </div>
          <div class="col-4">
            <!-- Displaying Date and Time -->
            <div class="date-time" style="font-size: 16px;">
              <ul class="list-roup p-2 " style="float: right;">
            <li class="list-group-item"> 📅 <span>{{ todayDate }}</span> - <span>{{ currentTime }}</span></li> 
            <li class="text-xs ml-5 mt-1 welcome-subtext pt-1">Academic Year : 2024</li>
            <li  class="text-xs ml-5 welcome-subtext pt-1">Study Period : Term 1</li>
            </ul>
          
            </div>
        </div>
        </div>
      </div>

        <div class="row">
        <div class="col-4">
            <div class="mb-2">
            <select
                class="form-select form-select-sm"
                style="box-shadow: none;">
                <option disabled value="">--Select Campus--</option>
                <option v-for="(list,index) in campusListData" :key="index">{{ list.campus_name }}
                </option>
            </select>
            </div>
        </div>

        <div class="col-4">
            <div class="mb-2">
            </div>
        </div>

        <div class="col-4">
            <div class="mb-2">
            <input class="form-control mb-0" placeholder="Search..." type="text">
            </div>
        </div>

        </div>


      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <template v-for="(list,index) in campusListData" :key="index">

      <div v-for="(listD,index) in list.Classes" :key="index">


          <div class="border rounded-md bg-white mt-3 p-0">

            <div class="p-3 text-[#5e5e5e]">
            <div class="mb-3 flex justify-between text-[16px]">
              <div class="flex flex-row items-center">
                <div class="">
                  <div class="text-gray-900">{{ listD.name }}</div>
                </div>
              </div>
            </div>
            <div>
              <div>
              </div>
              <div class="mt-3">
                <div class="cursor-pointer text-[15px]" @click="toggleStream(listD.number)" >
                  Show Stream
                  <i
                      class="text-[12px]"
                      :class="showSelected === 'show' ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
                  ></i>
                </div>
              </div>

              <!-- <div class="mt-2" v-show="showSelected === 'show'">
                <div class="ml-2">
                  <div class="text-[13px] text-[#575656]">
                    <router-link
                  class="text-decoration-none"
                  :to="{name:'manage-stream', query:{id:'stream-number'}}"
              > <i class="bi bi-arrow-right"></i> East </router-link></div>
                  <div class="text-[13px] text-[#575656]"><router-link
                  class="text-decoration-none"
                  :to="{name:'manage-stream', query:{id:'stream-number'}}"
              ><i class="bi bi-arrow-right"></i> West </router-link></div>
                  
                </div>
              </div> -->



              
              <div class="mt-2" v-show="showSelected === listD.number">
                  <!-- {{ streamList }} -->
                <div class="ml-2" v-for="(list, idx) in streamList" key="idx">
                  <router-link
                  class="text-decoration-none link-primary" 
                  :to="{name:'manage-stream', query:{id:list.stream_number,ccl:list.campus_class_number}}">
                 <div class="text-[13px] text-[#575656]">{{idx+1}}. {{list.name}}</div>
                </router-link>
                </div>
              </div>


            </div>

          </div>

            <!-- <div class="bg-[#0d6efd] hover:bg-[#0d6efd] rounded-b-md mt-3">
              <router-link
                  class="text-decoration-none"
                  :to="{name:'campus', query:{id:school.number}}"
              >
                <button
                v-if="can('view_school','general')"
                @click="setSchoolName(school.name)"
                    type="button"
                    class="bg-[#0d6efd] hover:bg-[#0c62e1] text-white text-sm text-center w-full rounded-b-md py-2">
                      <span>
                        View
                      </span>
                </button>
                
              </router-link>


            </div> -->



        </div>

 
      </div>
    </template>

    </div>

    </div>
  </template>
  
  
  <style scoped>
  .dashboard {
    padding: 16px;
  }
  
  .welcome-card {
    background-color: #f3f4f6;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .welcome-message {
    font-size: 24px;
    font-weight: 600;
  }
  
  .welcome-subtext {
    font-size: 14px;
    color: #6b7280;
  }
  
  .icon {
    font-size: 48px;
  }
  
 
  .green-text {
    color: green;
  }
  
  .blue-text {
    color: blue;
  }
  
  .red-text {
    color: red;
  }
  
  .text-card {
    font-size: 20px;
    font-weight: bold;
    margin-top: 5px;
  }
  
  .date-time {
    font-size: 18px;
    display: flex;
    align-items: center;
  }
  </style>
  