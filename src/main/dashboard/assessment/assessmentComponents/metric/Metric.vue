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


const metricData = ref([])
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
      <div class="card shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0">
          <div class="row align-items-center">
            <!-- Search Input -->
            <div class="col-md-6 mb-2 mb-md-0">
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control form-control-sm"-->
<!--                  placeholder="Search..."-->
<!--                  v-model="searchQuery"-->
<!--                  @input="filterMetrics"-->
<!--              >-->
            </div>

            <!-- Add Metric Button -->
            <div class="col-md-6 text-md-end text-start">
              <button
                  v-if="can('add_assessment_area', 'general')"
                  type="button"
                  class="btn btn-sm btn-primary"
                  @click="sDialog"
              >
                <i class="bi bi-plus"></i> Add Metric
              </button>
            </div>
          </div>
        </div>

        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-sm table-striped mb-0 align-middle" style="font-size: 13px;">
              <thead class="table-light">
              <tr>
                <th scope="col" style="width: 5%;">#</th>
                <th scope="col">Name</th>
                <th scope="col" style="width: 15%;">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(metric, index) in metricData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ metric.name }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <button
                        class="btn btn-sm p-0 text-primary"
                        @click="editMetric(metric)"
                        title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button
                        class="btn btn-sm p-0 text-danger"
                        @click="deleteMetric(metric)"
                        title="Delete"
                    >
                      <i class="bi bi-trash"></i>
                    </button>

                    <div
                        class="spinner-border spinner-border-sm text-secondary ms-2"
                        role="status"
                        v-if="deletionLoader === metric.number"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>


              <tr v-if="metricData.length === 0">
                <td colspan="3" class="text-center text-muted">No metrics found.</td>
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
.text-sm2{
  font-size: 11px;
}

</style>