<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="mt-3 ">
            <div>

                <div>
                    <div class="m-4">
                      <nav>
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                          <button class="nav-link navColor active" id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Ingredients</small></button>
                          <button class="nav-link navColor" id="assembled-tab" data-bs-toggle="tab" data-bs-target="#assembled" type="button" role="tab" aria-controls="assembled" aria-selected="false"><small>Menu Item</small></button>
                          <button class="nav-link navColor" id="class-attendance-tab" data-bs-toggle="tab" data-bs-target="#class-attendance" type="button" role="tab" aria-controls="class-attendance" aria-selected="false"><small><i class="bi bi-plus"></i>New Item</small></button>
                        </div>
                      </nav>
                      <div class="tab-content" id="nav-tabContent">
                        <div class="tab-pane fade show active" id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
                        <FoodMenuItem></FoodMenuItem>
                        </div>
                        <div class="tab-pane fade" id="assembled" role="tabpanel" aria-labelledby="assembled-tab" tabindex="0">
                        <AssembledItems></AssembledItems>
                        </div>
                        <div class="tab-pane fade" id="class-attendance" role="tabpanel" aria-labelledby="class-attendance-tab" tabindex="0">
                       <NewMenuItem></NewMenuItem>
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
  import FoodMenuItem from "@/main/dashboard/catering/cateringComponents/FoodMenuItem.vue";
  import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
  import AssembledItems from "./AssembledItems.vue";
</script>