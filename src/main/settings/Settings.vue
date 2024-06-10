<script setup>

import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import LevelSetup from "@/main/settings/level/LevelSetup.vue";
import ClassSetupList from "@/main/dashboard/manageLevel/class/ClassSetupList.vue";
import LearningMaterialSetup from "@/main/settings/learning-materials/LearningMaterialSetup.vue";
import SosInfo from "@/main/settings/sosinfo/SosInfo.vue";
import Services from "../dashboard/servicesAndProducts/Services.vue";
import Products from "../dashboard/servicesAndProducts/Products.vue";
import Profile from "@/main/settings/Profile.vue"
import PromotionSettings from "./promotion/PromotionSettings.vue";
import PromotionValue from "./promotion/PromotionValue.vue";

import { useAbility } from '@casl/vue';

const { can } = useAbility()

const routerData = useRouter()

const route = routerData.currentRoute.value.query.s
const selectedPage = route ? route : "profile"

const settingsList = ref([
  {
    name:"Profile",
    id:"profile",
    action:"view_profile"
  },
  {
    name:"Level",
    id:"level",
    action:"view_level"
  },
  {
    name:"Classes",
    id:"classes",
    action:"view_classes"
  },
  {
    name: "Learning Materials" ,
    id: "learning-materials",
    action:"view_learning_materials"
  },
  {
    name:"Source of school Info",
    id:"sosinfos",
    action:"view_source_of_school_info"
  },
  {
    name:"Services",
    id:"services",
    action:"view_services"
  },
  {
    name:"Products",
    id:"products",
    action:"view_products"
  },
  {
    name:"Promotion Settings",
    id:"promotion-settings",
    action:"view_settings"
  },
  {
    name:"Promotion Value",
    id:"promotion-value",
    action:"view_promotion_value"
  }
])
const form = reactive({
  name:null
})


</script>
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
                  v-show="can(item.action,'general')"
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

                <div v-if="selectedPage === 'profile'">
                  <Profile></Profile>
                </div>
                <div v-if="selectedPage === 'level'">
                  <level-setup></level-setup>
                </div>
                <div v-if="selectedPage === 'classes'">
                  <class-setup-list v-if="selectedPage==='classes'"></class-setup-list>
                </div>
                <div v-if="selectedPage === 'learning-materials'">
                  <learning-material-setup></learning-material-setup>
                </div>
                <div v-if="selectedPage === 'sosinfos'">
                    <sos-info></sos-info>
                </div>
                <div v-if="selectedPage === 'services'">
                    <Services></Services>
                </div>
                <div v-if="selectedPage === 'products'">
                    <Products></Products>
                </div>

                <div v-if="selectedPage === 'promotion-settings'">
                    <PromotionSettings></PromotionSettings>
                </div>
                <div v-if="selectedPage === 'promotion-value'">
                    <PromotionValue></PromotionValue>
                </div>
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

.textColor{
  color: #717375;
}

.navColor{
  color: black;
}

</style>