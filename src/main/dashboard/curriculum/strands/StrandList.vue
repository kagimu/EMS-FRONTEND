<template>
  <div>

    <div class="modal fade" id="subjectModal" tabindex="-1" :class="{ show: strandDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Strand</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-strand></new-strand>
            </div>
          </div>

        </div>
      </div>
    </div>


    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Strand</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject" data-bs-toggle="modal" data-bs-target="#subjectModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Strand
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="mt-3">
<!--          <div style="padding: 0;">-->

<!--            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Strand</div>-->

            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th class="text-end" scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in strandList" :key="index">
                <td>{{index+1}}</td>
                <td>

<!--                  <router-link
                      :to="{name:'topic', query:{id:lst.number}}"
                      class="text-decoration-none"
                  >-->
                  {{lst.name}}
<!--                  </router-link>-->

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

<!--          </div>-->
        </div>
      </div>
    </div>



  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewStrand from "@/main/dashboard/curriculum/strands/NewStrand.vue";
import {useStrandStore} from "@/main/dashboard/curriculum/strands/store/strand.js";
const routerData = useRouter()


const strandStore = useStrandStore()
const notificationStore  = useNotificationStore()

const strandDialog = ref( false)
const strandList = ref( [])
let subjectNo = routerData.currentRoute.value.query.id
    subjectNo = subjectNo ? subjectNo : ""

const addSubject = () => {
  strandDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

onMounted(
    () => {
      strandStore.fetchStrands(subjectNo)
    }
)

watch(
    () => strandStore.strandResponse,
    async (data) => {
      if(data){
        strandDialog.value = false
        strandStore.fetchStrands(subjectNo)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => strandStore.strandInfoResponse,
    async (data) => {
      if(data){
        strandList.value = data.data
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