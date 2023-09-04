<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">

        <div class="offcanvas offcanvas-end" :class="{ show: conceptDialog }"    tabindex="-1" id="newConcept" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Concept</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
           <new-concept></new-concept>
          </div>
        </div>

      </div>
    </div>


    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Concept</div>
      <button
          data-bs-toggle="offcanvas" data-bs-target="#newConcept" aria-controls="offcanvasRight"
          @click="addConcept"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Concept
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Cencept</div>


            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th class="text-end" scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in conceptList" :key="index">
                <td>{{index+1}}</td>
                <td>

                  {{lst.name}}

                </td>
                <td>
                  <div class="float-end mr-2">
                    <i
                        style="font-size: 13px;"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" @click="editClass(lst)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(lst)"></i>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewConcept from "@/main/dashboard/curriculum/concept/NewConcept.vue";
import {useConceptStore} from "@/main/dashboard/curriculum/concept/store/concept.js";
const routerData = useRouter()


const conceptStore = useConceptStore()
const notificationStore  = useNotificationStore()

const conceptDialog = ref( false)
const conceptList = ref( [])
const subtopicNo = routerData.currentRoute.value.query.id


const addConcept = () => {
  conceptDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

onMounted(
    () => {
      conceptStore.fetchConcepts(subtopicNo)
    }
)

watch(
    () => conceptStore.conceptResponse,
    async (data) => {
      if(data){
        conceptDialog.value = false
        conceptStore.fetchConcepts(subtopicNo)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => conceptStore.conceptInfoResponse,
    async (data) => {
      if(data){
        conceptList.value = data.data
      }
    },
    {deep:true}
)


</script>

<style scoped>

.linkStyle {
  text-decoration: none;
  color: #1867c0;
  font-size: 16px;
}

.linkStyle:hover {
  font-size: 16px;
  color: green;
  text-decoration: underline;
}

.viewButtonStyle{
  background-color: #2c6fb9;
  color: #ffffff;
  border-radius: 0;
}

.viewButtonStyle:hover {
  background-color: #0557b4;
  color: #ffffff;
}

</style>