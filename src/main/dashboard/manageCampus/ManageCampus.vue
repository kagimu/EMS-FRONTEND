<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">

        <button
            class="btn btn-primary btn-sm"
            @click="addCampus"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight">Add Campus</button>



        <div class="offcanvas offcanvas-end" :class="{ show: campusDialog }"    tabindex="-1" id="newClass" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add New Campus</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <new-campus></new-campus>
          </div>
        </div>





      </div>
    </div>



    <div class="row">
      <div class="col-4">
        <div class="card mt-3">
              <div class="card-body">
                <div class="mb-3" style="font-size: 20px;">BUNAMWAYA CAMPUS</div>
                <small>
                  mwesigwa.noregrets@gmail.com<br />
                  +256752698545<br />
                  Bunamwaya, P.O.BOX 21671 Kampala
                </small>
              </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script setup>

import {ref, watch} from "vue";
import NewCampus from "@/main/dashboard/manageCampus/NewCampus.vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import useNotificationStore from "@/composables/useNotification.js";

const campusStore = useCampusStore()
const  notificationStore  = useNotificationStore()

const campusDialog = ref( false)

const addCampus = () => {
  campusDialog.value = true
}

watch(
    () => campusStore.newCampusResponse,
    async (data) => {
      if(data){
        campusDialog.value = false
        notificationStore.successToast("Success", data.message)
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

</style>