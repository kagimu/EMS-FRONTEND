<script setup>
import {onMounted,ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import AppModal from "@/components/AppModal.vue";
import NewAssessmentMetric from "@/main/dashboard/assessment/assessmentComponents/NewAssessmentMetric.vue"
import { useAbility } from '@casl/vue';
import {useRouter} from "vue-router";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import PaginationTemplate from "@/components/PaginationTemplate.vue";

const { can } = useAbility()

const routerData = useRouter()

const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()
const studyPeriodStore = useStudyPeriodStore()

let  curriculumNumberParent = routerData.currentRoute.value.query.cr
const campus_curriculum_number = routerData.currentRoute.value.query.crr

const showingModal = ref(false)
const campus_level_number = ref("")

const page = ref(1)
const campus_class_number = ref("")
const academic_year_number = ref("")
const study_period_number = ref("")
const metric_number = ref("")
const assessment_area_number = ref("")

const metricListData = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const campusLevelList = ref([])
const classLevelList = ref([])
const AsessmentListData = ref([])
const namee = ref(null)
const assessmentMetricList = ref([])
const editModel = ref(false)
const per_page = ref(20)
  const total_items = ref(0)
  const total_rows = ref(0)
 const tableLoader = ref(true)



const showModal = () => {
  editModel.value = false
  assessmentMetricList.value = ""
  showingModal.value = true
 
}

const buttonLoader = ref(false)
const assessmentMetricsData = ref([])
ref(false);
let errorMessage = ref(null)

const assessmentStore= useAssessmentStore()
const  notificationStore  = useNotificationStore()

onMounted(
    async () => {
      await classStore.fetchCampusLevel(campus_curriculum_number)
      await assessmentStore.fetchMetrics(curriculumNumberParent)

    } )


const doFetchAssessmentMetric = async () => {
  assessmentMetricsData.value.splice(0)
  let data = {
    page: 1,
    per_page: per_page.value,
    campus_class_number:campus_class_number.value,
    academic_year_number:academic_year_number.value,
    study_period_number:study_period_number.value,
    metric_number:metric_number.value,
    assessment_area_number:assessment_area_number.value,
    paginated:"yes"
  }

  await assessmentStore.fetchAssessmentMetrics(data)
}


function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    tableLoader.value = true
    let data = {
    page: (page.value+1),
    per_page: per_page.value,
    campus_class_number:campus_class_number.value,
    academic_year_number:academic_year_number.value,
    study_period_number:study_period_number.value,
    metric_number:metric_number.value,
    assessment_area_number:assessment_area_number.value,
    paginated:"yes"
  }

  assessmentStore.fetchAssessmentMetrics(data)

  }
}



const fetchCurriculumClass = () =>{
  classStore.fetchClassByLevel(campus_curriculum_number,campus_level_number.value)
  academicYearStore.fetchAcademicYearByLevel(campus_level_number.value)
}

const  fetchAssessmentAreaList = () => {
  if(campus_class_number.value) {
    let curriculum_class_number = classLevelList.value.find(item => item.number === campus_class_number.value).curriculum_class_number
    assessmentStore.fetchAssessmentArea(curriculum_class_number)
    doFetchAssessmentMetric()
  }
}

const fetchStudyPeriod = () =>{
  studyPeriodStore.fetchStudyPeriodByAcademicYear(academic_year_number.value)
  doFetchAssessmentMetric()
}


watch(
    () => studyPeriodStore.studyPeriodByAcademicYearResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)

watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    }
)

watch(
    () => assessmentStore.assessmentAreaResponse,
    async (data) => {
      if(data){
        AsessmentListData.value = data.data
      }
    }
)

watch(
    () => assessmentStore.assessmentMetricsResponse,
    async (data) => {
      if(data){
        filterAssessmentMetric(data)
        // assessmentMetricsData.value = data.data
      }
    }
)




const filterAssessmentMetric = (data) => {
  if(data) {
    let current_page = data.page
      page.value = current_page
      tableLoader.value = false

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content

      let count_items = (current_page * per_page_item)
      let totalItems = data?.total_rows


      if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
      objArray.forEach((list, i) => {

        list.key =  (current_page - 1) * per_page_item + i + 1

        const index = assessmentMetricsData.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          assessmentMetricsData.value.push(list);
        }

      })
    }


  }
}

watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)

watch(
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)

watch(
    () => classStore.classLevelByLevelResponse,
    async (data) => {
      if (data) {
        if(data && data.data){
          let classData = data.data
          if(classData && (classData.length > 0)){
            classLevelList.value = classData[0].classes
          }
        }
      }
    }
)


watch(
    () => assessmentStore.metricResponse,
    async (data) => {
      if(data){
        metricListData.value = data.data
      }
    }
)

const editThisData = (List) => {
  editModel.value = true
  assessmentMetricList.value = List
  namee.value = List.name
  showingModal.value = true
}

const deleteThisData = (id,name) => {
  if(!confirm("Are you sure, you want to delete: " + name)){
    return
  }else{
    // let data = {
    //  assessment_metric_number:id
    // }

     
  }

}

</script>
<template>
  <div>

    <AppModal  :title="editModel ? 'Edit ' + namee:'Add Assessment Schedule'" v-model="showingModal" xl2>
      <NewAssessmentMetric :assessmentMetricList="assessmentMetricList"></NewAssessmentMetric>
    </AppModal>

    <div class="col-12 mt-2" >

      <div class="">

          <div class="flex justify-between mb-4">
            &nbsp;
              <button
                  v-if="can('add_assessment_area','general')"
                  class="btn btn-primary btn-sm float-end mb-0 mr-4" style="float: right" type="button"  @click="showModal">
                <b><i class="bi bi-plus"></i></b> <small>
                Add Assessment Schedule</small></button>
          </div>


        <div class="row mx-auto">
          <div class="col-lg-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="campus_level_number"
                  @change="fetchCurriculumClass()"
              >
                <option disabled value="">--Filter by Level--</option>
                <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>
          </div>

          <div class="col-lg-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="campus_class_number"
                  @change="fetchAssessmentAreaList()"
              >
                <option disabled value="">--Filter by Class--</option>
                <option v-for="(clist, index) in classLevelList" :key="index" :value="clist.number">{{clist.name}}</option>
              </select>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="academic_year_number"
                  @change="fetchStudyPeriod()" >
                <option disabled value="">--Filter by Academic Year--</option>
                <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                  {{list.code+". "+list.academic_year_name}}
                </option>
              </select>
            </div>
          </div>
          <div class="col-lg-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="study_period_number"
                  @change="doFetchAssessmentMetric()"
              >
                <option disabled value="">--Filter by Study Period--</option>
                <option v-for="(list, index) in studyPeriodList" :key="index" :value="list.number">{{ list.study_period_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-lg-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="metric_number"
                  @change="doFetchAssessmentMetric()"
              >
                <option disabled value="">--Filter by metric--</option>
                <option v-for="(list, index) in metricListData" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-lg-3">
            <div class="mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="assessment_area_number"
                  @change="doFetchAssessmentMetric()"
              >
                <option disabled value="">--Filter by assessment area--</option>
                <option v-for="(list, index) in AsessmentListData" :key="index" :value="list.number">{{ list.name }}
                </option>
              </select>
            </div>
          </div>

        </div>



        <div class="card-body" >
          <div >

            <PaginationTemplate
                    @perPageChanged="doFetchAssessmentMetric"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>

              <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">

            <table
                id="datatable"
                class="table table-striped"
                style="font-size: 13px !important;"
            >
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Decription</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(metricsData, index) in assessmentMetricsData " :key="index">
                <td>
                  <!-- {{metricsData?.code ?? ""}} -->
                  {{ index+1 }}
                </td>
                <td>
                  {{ metricsData.name + " - " + metricsData.CampusClass.class_name}}
                </td>
                <td>{{ metricsData.description }}</td>
                <td>
                  <button  @click="editThisData(metricsData)" type="button">
                    <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
                  </button>
                  &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
                  <button type="button" @click="deleteThisData(metricsData.number,metricsData.name)">
                    <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
                  </button></td>
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
.textColor{
  font-size: 11px;
}

</style>