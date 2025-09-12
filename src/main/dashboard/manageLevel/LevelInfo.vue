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

<template>
  <div class="px-2 py-2 text-[#5e5e5e] border rounded-md" >
      <div>
        <div class="text-[18px] mb-[20px] text-[#34355d]">
          {{ campusInfo?.name }}
        </div>
        <div
            class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4"
        >
          <!-- Contacts -->
          <div>
            <div class="text-[16px] mb-[5px]">Contacts</div>
            <div class="text-[13px] text-[#575656]">
              <i class="bi-envelope mr-2"></i>{{ campusInfo?.email }}
            </div>
            <div class="text-[13px] text-[#575656]">
              <i class="bi-telephone mr-2"></i>{{ campusInfo?.phone }}
            </div>
          </div>

          <!-- Commencement Date -->
          <div>
            <div class="text-[16px] mb-[5px]">Commencement Date</div>
            <div class="text-[13px] text-[#575656]">
              <i class="bi-calendar2-date mr-2"></i>{{ campusInfo?.commencement_date }}
            </div>
          </div>

          <!-- Address -->
          <div>
            <div class="text-[16px] mb-[5px]">Address</div>
            <div class="text-[13px] text-[#575656]">
              <i class="bi-pin-map mr-2"></i>{{ campusInfo?.location }}
            </div>
          </div>

          <!-- Curriculum -->
          <div>
            <div class="text-[16px] mb-[5px]">Curriculum</div>
            <div
                class="text-[13px] text-[#575656]"
                v-for="(item, index) in campusInfo?.curriculum"
                :key="index"
            >
              {{ index + 1 }}. {{ item?.name }}
            </div>
          </div>
        </div>
      </div>

  </div>
</template>




<style scoped>

input:focus {
  box-shadow: none;
}

.text-sm2{
  color: #717375;
}


</style>