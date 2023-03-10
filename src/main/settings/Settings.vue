<template>
  <div>


    <div class="row">
      <div class="col-3">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Settings</div>


            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <router-link class="list-group-item list-group-item-action active" :to="{name:''}"><small style="font-size:12px;">Roles</small></router-link>
              <router-link class="list-group-item list-group-item-action" :to="{name:''}"><small style="font-size:12px;">Profile</small></router-link>
            </div>



          </div>
        </div>
      </div>

      <div class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mt-4">

            <roles></roles>


            </div>


          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>

import {reactive, ref} from "vue";
import Subject from "@/main/dashboard/manageLevel/Subject.vue";
import Roles from "@/main/settings/roles/Roles.vue";

const buttonLoader = ref(false)

const form = reactive({
  name:null
})

function addCampus(){
  alert(JSON.stringify(form))
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