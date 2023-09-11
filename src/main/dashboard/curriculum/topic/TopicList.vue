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
               <new-topic></new-topic>
            </div>
          </div>

        </div>
      </div>
    </div>





    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Topic</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject" data-bs-toggle="modal" data-bs-target="#subjectModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Topic
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="mt-3">
<!--          <div class="card-body" style="padding: 0;">-->

<!--            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Topic</div>-->

            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th class="text-end" scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in topicList" :key="index">
                <td>{{index+1}}</td>
                <td>

                  <router-link
                      :to="{name:'sub-topic', query:{id:lst.number}}"
                      class="text-decoration-none"
                  >
                  {{lst.name}}
                  </router-link>

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
import NewTopic from "@/main/dashboard/curriculum/topic/NewTopic.vue";
import {useTopicStore} from "@/main/dashboard/curriculum/topic/store/topic.js";
const routerData = useRouter()


const topicStore = useTopicStore()
const notificationStore  = useNotificationStore()

const strandDialog = ref( false)
const topicList = ref( [])
let strandNo = routerData.currentRoute.value.query.id
    strandNo = strandNo ? strandNo : ""


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
      topicStore.fetchTopics(strandNo)
    }
)

watch(
    () => topicStore.topicResponse,
    async (data) => {
      if(data){
        strandDialog.value = false
        topicStore.fetchTopics(strandNo)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => topicStore.topicInfoResponse,
    async (data) => {
      if(data){
        topicList.value = data.data
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