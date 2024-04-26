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
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="item.value === menuSelected ? 'active' : ''"
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
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="menuSelected === 'manage-stock' ? 'active' : ''"
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
                    v-for="(item, idx) in Feedmenu" :key="idx"
                    class="list-group-item list-group-item-action cursor-pointer"
                    :class="item.value === menuSelected ? 'active' : ''"
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
  
                  <div v-if="menuSelected === 'menu-items'">
              <ManageMenuItem></ManageMenuItem>
                  </div>
                  <div v-if="menuSelected === 'units-of-measurement'">
                 <ManageUnitOfMeasurement></ManageUnitOfMeasurement>
                  </div>
                  <!-- <div v-if="menuSelected === 'item-assembly'">
                    <ManageItemsAssembly></ManageItemsAssembly>
                  </div> -->
                  <div v-if="menuSelected === 'feeding-group'">
                 <!-- <FeedingGroup></FeedingGroup> -->
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
                
                  
              </div>
  
  
            </div>
          </div>
        </div>
  
      </div>


    </div>
  </template>
  
  <script setup>
  
  import {reactive, ref} from "vue";
  import {useRouter} from "vue-router";
  import FoodMenuItem from "@/main/dashboard/catering/cateringComponents/FoodMenuItem.vue";
  import UnitsOfMeasure from "@/main/dashboard/catering/cateringComponents/UnitsOfMeasure.vue";
  import ItemAssembly from "@/main/dashboard/catering/cateringComponents/ItemAssembly.vue";
  import FeedingSession from "@/main/dashboard/catering/cateringComponents/FeedingSession.vue";
  import FeedingGroup from "@/main/dashboard/catering/cateringComponents/FeedingGroup.vue";
  import ManageFeedingSessions from "@/main/dashboard/catering/cateringComponents/ManageFeedingSessions.vue";
  import ManageItemsAssembly from "@/main/dashboard/catering/cateringComponents/ManageItemsAssembly.vue";
  import ManageStock from "@/main/dashboard/catering/cateringComponents/ManageStock.vue";
  import FeedingGroupUsers from "@/main/dashboard/catering/cateringComponents/FeedingGroupUsers.vue";
  import FeedingUsers from "@/main/dashboard/catering/cateringComponents/FeedingUsers.vue";
  import ManageFeedingGroup from "@/main/dashboard/catering/cateringComponents/ManageFeedingGroup.vue";
  import ManageMenuItem from "@/main/dashboard/catering/cateringComponents/ManageMenuItem.vue";
  import ManageUnitOfMeasurement from "@/main/dashboard/catering/cateringComponents/ManageUnitOfMeasurement.vue";



  const routerData = useRouter()
  
  const menuSelected = ref("menu-items")
  const route = routerData.currentRoute.value.query.s
  // const menuSelected = route ? route : "menu-items"
  
  const menu = ref([
   {
      text:"Units Of Measure",
      value:"units-of-measurement"
    },
    {
      text:"Menu Items",
      value:"menu-items"
    },

  {
  text:"Feeding Group",
  value:"feeding-group"
},
{
  text:"Feeding Session",
  value:"feeding-session"
},
   
  ])

  const Feedmenu = ref([
   {
      text:"Feeding User Group",
      value:"manage-feeding-users"
    },
    {
      text:"Capturing Meals",
      value:"feeding"
    },

   
  ])

  const changeMenu = (value) => {
  menuSelected.value = value
}

  
  
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