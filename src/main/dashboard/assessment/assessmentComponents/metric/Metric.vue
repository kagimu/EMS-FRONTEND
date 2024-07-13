<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
import { useAbility } from '@casl/vue';
import {useRouter} from "vue-router";
import AppModal from "@/components/AppModal.vue";
import NewMetric from "@/main/dashboard/assessment/assessmentComponents/metric/NewMetric.vue";

const routerData = useRouter()
let  curriculumNumber = routerData.currentRoute.value.query.id


const { can } = useAbility()


const metricData = ref(null)
const metricDialog = ref(false)
const metricInfo = ref(null)
const deletionLoader = ref(null)


const assessmentStore= useAssessmentStore()
const  notificationStore  = useNotificationStore()



onMounted(
    async () => {
      await assessmentStore.fetchMetrics(curriculumNumber)
    } )


const editMetric = (metric) => {
  metricDialog.value = true
  metricInfo.value = metric
}
const deleteMetric = (metric) => {
  if(!confirm("Are you sure, you want to delete this metric")){
    return
  }
  deletionLoader.value = metric.number
  assessmentStore.deleteMetric(metric.number)

}


watch(
    () => assessmentStore.metricResponse,
    async (data) => {
      if(data){
        metricData.value = data.data
      }
    },
    {deep:true}
)


const sDialog = () => {
  metricInfo.value = null
  metricDialog.value = true;
}



watch (
    () => assessmentStore.deleteMetricResponse,
    async (data) => {
      if(data){
        deletionLoader.value = null
        await assessmentStore.fetchMetrics(curriculumNumber)
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => assessmentStore.newMetricResponse,
    async (data) => {
      if(data){
        metricDialog.value = false;
        await assessmentStore.fetchMetrics(curriculumNumber)
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => assessmentStore.updateMetricResponse,
    async (data) => {
      if(data){
        metricDialog.value = false;
        await assessmentStore.fetchMetrics(curriculumNumber)
        notificationStore.successToast("Success", data.message)
      }
    }
)


watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        deletionLoader.value = null
        notificationStore.errorToast("Error",data.message)
      }
    }
)





</script>
<template>
  <div>



    <AppModal :title="metricInfo? 'Edit Metrics' : 'Add Metrics'"  v-model="metricDialog" lg>
      <new-metric :metricInfo="metricInfo"></new-metric>
    </AppModal>

    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-lg-6 ">
              <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">
            </div>
            <div class="col-lg-6">
              <button
                  v-if="can('add_assessment_area','general')"
                  style="float: right" type="button" class="btn btn-primary btn-sm float-end mb-2 mr-4"
                  @click="sDialog">
                <b><i class="bi bi-plus"></i></b> <small>
                Add Metric</small></button>
            </div>
          </div>
        </div>
        <div class="card-body" >
          <div >

            <table
                id="datatable"
                class="table table-striped"
                style="font-size: 13px !important;"
            >
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(metric, index) in metricData " :key="index">
                <td>{{(index + 1)}}</td>
                <td>{{ metric.name}}</td>
                <td>


                  <div>
                    <i
                        style="font-size: 13px;"
                        class="bi-pencil mr-2 cursor-pointer" @click="editMetric(metric)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteMetric(metric)"></i>
                    <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === metric.number">
                      <span class="visually-hidden">Loading...</span>
                    </div>
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





<style scoped>
.textColor{
  font-size: 11px;
}

</style>