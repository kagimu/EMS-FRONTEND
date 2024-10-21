<template>
  <div>
    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="strandEditMode ? 'Edit Strand' : 'Add Strand'" v-model="strandDialog" lg>
      <new-strand></new-strand>
    </AppModal>


    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Strand</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject" data-bs-toggle="modal" data-bs-target="#strandModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Strand
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="mt-3">

          <div class="row mx-auto">

            <div class="col-4 mb-5 mt-5">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="learning_area_number"
                  @change="selectSubjectCluster(learning_area_number)"
                  >
                <option disabled value="">--Filter by Learning Area--</option>
                <option value="">All</option>
                <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-5 mt-5">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_cluster_number"
                  @change="selectSubject(subject_cluster_number)"
                  >
                <option disabled value="">--Filter by Subject Cluster--</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-5 mt-5">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_number"
                  @change="filterStrandList()"
                  >
                <option disabled value="">--Filter by Subject--</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

          </div>

          <div style="width: 100%; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;">
            <table class="table table-hover caption-top" style="font-size: 12px;">
              <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Learning Area</th>
                <th scope="col">Subject Cluster</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in strandList" :key="index">
                <td>{{lst.code}}</td>
                <td>
                  <div class="text-wrap" style="width: 150px;">{{lst.name}}</div>
                </td>
                <td>



                  <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                    <tbody>
                    <tr v-for="(sbct, idx) in lst.subject_cluster" :key="idx">
                      <td style="width: 5%;">{{sbct.code}}.</td>
                      <td style="width: 30%;">
                        <div class="text-wrap" style="width: 150px;">{{sbct.name}}</div>
                      </td>
                      <td style="width: 65%;">




                        <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                          <tbody>
                          <tr v-for="(sbt, idx) in sbct.subject" :key="idx">
                            <td style="width: 5%;">{{sbt.code}}.</td>
                            <td style="width: 40%;">
                              <div class="text-wrap" style="width: 150px;">{{sbt.name}}</div>
                            </td>
                            <td style="width: 55%;">



                              <table class="table table-hover caption-top" style="font-size: 12px; width: 100%;">
                                <tbody>
                                <tr v-for="(std, idx) in sbt.strand" :key="idx">
                                  <td style="width: 5%;">{{std.code}}.</td>
                                  <td style="width: 60%;">
                                    <div class="text-wrap" style="width: 150px;">{{std.name}}</div>
                                  </td>
                                  <td>
                                    <div>
                                      <i
                                          style="font-size: 13px;"
                                          class="bi-pencil mr-2 cursor-pointer" @click="editStrand(std)"></i>
                                      <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteStrand(std)"></i>
                                      <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === std.number">
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


                      </td>
                    </tr>
                    </tbody>
                  </table>

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
import NewStrand from "@/main/dashboard/curriculum/curriculumSetup/strands/NewStrand.vue";
import {useStrandStore} from "@/main/dashboard/curriculum/curriculumSetup/strands/store/strand.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);


const routerData = useRouter()


const subjectStore = useSubjectStore()
const strandStore = useStrandStore()
const notificationStore  = useNotificationStore()
const learningAreaStore = useLearningAreaStore()
const subjectClusterStore = useSubjectClusterStore()

const strandDialog = ref( false)
const strandEditMode = ref( false)
const strandList = ref( [])
const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const subject_cluster_number = ref("")
const subject_number = ref("")
const learning_area_number = ref("")
const deletionLoader = ref(undefined)
let  curriculumNumber = routerData.currentRoute.value.query.id

const addSubject = () => {
  strandEditMode.value = false
  strandDialog.value = true
}

const editStrand = (data) => {
  strandDialog.value = true
  strandEditMode.value = true
  strandStore.strandData(data.number)
}
// const deleteStrand = (data) => {
//   if(!confirm("Are you sure, you want to delete: "+data.name)){
//     return
//   }

//   deletionLoader.value = data.number

//   let info = {
//     number:data.number
//   }

//   strandStore.deleteStrand(info)
// }


const deleteStrand = async (data) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+data.name);
if (agreed) {
  deletionLoader.value = data.number

  let info = {
    number:data.number
  }

  strandStore.deleteStrand(info)
}


}


const selectSubjectCluster = (learning_area_number) => {


  // learning_area_number.value = ""
  subject_cluster_number.value = ""
  subject_number.value = ""

  filterStrandList()
  subjectClusterStore.fetchSubjectClusterFilter({learning_area_number:learning_area_number, curriculum_number:curriculumNumber})
}

const selectSubject = (subject_cluster_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  subject_number.value = ""

  filterStrandList()
  subjectStore.fetchSubjectList({subject_cluster_number:subject_cluster_number, curriculum_number:curriculumNumber})
}

const curriculum_number = localStorage.getItem("CurriculumNum")

onMounted(
    () => {
      filterStrandList()


      if(curriculum_number){
        learningAreaStore.fetchLearningArea(curriculum_number)
      }else{
        learningAreaStore.fetchLearningArea(curriculumNumber)
      }
      
      selectSubjectCluster("")
      selectSubject("")
    }
)

const filterStrandList = () => {
  if(curriculum_number){
   curriculumNumber = curriculum_number
  }

  let data = {
    learning_area_number:learning_area_number.value,
    subject_cluster_number:subject_cluster_number.value,
    subject_number:subject_number.value,
    curriculum_number:curriculumNumber,
  }
  strandStore.fetchStrands(data)
}

watch(
    () => strandStore.strandResponse,
    async (data) => {
      if(data){
        await filterStrandList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => strandStore.strandEditResponse,
    async (data) => {
      if(data){
        await filterStrandList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => strandStore.deleteStrandResponse,
    async (data) => {
      if(data){
         deletionLoader.value = false
        await filterStrandList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => strandStore.errorMessage,
    async (data) => {
      if(data){
        deletionLoader.value = false
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

watch(
    () => learningAreaStore.learningAreaInfResponse,
    async (data) => {
      if(data){
        learningAreaList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => subjectClusterStore.subjectClusterFilterResponse,
    async (data) => {
      if(data){
        subjectClusterList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => subjectStore.subjectListResponse,
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