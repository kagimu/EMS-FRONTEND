<template>
  <div>

    <div class="modal fade" id="schemeOfWorkModal" tabindex="-1" :class="{ show: curriculumDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2"> {{(schemeOfWorkList.number && (schemeOfWorkList.status === "Pending")) ? "Edit Scheme of work" : "Add Scheme of work"}}  </h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-scheme-of-work :schemeOfWorkList="schemeOfWorkList" ref="schemeOfWorkRef"></new-scheme-of-work>
            </div>
          </div>

        </div>`
      </div>
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
            <option disabled value="">Filter by Level</option>
            <option value="">All</option>
            <option v-for="(lvl, index) in commons.classLevelList()" :key="index" :value="lvl">{{lvl}}</option>
          </select>
        </div>
      </div>
    </div>


    <div class="row">


      <div class="col-3">

        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">
            <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Classes</div>
            <hr />
            <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
              <div
                  v-for="(item, idx) in  classList"
                  :key="idx"
                  class="list-group-item list-group-item-action cursor-pointer"
                  :class="item.number === selectedClass ? 'active' : ''"
                  @click="changeMenu(item.number)"
              >
                <small style="font-size:12px;">{{item.name}}</small>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div class="col-9">
        <div class="card mt-3">
          <div class="card-body" style="padding: 0;">


            <div class="flex justify-content-between mt-3">

              <div>
                <div class="ml-4"><b>Scheme of work</b></div>
                <div class="ml-7" v-if="schemeOfWorkList.name"><small><b>Title:</b> {{schemeOfWorkList.name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.class_name"><small><b>Class:</b> {{schemeOfWorkList.class_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.subject_name"><small><b>Subject:</b> {{schemeOfWorkList.subject_name}}</small></div>
                <div class="ml-7" v-if="schemeOfWorkList.status"><small><b>Status:</b> {{schemeOfWorkList.status}}</small></div>
              </div>

                <div>
                  <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addCurriculum" data-bs-toggle="modal" data-bs-target="#schemeOfWorkModal">
                    <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                    {{(schemeOfWorkList.number && (schemeOfWorkList.status === "Pending")) ? " Edit Scheme" : " Add Scheme"}}
                  </button>
                </div>

            </div>

            <hr />


            <div class="row mx-auto">
              <div class="col-3">
            <div class="mb-3">
              <label class="textColor"><small>Sort by Subject</small></label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="scheme_subject_number"
                  @click="filterSchemeSubject(scheme_subject_number)"
              >
                <option disabled value="">filter Subject</option>
                <option v-for="(list, index) in schemeSubjectList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>
              </div>
            </div>


            <hr />


            <table class="table table-hover caption-top" style="font-size: 14px;">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Strand</th>
                <th scope="col">Topic</th>
                <th scope="col">Sequence</th>
                <th scope="col">Subtopic</th>
                <th scope="col">Estimated Time (Min)</th>
                <th scope="col">Lesson Plan</th>
<!--                <th scope="col" class="text-end">Action</th>-->
              </tr>
              </thead>
              <tbody>
              <tr v-for="(lst,index) in schemeOfWorkList.subtopic" :key="index" >
                <td scope="row">{{index+1}}</td>
                <td>
                  {{lst.strand_name}}
                </td>
                <td>
                  {{lst.topic_name}}
                </td>
                <td>
                  {{lst.code}}
                </td>
                <td>
                  {{lst.name}}
                </td>
                <td>
                  {{lst.estimated_time}}
                </td>
                <td>

                </td>

<!--                <td>
                  <div class="float-end mr-2">
                    <i
                        style="font-size: 13px;"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" @click="editClass(sbj)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(sbj)"></i>
                  </div>
                </td>-->
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
import {useLearningAreaStore} from "@/main/dashboard/curriculum/lerningArea/store/learningArea.js";
import useNotificationStore from "@/composables/useNotification.js";
import NewSchemeOfWork from "@/main/dashboard/schemeOfWork/NewSchemeOfWork.vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import router from "@/config/router.js";
import {useRouter} from "vue-router";
import {useSchemeOfWorkStore} from "@/main/dashboard/schemeOfWork/store/schemeOfWork.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";

const level = ref( "")
const curriculumDialog = ref( false)
const learningAreaList = ref( [])
const classList = ref( [])
const classStore = useClassesStore()
const selectedClass = ref( null)
const routerData = useRouter()


const learningAreaStore = useLearningAreaStore()
const  notificationStore  = useNotificationStore()

const scheme_subject_number = ref(null)
const learningAreaRef = ref(null)
const schemeOfWorkList = ref([])
const schemeSubjectList = ref([])
const commons = useCommonsStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
const subjectStore = useSubjectStore()

let subjectNo = routerData.currentRoute.value.query.c
if(subjectNo){
  selectedClass.value =  subjectNo
}


const addCurriculum = () => {
  curriculumDialog.value = true
}

const changeMenu = (value) => {
  selectedClass.value = value
  router.push({ name: "scheme-of-work", query:{c:value} })
}

const filterClasses = (level) => {
  classStore.fetchClasses(level)
}

const filterSchemeSubject = (scheme_subject_number) => {
  let data = {
    subject_number:scheme_subject_number,
    class_number:selectedClass.value
  }
  schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
}

onMounted(
    () => {
      classStore.fetchClasses("")
      if(selectedClass.value) {
        subjectStore.fetchSchemeSubjectByClass(selectedClass.value)
        // schemeOfWorkStore.fetchSchemeOfWorkByClass(selectedClass.value)
      }
    }
)



watch(
    () => classStore.classInfoResponse,
    async (data) => {
      if(data){
        let classInfo = data.data
       classList.value = classInfo
        if(classInfo && (classInfo.length > 0)){
          if(!selectedClass.value){
            let classNo = classInfo[0].number
            selectedClass.value = classNo
            await subjectStore.fetchSchemeSubjectByClass(classNo)
            await schemeOfWorkStore.fetchSchemeOfWorkByClass(classInfo[0].number)
          }
        }
      }
    },
    {deep:true}
)


watch(
    () => schemeOfWorkStore.newSchemeOfWorkResponse,
    async (data) => {
      if(data){
        if(selectedClass.value) {
          let data = {
            subject_number:scheme_subject_number.value,
            class_number:selectedClass.value
          }
          await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
        }
        notificationStore.successToast("Success",data.message)
      }
    },
    {deep:true}
)

watch(
    () => schemeOfWorkStore.schemeOfWorkByClassResponse,
    async (data) => {
      if(data){
        schemeOfWorkList.value = data.data
      }
    },
    {deep:true}
)


watch(
    () => schemeOfWorkStore.updateSchemeOfWorkResponse,
    async (data) => {
      if(data){
        if(selectedClass.value) {
          let data = {
            subject_number:scheme_subject_number.value,
            class_number:selectedClass.value
          }
          await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)
        }
        notificationStore.successToast("Success",data.message)
      }
    },
    {deep:true}
)


watch(
    () => subjectStore.schemeSubjectByClassResponse,
    async (data) => {
      if(data){
        let subjectInfo = data.data
        schemeSubjectList.value = subjectInfo
        if(!scheme_subject_number.value){
          let subjectNo = subjectInfo[0].number
          scheme_subject_number.value = subjectNo


          let data = {
            subject_number:subjectNo,
            class_number:selectedClass.value
          }
          await schemeOfWorkStore.fetchSchemeOfWorkByClass(data)

        }
      }
    },
    {deep:true}
)


</script>

<style scoped>

</style>