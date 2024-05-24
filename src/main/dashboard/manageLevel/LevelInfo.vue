<template>

    <div class="px-2 py-2 text-[#5e5e5e]">




            <div class="text-[18px] mb-[20px] text-[#34355d]">{{campusInfo?.name}}</div>


              <div class="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">


                    <div>
                      <div class="text-[16px]">Contacts</div>
                      <div class="text-[13px] text-[#575656]">Email:<span>{{campusInfo?.email}}</span></div>
                      <div class="text-[13px] text-[#575656]">Phone:<span>{{campusInfo?.phone}}</span></div>
                    </div>


                    <div>
                      <div class="text-[16px]">Commencement Date</div>
                      <div class="text-[13px] text-[#575656]">Date:<span>{{campusInfo?.commencement_date}}</span></div>
                    </div>



                  <div>
                    <div class="text-[16px]">Address</div>
                    <div class="text-[13px] text-[#575656]">Location:<span>{{campusInfo?.location}}</span></div>
                  </div>


                  <div>
                    <div>
                      <div class="text-[16px]">Curriculum</div>
                       <div class="text-[13px] text-[#575656]" v-for="(item, index) in campusInfo?.curriculum" :key="index">{{(index+1)+". "+item?.name}}</div>
                    </div>
                  </div>

                  </div>






    </div>

</template>

<script setup>

import {onMounted, ref, watch} from "vue";
 import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

 const levelStore = useLevelStore()
 const campusStore = useCampusStore()

 const routerData = useRouter()

const campusInfo = ref(null)
const levelInfo = ref(null)
const campusNumber = routerData.currentRoute.value.query.id

onMounted(
    () => {
      campusStore.fetchCampusData(campusNumber)
    }
)

watch(
    () => campusStore.campusInfoResponse,
    async (data) => {
      if(data){
       campusInfo.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => levelStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelInfo.value = data.data
      }
    },
    {deep:true}
)

</script>

<style scoped>

input:focus {
  box-shadow: none;
}

.textColor{
  color: #717375;
}

.navColor{
  color: black;
}

</style>