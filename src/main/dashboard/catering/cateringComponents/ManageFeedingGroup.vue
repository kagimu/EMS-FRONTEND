<script setup>
import FeedingGroup from "@/main/dashboard/catering/cateringComponents/FeedingGroup.vue";
import FeedingGroupUsersList from "@/main/dashboard/catering/cateringComponents/FeedingGroupUsersList.vue";
import FeedingGroupUsers from "@/main/dashboard/catering/cateringComponents/FeedingGroupUsers.vue";
import router from "@/config/router.js";

const selectedTab = router.currentRoute.value.query.type ?? 'feeding-group'
const menu = router.currentRoute.value.query.m

const switchTabs = (data) => {
  router.push({name: "catering", query: {m:menu,type: data}});
}

import { useAbility } from '@casl/vue';
const { can } = useAbility()


</script>
<template>
    <div>


      <div class="flex border-b mt-1">
        <div  v-if="can('view_feeding_group','general')" class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'feeding-group' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('feeding-group')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Feeding Group
          </div>
        </div>
        <div  v-if="can('create_feeding_group','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'add-users-to-feeding-group' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('add-users-to-feeding-group')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Add Users To Feeding Group
          </div>
        </div>

        <div  v-if="can('view_feeding_group_list','general')" class="cursor-pointer text-sm rounded-t-md mr-1" :class="selectedTab === 'group-user-list' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('group-user-list')">
          <div class="py-1 px-3">
            <i class="bi bi-box-arrow-in-right mr-1"></i>
            Group User List
          </div>
        </div>
      </div>


      <div v-if="selectedTab === 'feeding-group'">
        <FeedingGroup></FeedingGroup>
      </div>

      <div v-if="selectedTab === 'add-users-to-feeding-group'">
        <FeedingGroupUsers></FeedingGroupUsers>
      </div>

      <div v-if="selectedTab === 'group-user-list'">
        <FeedingGroupUsersList></FeedingGroupUsersList>
      </div>

                

<!--                <div>
    <div class="m-1">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Feeding Group</small></button>
          &lt;!&ndash; <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small><i class="bi bi-plus"></i>Feeding Groups Per Day</small></button> &ndash;&gt;
          <button class="nav-link navColor" id="feedg-tab" data-bs-toggle="tab" data-bs-target="#feedg" type="button" role="tab" aria-controls="feedg" aria-selected="false"><small>Add Users To Feeding Group</small></button>
          <button class="nav-link navColor" id="user-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab" aria-controls="users" aria-selected="false"><small>Group User List</small></button>

        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
        <FeedingGroup></FeedingGroup>
        </div>
        <div class="tab-pane fade" id="class-attendance" role="tabpanel" aria-labelledby="class-attendance-tab" tabindex="0">
       <FeedingGroupsPerDay></FeedingGroupsPerDay>
        </div> 
        <div class="tab-pane fade" id="users" role="tabpanel" aria-labelledby="users-tab" tabindex="0">
       <FeedingGroupUsersList></FeedingGroupUsersList>
        </div> 
        <div class="tab-pane fade" id="feedg" role="tabpanel" aria-labelledby="feedg-tab" tabindex="0">
       <FeedingGroupUsers></FeedingGroupUsers>
        </div> 
      </div>

    </div>
  </div>
  -->
  
            </div>
        
    
</template>
