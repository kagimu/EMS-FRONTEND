<template>
  <div>

    <div class="row mt-3">
      <div class="col-12">



        <div class="offcanvas offcanvas-end" :class="{ show: classSubjectDialog }"    tabindex="-1" id="newClassSubject" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasRightLabel">Add Subject to Class</h5>
            <button type="button" class="btn-close noFocus" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
           <new-subject-class :classNumber="classNumber"></new-subject-class>
          </div>
        </div>



      </div>
    </div>




    <div class="row mx-auto mb-4 mt-3">
      <div class="col-6" v-for="(item, index) in classList" :key="index">

        <div class="card mt-3">
          <div class="card-body p-0">
            <div class="p-0 py-2 flex justify-content-between" style="font-size: 12px;">
              <span class="ml-3 mt-2">
                 {{item.name}}
              </span>


              <button
                  data-bs-toggle="offcanvas" data-bs-target="#newClassSubject" aria-controls="offcanvasRight"
                  @click="addSubject(item)"
                  type="button"
                  class="btn btn-sm text-sm buttonStyle btn-primary mr-2">
                <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
                Add Subject
              </button>

            </div>


<!--            <table class="table table-hover caption-top" style="font-size: 12px; width: 100%; border-top: 1px solid #e8e8e8;">
              <tbody>
              <tr v-for="(sbj, idx) in item.subjects" :key="idx">
                <td>{{idx+1}}</td>
                <td>{{sbj.name}}</td>
                <td>
                  <div class="float-end mr-2">
                    <i
                        style="font-size: 13px;"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" @click="editClass(sbj)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(sbj)"></i>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>-->





          </div>
        </div>

      </div>


    </div>









  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import NewSubjectClass from "@/main/dashboard/manageLevel/subjectClasses/NewSubjectClass.vue";
const routerData = useRouter()
const classStore = useClassesStore()
const campusLevel = routerData.currentRoute.value.query.l

const classSubjectDialog = ref( false)
const classList = ref( [])
const classNumber = ref( "")


onMounted(
    () => {
      classStore.fetchClassSubjects(campusLevel)
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
        classList.value = data.data
      }
    },
    {deep:true}
)


</script>

<style scoped>

</style>