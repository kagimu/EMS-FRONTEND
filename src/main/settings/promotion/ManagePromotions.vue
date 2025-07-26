<script setup>

import {useRouter} from "vue-router";
import router from "@/config/router.js";
import PromotionSettings from "@/main/settings/promotion/ManagePromotions.vue";
import StudentPromotions from "./StudentPromotions.vue";
import PromotionSetup from "./PromotionSetup.vue";
import PromotionValue from "./PromotionValue.vue";

const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr


const selectedPage = routerData.currentRoute.value.query.type
const selectedTab = routerData.currentRoute.value.query.tab ?? 'promo-settings'

const switchTabs = (tab) => {
  router.push({name: "campus-curriculum-setup", query: {id:campusNumber,sch:schoolNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:selectedPage,tab:tab}});
}

</script>
<template>
    <div>

      <div class="flex border-b mt-1">

        <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'promo-settings' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('promo-settings')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Promotion Name Setup
          </div>
        </div>

        <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'promotion-value-setup' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('promotion-value-setup')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
           Promotion Configurations
          </div>
        </div>

        <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'student-promotion' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('student-promotion')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
           Promotion Management
          </div>
        </div>

      </div>

            <div class="card-body" style="padding: 0;">
  
              <div>

                <div v-if="selectedTab === 'promo-settings'">
                 <!-- <PromotionSettings></PromotionSettings> -->
                  <PromotionSetup></PromotionSetup>

                </div>

                <div v-if="selectedTab === 'student-promotion'">
                  <student-promotions></student-promotions>
                </div>
    
                <div v-if="selectedTab === 'promotion-value-setup'">
                  <PromotionValue></PromotionValue>
                </div>

              </div>
  
  
            </div>

  
    </div>
  </template>
  

  
  <style scoped>
  
  input:focus {
    box-shadow: none;
  }
  

  </style>