<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">

        <div class="offcanvas offcanvas-end" :class="{ show: subjectDialog }"    tabindex="-1" id="newSubject" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Subject</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <new-subject></new-subject>
          </div>
        </div>

      </div>
    </div>


    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Subjects</div>
      <button
          data-bs-toggle="offcanvas" data-bs-target="#newClass" aria-controls="offcanvasRight"
          @click="addSubject"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Subject
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">

            <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Subject</div>


            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th class="text-end" scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in subjectList" :key="index">
                <td>{{index+1}}</td>
                <td>

                  <router-link
                      :to="{name:'strands', query:{id:lst.number}}"
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
import NewSubject from "@/main/dashboard/curriculum/subject/NewSubject.vue";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
const routerData = useRouter()


const subjectStore = useSubjectStore()
const  notificationStore  = useNotificationStore()

const subjectDialog = ref( false)
const subjectList = ref( [])
const subjectClusterNo = routerData.currentRoute.value.query.id


const addSubject = () => {
  subjectDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

onMounted(
    () => {
      subjectStore.fetchSubjects(subjectClusterNo)
    }
)

watch(
    () => subjectStore.subjectResponse,
    async (data) => {
      if(data){
        subjectDialog.value = false
        subjectStore.fetchSubjects(subjectClusterNo)
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.subjectInfoResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
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