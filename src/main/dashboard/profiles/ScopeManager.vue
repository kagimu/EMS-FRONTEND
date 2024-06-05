<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="mt-3 ml-3">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="scope-tab" data-bs-toggle="tab" data-bs-target="#scope" type="button" role="tab" aria-controls="scope" aria-selected="false"><small>Scope Management</small></button>
          <button class="nav-link navColor " id="details-tab" data-bs-toggle="tab" data-bs-target="#details" type="button" role="tab" aria-controls="scope" aria-selected="false"><small>Scope Details</small></button>

        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="scope" role="tabpanel" aria-labelledby="scope-tab" tabindex="0">
    <Scope></Scope>
        </div> 
        <div class="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab" tabindex="0">
   <ScopeDetails></ScopeDetails>
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
  import ScopeDetails from "@/main/dashboard/profiles/ScopeDetails.vue";




const goBack = () => {
  window.history.back()
}
</script>