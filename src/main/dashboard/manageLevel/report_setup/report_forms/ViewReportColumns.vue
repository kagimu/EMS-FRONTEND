<script setup>
import useCommonsStore from "@/composables/useCommons.js";
import { useReportSetupStore } from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import { onMounted, reactive, ref, watch } from "vue";

const commons = useCommonsStore()
const notificationStore = useNotificationStore()
const reportSetupStore = useReportSetupStore()

const errorMessage = ref("")
const loader = ref(false)
const loop = ref(null)
const reportSettingNumber = ref(null)
const reportColumnData = ref([])

const props = defineProps({
    reportSettingNum: String,
})


onMounted(() => {
    if(props.reportSettingNum){
        reportSettingNumber.value = props.reportSettingNum
        // reportSetupStore.fetchReportColumnsByReportSettingId(reportSettingNumber.value)
        reportSetupStore.fetchReportColumn(reportSettingNumber.value)
    }
})

watch(
  () => reportSetupStore.errorMessage,
  async (data) => {
    if (data) {
      notificationStore.errorToast("Error", data.message);
    }
  }
)

watch(
    () => reportSetupStore.reportColumnListResponse,
    async (data) => {
      if(data){
       reportColumnData.value = data.data
      }
    }
)


</script>

<template>
  <div>
    <!-- {{ reportSettingNumber }} -->
      <!-- {{ reportColumnData }} -->

      
    <table class="table table-hover caption-top mt-1 table-sm text-sm">
        <thead>
            <tr>
                <th>Code</th>
                <th>Column Name</th>
                <th>Percentage Share</th>
                <th>Assessment</th>
                <th>#</th>
            </tr>
        </thead>
        <tbody>
           <tr class="w-[10%]" scope="col" v-for="(list,index) in reportColumnData" :key="index">
            <td>{{ list.code }}</td>
            <td>{{ list.name }}</td>
            <td>{{ list.percentage_share }}</td>
            <td>
                <!-- {{ list.assessments }} -->
              
            <span v-for="(listD, index) in list.assessments" :key="index">
            {{listD.assessment_area}},
            </span>

         
            </td>
            <td>
                <button><i class="bi bi-x" style="color: red;"></i></button>
            </td>
           </tr>
        </tbody>

    </table>
 
  </div>
</template>

<style scoped>
</style>
