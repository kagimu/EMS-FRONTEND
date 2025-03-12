<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useAttendanceStore} from "@/main/dashboard/attendance/store/attendance.js";
import { useAbility } from '@casl/vue';
import PaginationTemplate from "@/components/PaginationTemplate.vue";
const { can } = useAbility()
const  notificationStore  = useNotificationStore()
const attendanceStore = useAttendanceStore()

const page = ref(1)
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)

const studentAttendanceList = ref([])

onMounted(
     () => {
       doFetchAttendance()
    } )



const doFetchAttendance = () =>{
  let data = {
    page: 1,
    per_page: per_page.value,
  }
  // loading.value = true;
  // studentAttendanceList.value = []
  attendanceStore.fetchStudentAttendance(data)
}

const fetchAttendanceList = (data) => {
  if(data) {
    let current_page = data.page
    page.value = current_page
    // loading.value = false;

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

        const index = studentAttendanceList.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          studentAttendanceList.value.push(list);
        }
      })
    }

  }
}


function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
    }
    attendanceStore.fetchStudentAttendance(data)
  }
}


watch(
    () => attendanceStore.attendanceStudentResponse,
    async (data) => {
      if (data) {
        // studentAttendanceList.value = data?.data
        fetchAttendanceList(data?.data)
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

      <PaginationTemplate
          @perPageChanged="doFetchAttendance"
          v-model:perPage="per_page"
          :per_page="per_page"
          :total_items="total_items"
          :total_rows="total_rows"></PaginationTemplate>
      <div
          class="w-full overflow-auto max-h-[520px] scrollbar-thin"
          @scroll="onScroll">
        <table
            id="datatable"
            class="table table-hover caption-top mt-4 table-sm table-striped"
            style="font-size: 14px !important;"
        >
          <thead >
          <tr>
        
            <th>check In Time</th>
            <th>check Out Time</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(lst , index) in studentAttendanceList" :key="index">
             <td>11:11PM</td>
            <td>12:00 PM</td>
            <td>None</td>
            <td>
                <i class="bi bi-x" style="color: red;"></i>
            </td>

          </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>



<style scoped>

</style>