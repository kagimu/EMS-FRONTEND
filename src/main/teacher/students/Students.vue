<script setup>
import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const schoolStore = useSchoolStore()
const  notificationStore  = useNotificationStore()
const showSelected = ref(null)
let entityN = localStorage.getItem("entity_number")
const schoolsList = ref( [])

onMounted(
    () => {
      schoolStore.fetchSchools(entityN)
    }
)



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
  showSelected.value = (showSelected.value === number) ? undefined : number
}


</script>

<template>
  <div>

    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      <div v-for="(school, index) in schoolsList" :key="index">

          <div class="border rounded-md bg-white mt-3 p-0">

            <div class="p-3 text-[#5e5e5e]">
            <div class="mb-3 flex justify-between text-[16px]">
              <div class="flex flex-row items-center">
                <div class="">
                  <div class="text-gray-900">Primary One [P1]</div>
                </div>
              </div>
            </div>
            <div>
              <div>
              </div>
              <div class="mt-3">
                <div class="cursor-pointer text-[15px]" @click="toggleStream(school.number)" >
                  Show Stream
                  <i
                      class="text-[12px]"
                      :class="showSelected === school.number ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"
                  ></i>
                </div>
              </div>

              <div class="mt-2" v-show="showSelected === school.number">
                <div class="ml-2" v-for="(curr, idx) in school.school_curriculum" key="idx">
                  <div class="text-[13px] text-[#575656]"><a href="">{{curr.name}}</a></div>
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


    </div>

  </div>
</template>



<style scoped>

.linkStyle {
  text-decoration: none;
  color: #1867c0;
  font-size: 16px;
}

.linkStyle:hover {
  font-size: 16px;
  color: green;
  text-decoration: underline;
}

.viewButtonStyle{
  background-color: #2c6fb9;
  color: #ffffff;
  border-radius: 0;
}

.viewButtonStyle:hover {
  background-color: #0557b4;
  color: #ffffff;
}

</style>