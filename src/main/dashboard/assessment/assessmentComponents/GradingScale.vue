<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import NewGradeScale from "@/main/dashboard/assessment/assessmentComponents/NewGradeScale.vue"
import { useAssessmentStore } from "../store/assessment";
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);


const  notificationStore  = useNotificationStore()
const assessmentStore = useAssessmentStore()
const levelStore = useLevelStore()
const classStore = useClassesStore()
const academicYearStore = useAcademicYearStore()
const routerData = useRouter()

const { can } = useAbility()
const aggregateData = ref([])
const errorMessage = ref(null)
const showAggregateScaleModal = ref(false)
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const campusCurriculumDataInfo = ref(null)
const campusLevelList = ref(null)
const campusClassList = ref(null)
const editMode = ref(false)
const gradeScaleDatainfo = ref([])
let schoolNumber = routerData.currentRoute.value.query.sch
const deletionLoader = ref(false)

onMounted(() => {
      fetchGradeScale()
      fetchCampusLevel()
    }
)

const addAggregateScale = () => {
  editMode.value = false
  gradeScaleDatainfo.value = ""
  showAggregateScaleModal.value = true
}

const openEditModal = (gradeInf) =>{
  gradeScaleDatainfo.value = gradeInf
  editMode.value = true
  showAggregateScaleModal.value = true
}

const fetchGradeScale = () =>{
  let data = {
    school_number:schoolNumber
  }
  assessmentStore.fetchAggregateScale(data)
}


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}



const deleteThisData = async (info) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: " + info.scale_name);
if (agreed) {
  deletionLoader.value = true
  await assessmentStore.deleteAggregateScale(info.scale_number)
}


}


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        campusCurriculumDataInfo.value = data.data
      }
    }
)


watch(
    () => academicYearStore.campusClassByLevelResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)


watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)






// aggregateData
watch(
    () => assessmentStore.aggregateScaleResponse,
    async (data) => {
      if(data){
        aggregateData.value = data.data
      }
    },
    {deep:true}
)



watch (
    () => assessmentStore.newAggregateScaleResponse,
    async (data) => {
      if(data){
        showAggregateScaleModal.value = false
        fetchGradeScale()
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => assessmentStore.updateAggregateScaleResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        fetchGradeScale()
        showAggregateScaleModal.value = false
      }
    }
)



watch (
    () => assessmentStore.deleteAggregateScaleResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
        fetchGradeScale()
        deletionLoader.value = false

      }
    }
)
watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)


</script>
<template>
  <div>
    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
    <AppModal :title="editMode? 'Edit Aggregate Scale': 'Add Aggregate Scale'" v-model="showAggregateScaleModal" xl6>
      <NewGradeScale :gradeScaleDataInfo="gradeScaleDatainfo"></NewGradeScale>
    </AppModal>
    <div>
      <div >
        <div class="">
          <div class="flex flex-grow justify-between" >
            <div>
              <p class="mt-3 ml-4 text-gray-600">Aggregate Scale</p>
            </div>
            <div>
              <button
                  @click="addAggregateScale"
                  v-if="can('add_grade_scale','general')"
                  style="float: right; margin-right: 5px;"
                  type="button"
                  class="btn btn-primary btn-sm m-4">
                <i class="bi bi-plus"></i>
                New Aggregate Scale
              </button>
            </div>
          </div>
          <div >
            <div>

              <table
                  class="table table-hover caption-top mt-4  table-striped"
                  style="font-size: 11px !important;" >

                <tbody>
                <tr v-for="(aggregateList,index) in aggregateData" :key="index">

                  <td>
                    <table
                        class="table table-hover caption-top mt-4 table-sm table-striped"
                        style="font-size: 11px !important;" >
                      <thead>
                      <tr>
                        <th scope="col" class="alert alert-primary">
                          <div class="flex flex-grow justify-between ">
                            <div>
                              <span>{{ index+1 }}.&nbsp;</span>{{ aggregateList.scale_name }}
                            </div>
                            <div>
                              <button @click="openEditModal(aggregateList)">
                                <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                              </button>
                              &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
                              <button type="button" @click="deleteThisData(aggregateList)">
                                <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
                              </button>
                            </div>
                          </div>
                        </th>
                      </tr>
                      <td>
                        <b> Aggregate Scale</b>
                        <table   class="table table-hover caption-top mt-4 table-sm table-striped">
                         <tr>
                           <th scope="col">Value</th>
                           <th scope="col">weight</th>
                           <th scope="col">Name</th>
                           <th>Remark</th>
                         </tr>
                          <tbody>
                          <!-- {{ list?.code }} -->
                          <tr v-for="(list,idx) in aggregateList.aggregate_scales" :key="idx">
                            <td>{{ list?.min_value}} - {{ list?.max_value }}</td>
                            <td>{{ list?.weight }}</td>
                            <td>  {{ list?.name }} ( {{ list?.short_name }} )</td>

                            <td>  {{ list?.description }}</td>
                          </tr>
                          </tbody>
                        </table>


                        <b><br>Grading Category</b>
                        <table   class="table table-hover caption-top mt-4 table-sm table-striped">
                          <tr>
                            <th scope="col">Points</th>
                            <th scope="col">Name</th>
                            <th>Remark</th>
                          </tr>
                          <tbody>
                          <tr v-for="(list, idx) in aggregateList.assessment_grade.assessment_grades" :key="idx">
                            <td>{{ list.minimum_points }} - {{ list.maximum_points }}</td>
                            <td>  {{ list?.name }} ( {{ list?.abbreviation }} )</td>
                            <td>  {{ list?.description }}</td>
                          </tr>
                          </tbody>
                        </table>

                      </td>

                      </thead>
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
  </div>
</template>
<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
}
.card-header {
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
</style>