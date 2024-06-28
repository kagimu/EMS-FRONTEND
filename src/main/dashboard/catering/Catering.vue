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
    value:"menu-items"
  },
  {
    text:"Feeding Packs",
    value:"feeding-session"
  },
  {
    text:"Feeding Group",
    value:"feeding-group"
  },


])


const mealMenu = ref([
  {
    text:"Meal Courses",
    value:"meal-courses"
  },

  {
    text:"Meal Course Feeding Sessions",
    value:"meal-course-feeding-sessions"
  },
  {
    text:"Daily group courses",
    value:"meal-courses-per-day"
  },
  {
    text:"Meal Calendar",
    value:"meal-calendar"
  },
  {
    text:"Meals Delivery",
    value:"feeding",
    action:"record_meals"
  },
  {
    text:"Meals Cost Projections",
    value:"meals-cost-projections"
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
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">CATERING SERVICE</div>
  
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                  <div
                    v-for="(item, idx) in menu" :key="idx"
                    :class="item.value === menuSelected ? 'active' : ''"
                    class="list-group-item list-group-item-action cursor-pointer"
                    @click="changeMenu(item.value)">
                  <small style="font-size:12px;">{{item.text}}</small>
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">

              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
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




          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                <div
                    v-for="(item, idx) in mealMenu" :key="idx"
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
  
  .textColor{
    color: #717375;
  }
  
  .navColor{
    color: black;
  }
  
  </style>