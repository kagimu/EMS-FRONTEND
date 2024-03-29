<script setup>

import {onMounted, watch} from "vue";
import {useReportCardStore} from "@/main/dashboard/report-card/store/report-card.js";
const reportStore = useReportCardStore()
onMounted(
    async () => {
      await reportStore.fetchReportSummary()
    }
)





watch(
    () => reportStore.reportSummaryResponse,
    async (data) => {
      if(data){
        alert(JSON.stringify(data))
      }
    },
    {deep:true}
)


</script>

<template>
<div>


  <div class="row bg-white mx-auto mt-2">

    <div class="col-12">



      <div class="flex justify-content-between mt-3">
        <div class="ml-4">Report Summary</div>
      </div>



      <table class="table table-hover caption-top mt-4 table-sm" style="font-size: 14px;">
        <thead>
        <tr>
          <th scope="col" style="width: 30%;">Code</th>
          <th scope="col">Name</th>
          <th scope="col">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(levelInfo, index) in levelList" :key="index">
          <td> {{levelInfo.code}}</td>
          <td> {{levelInfo.name}}</td>
          <td>
            <div>
              <i
                  v-if="can('edit_level','general')"
                  style="font-size: 13px;"
                  data-bs-toggle="modal" data-bs-target="#levelModal"
                  class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
              <i
                  v-if="can('delete_level','general')"
                  style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
              <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
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
</template>

<style scoped>

</style>