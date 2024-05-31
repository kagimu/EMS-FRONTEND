<template>
    <div>
        
   
                

                <div>
    <div class="m-1">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Feeding Group</small></button>
          <!-- <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small><i class="bi bi-plus"></i>Feeding Groups Per Day</small></button> -->
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
  
  
            </div>
        
    
</template>
<script setup>
  import FeedingSession from "@/main/dashboard/catering/cateringComponents/FeedingSession.vue";
  import NewStock from "@/main/dashboard/catering/cateringComponents/NewStock.vue";
  import FeedingSessionsItems from "@/main/dashboard/catering/cateringComponents/FeedingSessionsItems.vue";
  import FeedingGroup from "@/main/dashboard/catering/cateringComponents/FeedingGroup.vue";
  import FeedingGroupsPerDay from "@/main/dashboard/catering/cateringComponents/FeedingGroupsPerDay.vue";
  import FeedingGroupUsersList from "@/main/dashboard/catering/cateringComponents/FeedingGroupUsersList.vue";
  import FeedingGroupUsers from "@/main/dashboard/catering/cateringComponents/FeedingGroupUsers.vue";



const goBack = () => {
  window.history.back()
}
</script>