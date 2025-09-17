<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewConcept from "@/main/dashboard/curriculum/curriculumSetup/concept/NewConcept.vue";
import {useConceptStore} from "@/main/dashboard/curriculum/curriculumSetup/concept/store/concept.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useTopicStore} from "@/main/dashboard/curriculum/curriculumSetup/topic/store/topic.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useStrandStore} from "@/main/dashboard/curriculum/curriculumSetup/strands/store/strand.js";
import {useSubtopicStore} from "@/main/dashboard/curriculum/curriculumSetup/subTopic/store/subTopic.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";

import AppModal from "@/components/AppModal.vue";
import ExportCurriculum from "@/main/dashboard/curriculum/importCurriculum/ExportCurriculum.vue";
import ImportCurriculum from "@/main/dashboard/curriculum/importCurriculum/importCurriculum.vue";
const routerData = useRouter()

const subjectStore = useSubjectStore()
const subjectClusterStore = useSubjectClusterStore()
const topicStore = useTopicStore()
const learningAreaStore = useLearningAreaStore()
const strandStore = useStrandStore()
const subtopicStore = useSubtopicStore()
const conceptStore = useConceptStore()
const classStore = useClassesStore()
const notificationStore  = useNotificationStore()
const deletionLoader = ref( undefined)
const editConceptDialog = ref( false)
const conceptEditMode = ref( false)
const conceptList = ref( [])
const subtopicList = ref( [])
const showExpandConceptModal = ref(false)
const exportCurriculumDialog = ref(false)



const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const topicList = ref([])
const classList = ref([])
const subject_cluster_number = ref("")
const subject_number = ref("")
const strand_number = ref("")
const topic_number = ref("")
const sub_topic_number = ref("")
const learning_area_number = ref("")
const class_number = ref("")
const conceptNumber = ref("")
// let  curriculumNumber = routerData.currentRoute.value.query.id

let  curriculumNumber = ""

if(routerData.currentRoute.value.query.id){
  curriculumNumber = routerData.currentRoute.value.query.id
}else {
  curriculumNumber = localStorage.getItem("CurriculumNum")
}



const editConcept = (data) => {
  editConceptDialog.value = true
  conceptEditMode.value = true
  conceptNumber.value = data.number
  // conceptStore.conceptData(data.number)
}
const deleteConcept = (data) => {
  if(!confirm("Are you sure, you want to delete: "+data.name)){
    return
  }

  deletionLoader.value = data.number

  let info = {
    number:data.number
  }

  conceptStore.deleteConcept(info)
}


const selectSubjectCluster = (learning_area_number) => {

  // learning_area_number.value = ""
  subject_cluster_number.value = ""
  subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""
  sub_topic_number.value = ""


  fetchConceptsList()
  subjectClusterStore.fetchSubjectClusterFilter({learning_area_number:learning_area_number, curriculum_number:curriculumNumber})
}



const selectSubject = (subject_cluster_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""
  sub_topic_number.value = ""

  fetchConceptsList()
  subjectStore.fetchSubjectList({subject_cluster_number:subject_cluster_number, curriculum_number:curriculumNumber})
}



const selectStrand = (subject_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  // subject_number.value = ""
  strand_number.value = ""
  topic_number.value = ""
  sub_topic_number.value = ""

  fetchConceptsList()
  strandStore.fetchStrandList({subject_number:subject_number, curriculum_number:curriculumNumber})
}



const selectTopic = (strand_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  // subject_number.value = ""
  // strand_number.value = ""
  topic_number.value = ""
  sub_topic_number.value = ""

  fetchConceptsList()
  topicStore.fetchTopicList({strand_number:strand_number, curriculum_number:curriculumNumber})
}



const selectSubTopic = (topic_number) => {

  // learning_area_number.value = ""
  // subject_cluster_number.value = ""
  // subject_number.value = ""
  // strand_number.value = ""
  // topic_number.value = ""
  sub_topic_number.value = ""
  fetchConceptsList()
  subtopicStore.fetchSubTopicList({topic_number:topic_number, curriculum_number:curriculumNumber})
}


