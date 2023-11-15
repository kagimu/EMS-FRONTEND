<template>
  <div>


    <div class="row">
      <div class="col-3">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Settings</div>


            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">

              <router-link
                  v-for="(item, idx) in  settingsList" :key="idx"
                  class="list-group-item list-group-item-action"
                  :class="item.id === selectedPage ? 'active' : ''"
                  :to="{name:'settings', query:{s:item.id}}">
                <small style="font-size:12px;">{{item.name}}</small>
              </router-link>
            </div>



          </div>
        </div>
      </div>

      <div class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div>

                <div v-if="selectedPage === 'role'">
                  <roles></roles>
                </div>
                <div v-if="selectedPage === 'level'">
                  <level-setup></level-setup>
                </div>

            </div>


          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>

import {reactive, ref} from "vue";
import Roles from "@/main/settings/roles/Roles.vue";
import {useRouter} from "vue-router";
import LevelSetup from "@/main/settings/level/LevelSetup.vue";
const routerData = useRouter()
const buttonLoader = ref(false)

const route = routerData.currentRoute.value.query.s
const selectedPage = route ? route : "profile"

const settingsList = ref([
  {
    name:"Profile",
    id:"profile"
  },
  {
    name:"Level",
    id:"level"
  },
  {
    name:"Roles",
    id:"role"
  }
])
const form = reactive({
  name:null
})


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