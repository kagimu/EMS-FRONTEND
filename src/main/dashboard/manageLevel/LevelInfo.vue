<template>
  <div>


    <div class="row">
      <div class="col-12">
        <div class="mt-3" v-if="levelDataInfo">
          <div style="padding: 0;">
            <div class="mb-2 ml-4 mt-2" style="font-size: 20px;">{{levelDataInfo.name}}</div>

            <div style="width: 95%; font-size: 13px;" class="mx-auto mt-4">

              <div class="row">
                <div class="col-4">
                    <div class="mb-4">
                      <b>Contacts</b><br />
                      Email:  <span>{{levelDataInfo.email}}</span> <br />
                      Phone:   <span>{{levelDataInfo.phone}}</span>
                    </div>
                </div>



                <div class="col-4">
              <div class="mb-4">
                <b>Address</b> <br />
                Location: <span>{{levelDataInfo.location}}</span>
              </div>
                </div>



                    <div class="col-4">
                    <b>Levels</b>
                      <div class="mb-7 mt-2">
                          <div class="mb-1" v-for="(item, index) in levelDataInfo.levels" :key="index">
                            <span>-{{item.name}}</span>
                          </div>
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

import {ref, watch} from "vue";
 import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
 const levelStore = useLevelStore()
 const routerData = useRouter()

const levelDataInfo = ref(null)




watch(
    () => levelStore.levelResponse,
    async (data) => {
      if(data){
       levelDataInfo.value = data.data
      }
    },
    {deep:true}
)

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