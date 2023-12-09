<template>
  <div>


    <div style="font-size: 25px; color: #262626;" class="mt-3 ml-2" v-if="levelDataInfo">
      {{levelDataInfo.name}}
    </div>

    <div class="card mt-3">
      <div class="card-body" style="padding: 0;">
         <level-info></level-info>
      </div>
    </div>


    <div class="row">
      <div class="col-3">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="levelDataInfo">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Level</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link
                  v-for="(item, idx) in  levelDataInfo" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.number === campusLevel ? 'active' : ''"
                  :to="{name:'level', query:{id:campusNumber, l:item.number}}">
                <small style="font-size:12px;">{{item.code+". "+item.name}}</small></router-link>
            </div>

          </div>
        </div>

      </div>

      <div class="col-9">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mt-4">

              <div>
                <level-settings></level-settings>
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
import LevelInfo from "@/main/dashboard/manageLevel/LevelInfo.vue";
import {useRouter} from "vue-router";
import LevelSettings from "@/main/dashboard/manageLevel/LevelSettings.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
const levelStore = useLevelStore()
const levelDataInfo = ref(null)
const routerData = useRouter()

const school = ref( "")


const campusNumber = routerData.currentRoute.value.query.id
let campusLevel = routerData.currentRoute.value.query.l





onMounted(
    () => {
      levelStore.fetchCampusLevelList(campusNumber)
    }
)



watch(
    () => levelStore.campusLevelResponse,
    async (data) => {
      if(data){
        let campusInfo = data.data

        levelDataInfo.value = campusInfo
        if(!campusLevel){
          campusLevel = campusInfo[0].number
        }
      }
    },
    {deep:true}
)


</script>

<style scoped>

input:focus {
  box-shadow: none;
}


</style>