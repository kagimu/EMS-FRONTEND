<template>
  <div>
    <div class="modal fade" id="subjClassModal" tabindex="-1" :class="{ show: classSubjectDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Subject to Class</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-subject-class></new-subject-class>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="flex justify-content-between mt-4 mb-4 mr-3">
      &nbsp;
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject" data-bs-toggle="modal" data-bs-target="#subjClassModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Subject
      </button>
    </div>



    <div class="row mx-auto mb-4">
      <div class="col-3">
    <div class="mb-2">
      <label class="textColor"><small>Class</small></label>
      <select
          style="box-shadow: none;"
          class="form-select form-select-sm"
          v-model="classNumber"
          @change="filterClassSubject(classNumber)"
      >
        <option disabled value="">Select Class</option>
        <option value="">All</option>
        <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.name}}</option>
      </select>
    </div>
      </div>
    </div>



    <table class="table table-hover caption-top" style="font-size: 14px;">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Class</th>
        <!--        <th scope="col">Action</th>-->
      </tr>
      </thead>
      <tbody>
      <tr v-for="(classes, index) in subjectList" :key="index">
        <td>{{index+1}}</td>
        <td> {{classes.name}}</td>
        <td> {{classes.class+" ("+classes.abbreviation+")"}}</td>
        <!--        <td>
                  <div>
                    <i
                        style="font-size: 13px;"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" @click="editClass(classes)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(classes)"></i>
                  </div>
                </td>-->
      </tr>
      </tbody>
    </table>





  </div>

</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import NewSubjectClass from "@/main/dashboard/manageLevel/subjectClasses/NewSubjectClass.vue";
import useNotificationStore from "@/composables/useNotification.js";
const routerData = useRouter()
const classStore = useClassesStore()
const campusLevel = routerData.currentRoute.value.query.l
const  notificationStore  = useNotificationStore()

const classSubjectDialog = ref( false)
const subjectList = ref( [])
const classList = ref( [])
const classNumber = ref( "")


const editClass = () => {

}

const deleteClass = () => {

}

const filterClassSubject = (data) => {
  classStore.fetchClassSubjects({level:campusLevel, class:data})
}

onMounted(
    () => {
      classStore.fetchClassSubjects({level:campusLevel, class:classNumber.value})
    }
)


const addSubject = (item) => {
  classNumber.value = item.number
  classSubjectDialog.value = true
}




watch(
    () => classStore.classSubjectsInfoResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => classStore.classSubjectResponse,
    async (data) => {
      if(data){
        classSubjectDialog.value = false
        await classStore.fetchClassSubjects({level:campusLevel, class:classNumber.value})
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)


watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if (data) {
        classList.value = data.data
      }
    },
    {deep: true}
)


</script>

<style scoped>

</style>