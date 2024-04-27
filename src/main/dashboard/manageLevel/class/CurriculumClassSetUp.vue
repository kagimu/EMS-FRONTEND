<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import NewCurriculumClass from "@/main/dashboard/manageLevel/class/NewCurriculumClass.vue";
import AppModal from "@/components/AppModal.vue";
const routerData = useRouter()


const classStore = useClassesStore()
const commons = useCommonsStore()
const levelStore = useLevelStore()
const  notificationStore  = useNotificationStore()

const level = ref( "")
const classDialog = ref( false)
const classList = ref( [])
const levelList = ref( [])
let  curriculumNumber = routerData.currentRoute.value.query.id


const addCampus = () => {
  classDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}

const filterClasses = (level) => {
  fetchClassList()
}

onMounted(
    async () => {
      await fetchClassList()
      await levelStore.fetchCurriculumLevels(curriculumNumber)
    }
)

const fetchClassList = () => {
  let data = {
    level:level.value,
    curriculum_number:curriculumNumber,
  }
  classStore.fetchCurriculumClasses(data)
}

watch(
    () => classStore.classResponse,
    async (data) => {
      if(data){
        await fetchClassList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => classStore.curriculumClassInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => classStore.curriculumClassResponse,
    async (data) => {
      if(data){
        await fetchClassList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)



watch(
    () => levelStore.curriculumLevelInfoResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    },
    {deep:true}
)

</script>
<template>
  <div>


    <AppModal title="Add Class" v-model="classDialog" lg>
      <new-curriculum-class  :curriculumClass="classList"></new-curriculum-class>
    </AppModal>


    <div class="row">

      <div class="col-12">

        <div class="mt-3">

            <div class="flex justify-content-between mt-3">
              <div class="ml-4">Curriculum Classes</div>
              <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addCampus">
                <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                Select Class
              </button>
            </div>



            <div class="row mx-auto mt-5">
              <div class="col-3">
                <div class="mb-2">
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="level"
                      @change="filterClasses(level)"
                  >
                    <option disabled value="">--Filter by Level--</option>
                    <option value="">All</option>
                    <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.level_number">{{lvl.code+". "+lvl.name}}</option>
                  </select>
                </div>
              </div>
            </div>



            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Level</th>
                <th scope="col">Class</th>
<!--                <th scope="col">Action</th>-->
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lvl, index) in classList" :key="index">
                <td>{{lvl.code}}</td>
                <td> {{lvl.name}}</td>
                <td>


                  <table class="table table-hover caption-top" style="font-size: 14px;">
                    <tbody>
                    <tr v-for="(cls, idx) in lvl.class" :key="idx">
                     <td>{{cls.code}}.</td>
                     <td>{{cls.name+" [ "+cls.abbreviation+" ]"}}</td>
<!--                     <td>
                       <div>
                         <i
                             style="font-size: 13px;"
                             data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                             class="bi-pencil mr-2 cursor-pointer" @click="editClass(cls)"></i>
                         <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(cls)"></i>
                       </div>
                     </td>-->
                    </tr>
                    </tbody>
                  </table>


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