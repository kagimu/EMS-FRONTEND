<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";
import ManageFeedingSessions from "@/main/dashboard/catering/cateringComponents/ManageFeedingSessions.vue";
import ManageStock from "@/main/dashboard/catering/cateringComponents/ManageStock.vue";
import FeedingGroupUsers from "@/main/dashboard/catering/cateringComponents/FeedingGroupUsers.vue";
import FeedingUsers from "@/main/dashboard/catering/cateringComponents/FeedingUsers.vue";
import ManageFeedingGroup from "@/main/dashboard/catering/cateringComponents/ManageFeedingGroup.vue";
import ManageMenuItem from "@/main/dashboard/catering/cateringComponents/ManageMenuItem.vue";
import ManageUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/ManageUnitOfMeasurement.vue";
import MealCourses from "@/main/dashboard/catering/meals/MealCourses.vue";
import MealCalendar from "@/main/dashboard/catering/meals/MealCalendar.vue";
import MealCourseFeedingSessions from "@/main/dashboard/catering/meals/MealCourseFeedingSessions.vue";
import MealCoursesPerDay from "@/main/dashboard/catering/meals/MealCoursesPerDay.vue";
import GroupsOnCalendar from "@/main/dashboard/catering/meals/GroupsOnCalendar.vue";

import { useAbility } from '@casl/vue';
import MealsCostProjections from "@/main/dashboard/catering/meals/MealsCostProjections.vue";
import router from "@/config/router.js";

const { can } = useAbility()

const routerData = useRouter()


const menuSelected = routerData.currentRoute.value.query.m ?? 'units-of-measurement'


const menu = ref([
  {
    text:"Units Of Measure",
    value:"units-of-measurement",
    action:"view_unit_of_measure"
  },
  {
    text:"Menu Items",
    value:"menu-items",
     action:"view_menu_items"
  },
  {
    text:"Menu Packs",
    value:"feeding-session",
     action:"view_menu_packs"
  },
  {
    text:"Feeding Group",
    value:"feeding-group",
     action:"view_feeding_groups"
  },


])


const mealMenu = ref([
  {
    text:"Meal Courses",
    value:"meal-courses",
     action:"view_meal_courses"
  },

  {
    text:"Meal Course Menu Pack",
    value:"meal-course-feeding-sessions",
     action:"view_meal_course_menu_packs"
  },
  {
    text:"Daily group courses",
    value:"meal-courses-per-day",
     action:"view_daily_group_courses"
  },
  {
    text:"Groups On Calendar",
    value:"groups-on-calendar",
     action:"view_groups_on_calendar"
  },
  {
    text:"Weekly Meal Items",
    value:"meal-calendar",
     action:"view_weekly_meal_items"
  },
  {
    text:"Meals Delivery",
    value:"feeding",
    action:"record_meals",
     action:"view_meals_delivery"
  },
  {
    text:"Meals Cost Projections",
    value:"meals-cost-projections",
     action:"view_meal_cost_projections"
  },
])

const changeMenu = (value) => {
  router.push({ name: "catering", query:{m:value} })
}



</script>
<template>
    <div>

      <div class="row">
        <div class="col-3">
          <div class="">
            <div class="card" style="padding: 0;">
              <div class="flex items-center gap-2 mb-2 mt-3 pl-4 text-[15px] font-semibold text-gray-800">
  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#0d6efd]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3C7.589 3 4 6.589 4 11v1H2v2h20v-2h-2v-1c0-4.411-3.589-8-8-8zm0 2c3.309 0 6 2.691 6 6v1H6v-1c0-3.309 2.691-6 6-6zm-8 9v1c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-1H4z"/>
  </svg>
  <span>CATERING</span>
</div>

  
              <div class="list-group " style="border-radius: 0 0 0 0;">
                  <div
                    v-for="(item, idx) in menu" :key="idx"
                    v-show="can(item.action,'general')"
                    :class="item.value === menuSelected ? 'active' : ''"
                    class="list-group-item list-group-item-action cursor-pointer"
                    @click="changeMenu(item.value)">
                  <small style="font-size:12px;">{{item.text}}</small>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4"    v-if="can('view_stock','general')">
            <div class="card" style="padding: 0;">

              <div class="list-group " style="border-radius: 0 0 0 0;">
                <div
                    :class="menuSelected === 'manage-stock' ? 'active' : ''"
                    class="list-group-item list-group-item-action cursor-pointer"
                    @click="changeMenu('manage-stock')"
                >
                  <small style="font-size:12px;">Manage Stock</small>
                </div>
              </div>
            </div>
          </div>




          <div class="mt-3">
            <div class="card" style="padding: 0;">
              <div class="list-group " style="border-radius: 0 0 0 0;">
                <div
                    v-for="(item, idx) in mealMenu" :key="idx"
                    v-show="can(item.action,'general')"
                    :class="item.value === menuSelected ? 'active' : ''"
                    class="list-group-item list-group-item-action cursor-pointer"
                    @click="changeMenu(item.value)">
                  <small style="font-size:12px;">{{item.text}}</small>
                </div>
              </div>

            </div>
          </div>

        </div>
  
        <div class="col-9">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
  
              <div>
  

                  <div v-if="menuSelected === 'units-of-measurement'">
                    <ManageUnitOfMeasurement></ManageUnitOfMeasurement>
                  </div>

                  <div v-if="menuSelected === 'menu-items'">
                    <ManageMenuItem></ManageMenuItem>
                  </div>

                  <div v-if="menuSelected === 'feeding-group'">
                    <ManageFeedingGroup></ManageFeedingGroup>
                  </div>
                  <div v-if="menuSelected === 'feeding-session'">
                    <ManageFeedingSessions></ManageFeedingSessions>
                  </div>
                  <div v-if="menuSelected === 'manage-stock'">
                    <ManageStock></ManageStock>
                  </div>

                  <div v-if="menuSelected === 'manage-feeding-users'">
                    <FeedingGroupUsers></FeedingGroupUsers>
                  </div>

                  <div v-if="menuSelected === 'feeding'">
                    <FeedingUsers></FeedingUsers>
                  </div>


                <div v-if="menuSelected === 'meal-courses'">
                  <MealCourses></MealCourses>
                </div>
                <div v-if="menuSelected === 'meal-courses-per-day'">
                  <MealCoursesPerDay></MealCoursesPerDay>
                </div>

                <div v-if="menuSelected === 'meal-course-feeding-sessions'">
                  <MealCourseFeedingSessions></MealCourseFeedingSessions>
                </div>

                <div v-if="menuSelected === 'meal-calendar'">
                 <MealCalendar></MealCalendar>
                </div>

                <div v-if="menuSelected === 'groups-on-calendar'">
               <GroupsOnCalendar></GroupsOnCalendar>
                </div>

                <div v-if="menuSelected === 'meals-cost-projections'">
                    <meals-cost-projections></meals-cost-projections>
                </div>
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
  
  .text-sm2{
    color: #717375;
  }
  
  .navColor{
    color: black;
  }
  
  </style>