<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="mt-3 ">
            <div class="" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="float: right; margin-right: 10px;"><i @click="goBack()" class="bi bi-x-lg"></i></div>

                <div>
    <div class="m-4">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="userlist-tab" data-bs-toggle="tab" data-bs-target="#userlist" type="button" role="tab" aria-controls="userlist" aria-selected="false"><small>Users</small></button>
          <button class="nav-link navColor" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Add User Details</small></button>
          <button class="nav-link navColor" id="scope-tab" data-bs-toggle="tab" data-bs-target="#scope" type="button" role="tab" aria-controls="scope" aria-selected="false"><small>Determine Scope</small></button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="userlist" role="tabpanel" aria-labelledby="userlist-tab" tabindex="0">
        <userProfiles></userProfiles>

        </div>
        <div class="tab-pane fade" id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
        <NewStaff></NewStaff>
        </div>
        <div class="tab-pane fade" id="scope" role="tabpanel" aria-labelledby="scope-tab" tabindex="0">
    <Scope></Scope>
        </div> 
      
      </div>

    </div>
  </div>
  
  
            </div>
          </div>
        </div>
  
  
      </div>
    </div>
</template>
<script setup>
  import NewStaff from "@/main/dashboard/profiles/NewStaff.vue";
  import Scope from "@/main/dashboard/profiles/Scope.vue";
  import userProfiles from "@/main/dashboard/profiles/userProfiles.vue";




const goBack = () => {
  window.history.back()
}
</script>