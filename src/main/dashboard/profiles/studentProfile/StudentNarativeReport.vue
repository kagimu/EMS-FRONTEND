<script setup>

import {onMounted, ref, watch} from "vue";
import {useUserStore} from "@/main/dashboard/profiles/store/users.js";
import {useRouter} from "vue-router";
const routerData = useRouter()

const userStore = useUserStore()
const student_number = routerData.currentRoute.value.query.st_id

const narrativeList = ref([])

onMounted(
    async () => {
      await userStore.fetchNarrativeReport(student_number)
    }
)




watch(
    () => userStore.narrativeReportResponse,
    async (data) => {
      if(data && data.data){
      narrativeList.value = data.data
      }
    }
)


</script>

<template>
<div>

  <div class="flex justify-content-between mt-1">
    <div class="ml-4">Narrative Report</div>

  </div>

  <table class="table table-hover caption-top mt-3 table-sm" style="font-size: 14px;">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Date</th>
      <th scope="col">Teacher</th>
      <th scope="col">Academic Year</th>
      <th scope="col">Study Period</th>
      <th scope="col">Class</th>
      <th scope="col">Narration</th>
      <th scope="col">Assessment Area</th>
<!--      <th scope="col">Action</th>-->
    </tr>
    </thead>
    <tbody>
    <tr v-for="(info, index) in narrativeList" :key="index">
      <td> {{(index + 1)}}</td>
      <td> {{info?.date ?? ""}}</td>
      <td> {{info?.teacher ?? ""}}</td>
      <td> {{info?.academic_year ?? ""}}</td>
      <td> {{info?.study_period ?? ""}}</td>
      <td> {{info?.class ?? ""}}</td>
      <td> {{info?.narration ?? ""}}</td>
      <td> {{info?.assessment_area ?? ""}}</td>
<!--      <td>
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
      </td>-->
    </tr>
    </tbody>
  </table>

</div>
</template>

<style scoped>

</style>