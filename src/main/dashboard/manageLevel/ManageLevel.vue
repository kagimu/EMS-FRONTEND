<template>
  <div>

<!--    <div class="row mx-auto mt-5">

      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="school"
              @change="filterSchool(school)"
          >
            <option disabled value="">Filter by School</option>
            <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
          </select>
        </div>
      </div>

      <div class="col-3">
        <div class="mb-2">
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="campus"
              @change="filterCampus(campus)"
          >
            <option disabled value="">Filter by Campus</option>
            <option v-for="(lvl, index) in campusList" :key="index" :value="lvl.number">{{lvl.name}}</option>
          </select>
        </div>
      </div>


    </div>-->

    <div style="font-size: 25px; color: #262626;" class="mt-3 ml-2" v-if="levelDataInfo">
      {{levelDataInfo.name}}
    </div>

    <div class="row">
      <div class="col-3">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="levelDataInfo">
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link class="list-group-item list-group-item-action" :class="showHomeLevel && showHomeLevel === 'home' ? 'active' : ''" :to="{name:'level', query:{id:campus}}"><small style="font-size:12px;">Home</small></router-link>
            </div>

          </div>
        </div>

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;" v-if="levelDataInfo">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Level</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link
                  v-for="(item, idx) in  levelDataInfo.level" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.number === campusLevel ? 'active' : ''"
                  :to="{name:'level', query:{id:campus, l:item.number}}">
                <small style="font-size:12px;">{{item.level_name}}</small></router-link>
            </div>

          </div>
        </div>

      </div>

      <div class="col-9">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mt-4">

              <div v-if="showHomeLevel && showHomeLevel === 'home'">
                <level-info></level-info>
              </div>

              <div v-if="showHomeLevel && showHomeLevel === 'level'">
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
import {useLevelStore} from "@/main/dashboard/manageLevel/store/level.js";
import {useRouter} from "vue-router";
import LevelSettings from "@/main/dashboard/manageLevel/LevelSettings.vue";
const levelStore = useLevelStore()
const levelDataInfo = ref(null)
const routerData = useRouter()
const showHomeLevel = ref("home")
const school = ref( "")


const campus = routerData.currentRoute.value.query.id
const campusLevel = routerData.currentRoute.value.query.l


showHomeLevel.value = campusLevel ? "level" : "home"


onMounted(
    () => {
      levelStore.fetchLevelInfo(campus)

    }
)



watch(
    () => levelStore.levelResponse,
    async (data) => {
      if(data){
        levelDataInfo.value = data.data
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