onMounted(
    () => {
      fetchConceptsList()
      learningAreaStore.fetchLearningArea(curriculumNumber)
      selectSubjectCluster("")
      selectSubject("")
      selectStrand("")
      selectTopic("")
      selectSubTopic("")
      classStore.fetchClassesCurriculum(curriculumNumber)
    }
)


const fetchConceptsList = () => {
  let data = {
    learning_area_number:learning_area_number.value,
    subject_cluster_number:subject_cluster_number.value,
    subject_number:subject_number.value,
    strand_number:strand_number.value,
    topic_number:topic_number.value,
    sub_topic_number:sub_topic_number.value,
    class_number:class_number.value,
    curriculum_number:curriculumNumber,
  }
  conceptStore.fetchConcepts(data)
}

const expandConceptUi = () => {
  showExpandConceptModal.value = true
}



watch(
    () => conceptStore.conceptResponse,
    async (data) => {
      if(data){
        fetchConceptsList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => conceptStore.deleteConceptResponse,
    async (data) => {
      if(data){
        fetchConceptsList()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch(
    () => conceptStore.conceptEditResponse,
    async (data) => {
      if(data){
        fetchConceptsList()
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


watch(
    () => strandStore.strandListResponse,
    async (data) => {
      if(data){
        strandList.value = data.data
      }
    },
    {deep:true}
)




watch(
    () => topicStore.topicListResponse,
    async (data) => {
      if(data){
        topicList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => subtopicStore.subtopicListResponse,
    async (data) => {
      if(data){
        subtopicList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => classStore.classCurriculumResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)


const exportCurriculumInfo = () => {
  exportCurriculumDialog.value = true
}


</script>
<template>
  <div>

    <AppModal :title="conceptEditMode ? 'Edit Concept' : 'Add Concept'" v-model="editConceptDialog" lg>
      <new-concept :conceptNo="conceptNumber"></new-concept>
    </AppModal>


    <AppModal title="Export Curriculum" v-model="exportCurriculumDialog" lg>
      <export-curriculum></export-curriculum>
    </AppModal>




    <div class="mt-3 flex justify-between">
      <div class="ml-4">Export Curriculum</div>

      <div>

        <button type="button"  class="btn btn-sm buttonStyle btn-outline-secondary mr-2"  @click="exportCurriculumInfo">
          <i style="font-size: 15px;"  class="bi-file-excel mr-2"></i>
          Export Curriculum Excel
        </button>

        <button type="button"  class="btn btn-sm buttonStyle btn-outline-success mr-2"  @click="exportCurriculumInfo">
          <i style="font-size: 15px;"  class="bi-file-pdf mr-2"></i>
          Export Curriculum Pdf
        </button>



        <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="importFromExcel">
          <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
          Import from Excel
        </button>



      </div>
    </div>



    <div class="row">
      <div class="col-12">
        <div class="mt-3">


          <div class="row mx-auto mb-5 mt-5">

            <div class="col-4 mb-2">
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

            <div class="col-4 mb-2">
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

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="subject_number"
                  @change="selectStrand(subject_number)"
              >
                <option disabled value="">--Filter by Subject--</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>


            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="strand_number"
                  @change="selectTopic(strand_number)"
              >
                <option disabled value="">--Filter by Strand--</option>
                <option value="">All</option>
                <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>


            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="topic_number"
                  @change="selectSubTopic(topic_number)"
              >
                <option disabled value="">--Select Topic--</option>
                <option value="">All</option>
                <option v-for="(list, index) in topicList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>


            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="sub_topic_number"
                  @change="fetchConceptsList()"
              >
                <option disabled value="">--Select Sub Topic--</option>
                <option value="">All</option>
                <option v-for="(list, index) in subtopicList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="class_number"
                  @change="fetchConceptsList()"
              >
                <option disabled value="">--Filter by Class--</option>
                <option value="">All</option>
                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.code+". "+list.name+" [ "+list.abbreviation+" ]"}}</option>
                <!--                <option v-for="(list, index) in classList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>-->
              </select>
            </div>

          </div>

         <div class="w-[40%]">
           <table class="table table-hover caption-top border" style="font-size: 12px;">
             <tr>
               <td><b>Learning Area Code</b></td>
               <td><b>Learning Area</b></td>
             </tr>
             <tr>
               <td>1</td>
               <td>Mental Studies</td>
             </tr>
             <tr>
               <td><b>Subject Cluster Code</b></td>
               <td><b>Subject Cluster</b></td>
             </tr>
             <tr>
               <td>13</td>
               <td>Subject For Understanding Studies</td>
             </tr>
             <tr>
               <td><b>Subject Code</b></td>
               <td><b>Subject</b></td>
             </tr>
             <tr>
               <td>133</td>
               <td>Mathematics</td>
             </tr>
             <tr>
               <td><b>Class</b></td>
               <td></td>
             </tr>
             <tr>
               <td>P7</td>
               <td></td>
             </tr>


           </table>
         </div>




          <div style="width: 100%; overflow-x: auto; white-space: nowrap; scrollbar-width: thin;">
            <table class="table table-hover caption-top border" style="font-size: 12px;">
              <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Learning Area</th>
                <th scope="col">Subject Cluster</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst, index) in conceptList" :key="index">
                <td>{{lst.code}}</td>
                <td>
                  <div class="text-wrap" style="width: 150px;">{{lst.name}}</div>
                </td>
                <td>


                  <table class="table table-hover caption-top" style="width: 100%;">
                    <tbody>
                    <tr v-for="(sbct, idx) in lst.subject_cluster" :key="idx">
                      <td style="width: 5px;">{{sbct.code}}.</td>
                      <td style="width: 30px;"><div class="text-wrap" style="width: 150px;">{{sbct.name}}</div></td>
                      <td style="width: 65px;">




                        <table class="table table-hover caption-top" style="width: 100%;">
                          <tbody>
                          <tr v-for="(sbt, idx) in sbct.subject" :key="idx">
                            <td style="width: 5%;">{{sbt.code}}.</td>
                            <td style="width: 40%;"><div class="text-wrap" style="width: 150px;">{{sbt.name}}</div></td>
                            <td style="width: 65%;">



                              <table class="table table-hover caption-top" style="width: 100%;">
                                <tbody>
                                <tr v-for="(std, idx) in sbt.strand" :key="idx">
                                  <td style="width: 5%;">{{std.code}}.</td>
                                  <td style="width: 30%;"><div class="text-wrap" style="width: 150px;">{{std.name}}</div></td>
                                  <td style="width: 65%;">




                                    <table class="table table-hover caption-top" style="width: 100%;">
                                      <tbody>
                                      <tr v-for="(tpc, idx) in std.topic" :key="idx">
                                        <td style="width: 5%;">{{tpc.code}}.</td>
                                        <td style="width: 30%;">
                                          <div class="text-wrap" style="width: 100px;">{{tpc.name}}</div>
                                        </td>
                                        <td style="width: 65%;">




                                          <table class="table table-hover caption-top" style="width: 100%;">
                                            <tbody>
                                            <tr v-for="(stpc, idx) in tpc.subtopic" :key="idx">
                                              <td style="width: 5%;">{{stpc.code}}.</td>
                                              <td style="width: 60%;">
                                                <div class="flex justify-between">
                                                  <div class="text-wrap" style="width: 150px; margin-right: 20px;">{{stpc.name}}</div>
                                                  <div>{{stpc.estimated_time}} (min)</div>
                                                </div>


                                                <div class="mt-3 ml-10">
                                                  <div  v-if="(stpc.concept && stpc.concept.length > 0)"><b>Concept(s)</b></div>
                                                  <table class="table table-hover caption-top " style="width: 100%;">
                                                    <tbody>
                                                    <tr v-for="(ccp, idx) in stpc.concept" :key="idx">
                                                      <td style="width: 5%;">{{ccp.code}}.</td>
                                                      <td>
                                                        <div class="text-wrap" style="width: 150px;">
                                                          {{ccp.name}}
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <div>
                                                          <i
                                                              style="font-size: 13px;"
                                                              class="bi-pencil mr-2 cursor-pointer" @click="editConcept(ccp)"></i>
                                                          <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteConcept(ccp)"></i>
                                                          <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === ccp.number">
                                                            <span class="visually-hidden">Loading...</span>
                                                          </div>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                    </tbody>
                                                  </table>
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



<style scoped>

</style>