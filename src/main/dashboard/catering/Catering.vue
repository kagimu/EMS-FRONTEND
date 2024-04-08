<template>
    <div>

    
      <div class="row">
        <div class="col-3">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">CATERING SERVICE</div>
  
  
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
  
                <router-link
                    v-for="(item, idx) in menu" :key="idx"
                    class="list-group-item list-group-item-action"
                    :class="item.id === selectedPage ? 'active' : ''"
                    :to="{name:'catering', query:{s:item.id}}">
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
  
                  <div v-if="selectedPage === 'menu-items'">
              <FoodMenuItem></FoodMenuItem>
                  </div>
                  <div v-if="selectedPage === 'units-of-measurement'">
                 <UnitsOfMeasure></UnitsOfMeasure>
                  </div>
                  <div v-if="selectedPage === 'item-assembly'">
                   <ItemAssembly></ItemAssembly>
                  </div>
                  <div v-if="selectedPage === 'feeding-group'">
                 <FeedingGroup></FeedingGroup>
                  </div>
                  <div v-if="selectedPage === 'feeding-session'">
                <ManageFeedingSessions></ManageFeedingSessions>
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


  const routerData = useRouter()
  
  const route = routerData.currentRoute.value.query.s
  const selectedPage = route ? route : "menu-items"
  
  const menu = ref([

    {
      name:"Menu Items",
      id:"menu-items"
    },
    {
      name:"Units Of Measure",
      id:"units-of-measurement"
    },
    {
      name:"Item Assembly",
      id:"item-assembly"
    },
    {
  name:"Feeding Group",
  id:"feeding-group"
},
{
  name:"Feeding Session",
  id:"feeding-session"
},
   
  ])


  
  
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