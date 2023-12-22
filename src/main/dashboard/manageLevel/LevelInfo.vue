<template>
  <div>


    <div class="row">
      <div class="col-12">
        <div class="mt-3" v-if="campusInfo">
          <div style="padding: 0;">
            <div class="mb-2 ml-4 mt-2" style="font-size: 20px;">{{campusInfo.name}}</div>

            <div style="width: 95%; font-size: 13px;" class="mx-auto mt-4">

              <div class="row">
                <div class="col-3">
                    <div class="mb-4">
                      <b>Contacts</b><br />
                      Email:  <span>{{campusInfo.email}}</span> <br />
                      Phone:  <span>{{campusInfo.phone}}</span><br /><br />

                      <b>Commencement Date</b><br />
                      Phone:  <span>{{campusInfo.commencement_date}}</span><br />

                    </div>
                </div>



                <div class="col-3">
              <div class="mb-4">
                <b>Address</b> <br />
                Location: <span>{{campusInfo.location}}</span>
              </div>
                </div>


                <div class="col-3">
                  <div class="mb-4">
                    <b>Curriculum</b> <br />
                     <span>{{campusInfo.curriculum_name}}</span>
                  </div>
                </div>


                    <div class="col-3">
                    <b>Levels</b>
                      <div class="mb-7 mt-2">
                          <div class="mb-1" v-for="(item, index) in levelInfo" :key="index">
                            <span>{{item.code+". "+item.name}}</span>
                          </div>
                    </div>
                    </div>
                  </div>

            </div>





          </div>
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