<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAttendanceStore} from "@/main/dashboard/attendance/store/attendance.js";
import { useAbility } from '@casl/vue';

const { can } = useAbility()
const  notificationStore  = useNotificationStore()
const attendanceStore = useAttendanceStore()

const studentAttendanceList = ref([])

onMounted(
    async () => {
    await attendanceStore.fetchStudentAttendance()
    } )

watch(
    () => attendanceStore.attendanceStudentResponse,
    async (data) => {
      if (data) {
        studentAttendanceList.value = data?.data
      }
    },
    {deep: true}
)

watch(
    () => attendanceStore.errorMessage,
    async (data) => {
      if (data) {
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep: true}
)

</script>



<template>
  <div>


    <!-- end  -->
    <div class="row">
<!--      {{studentAttendanceList}}-->
      </div>

  </div>
</template>



<style scoped>

</style>