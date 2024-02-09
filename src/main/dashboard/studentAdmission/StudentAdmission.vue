<template>
  <div>


    <div class="row">
        <div class="col-3">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Admission</div>
  
  
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
  
                <router-link
                    v-for="(item, idx) in admission" :key="idx"
                    class="list-group-item list-group-item-action"
                    :class="item.id === selectedPage ? 'active' : ''"
                    :to="{name:'student-admission', query:{s:item.id}}">
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
  
                  <div v-if="selectedPage === 'admission-offers'">
                    <admission-list></admission-list>
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
import AdmissionList from "@/main/dashboard/studentAdmission/AdmissionList.vue";
import NewAdmission from "@/main/dashboard/studentAdmission/NewAdmission.vue";
import {useRouter} from "vue-router";


  const routerData = useRouter()
  
  const route = routerData.currentRoute.value.query.s
  const selectedPage = route ? route : "admission-offers"
  
  const admission = ref([
    {
      name:"Admission Offers",
      id:"admission-offers"
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

</style>