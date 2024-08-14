<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";
import {useRouter} from "vue-router";
import NewClassSetUp from "@/main/dashboard/manageLevel/class/NewClassSetUp.vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

const routerData = useRouter()

import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";

const { can } = useAbility()

const classStore = useClassesStore()
const commons = useCommonsStore()
const levelStore = useLevelStore()
const deletionLoader = ref( undefined)
const  notificationStore  = useNotificationStore()

const classRef = ref( null)
const level = ref( "")
const classDialog = ref( false)
const classEditMode = ref( false)
const classList = ref( [])
const levelList = ref( [])
let  curriculumNumber = routerData.currentRoute.value.query.id


const addClass = () => {
  classEditMode.value = false
  classDialog.value = true
  classRef.value.clearClassForm()
}

const editClass = (data) => {
  classDialog.value = true
  classEditMode.value = true
  classStore.classData(data.number)
}

// const deleteClass = (data) => {

//   if(!confirm("Are you sure, you want to delete: "+data.name)){
//     return
//   }

//   deletionLoader.value = data.number

//   let info = {
//     number:data.number
//   }

//   classStore.deleteClassSetUp(info)
// }



const deleteClass = async (data) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+data.name);
if (agreed) {
  deletionLoader.value = data.number

let info = {
  number:data.number
}

classStore.deleteClassSetUp(info)
}


}


const filterClasses = () => {
  fetchClassList()
}

onMounted(
    async () => {
      await fetchClassList()
      await levelStore.fetchLevels()
    }
)

const fetchClassList = () => {
  let data = {
    level:level.value,
  }
  classStore.fetchClasses(data)
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
    () => classStore.deleteClassSetUpResponse,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
        await fetchClassList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => classStore.classEditResponse,
    async (data) => {
      if(data){
        await fetchClassList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => classStore.classInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => levelStore.levelInfoResponse,
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

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
    
    <AppModal :title="classEditMode ? 'Edit Class' : 'Add Class'" v-model="classDialog" lg>
      <new-class-set-up ref="classRef"></new-class-set-up>
    </AppModal>



    <div class="row">


      <div class="col-12">



        <div class="mt-3">
 
            <div class="flex justify-content-between mt-3">
              <div class="ml-4">Classes</div>
              <button
              v-if="can('add_class','general')"
               type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addClass">
                <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                Add Class
              </button>
            </div>



            <div class="row mx-auto mt-5">
              <div class="col-3">
                <div class="mb-2">
                  <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm"
                      v-model="level"
                      @change="filterClasses()"
                  >
                    <option disabled value="">--Filter by Level--</option>
                    <option value="">All</option>
                    <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
                  </select>
                </div>
              </div>
            </div>



            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th class="w-[10%]">#</th>
                <th class="w-[30%]">Level</th>
                <th>Class</th>
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
                     <td class="w-[10%]">{{cls.code}}.</td>
                     <td class="w-[60%]">{{cls.name+" [ "+cls.abbreviation+" ]"}}</td>
                     <td>
                       <div>
                         <i
                         v-if="can('edit_class','general')"
                             style="font-size: 13px;"
                             data-bs-toggle="modal" data-bs-target="#classModal"
                             class="bi-pencil mr-2 cursor-pointer" @click="editClass(cls)"></i>
                         <i
                         v-if="can('delete_class','general')"
                          style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(cls)"></i>
                         <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === cls.number">
                           <span class="visually-hidden">Loading...</span>
                         </div>
                       </div>
                     </td>
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