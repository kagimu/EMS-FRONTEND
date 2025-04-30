<script setup>

import {onMounted, ref, watch,reactive} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useTeacherCommentStore} from "@/main/dashboard/manageLevel/report_setup/comments/store/teacherComment.js";
import useCommonsStore from "@/composables/useCommons.js";
import api from "@/config/api.js";

let imagePath = api.defaults.baseURL + "/attachments/download/"

const notificationStore  = useNotificationStore()
const teacherCommentStore = useTeacherCommentStore()
const commons = useCommonsStore()
const loader = ref(false)
const errorMessage = ref("")


const props = defineProps({
  reportDetails:{},
  reportDataInfo:{}
})


const form = reactive({
comment : null,
report_summary_number:props.reportSummaryNumber
})

const addOverAllRemark = () => {

  loader.value = true

  let commentDraft = props.reportDetails?.learning_areas?.map((item) => {
    return {
      comment: item?.comment,
      // report_summary_number: props.reportDataInfo.report_summary_number
      report_summary_number: item?.name
    }
  })

  alert(JSON.stringify(commentDraft))

/*loader.value = true
let formData = {
comment : form.comment,
report_summary_number : form.report_summary_number
 }
 teacherCommentStore.newCommentFromTeacher(formData)*/
}


watch(
    () => teacherCommentStore.newCommentFromTeacherResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        loader.value=false
      }
    }
)



watch(
    () => teacherCommentStore.errorMessage,
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
<!--    {{reportDetails}}-->
  <form @submit.prevent="addOverAllRemark">

    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>



    <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
      <tr style="text-align: center; border-bottom: 1px solid #f4f4f4;">
        <td v-for="(item,idx) in reportDetails?.learning_areas" :key="idx" style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4; text-transform: uppercase;">{{item?.name}}</td>
        <!--              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">PHYSICAL STUDIES</td>-->
        <!--              <td style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4;">RELIGIOUS STUDIES</td>-->
        <!--              <td style="width: 25%; padding: 5px;">SOCIAL STUDIES</td>-->
      </tr>
      <tr  style="border-bottom: 1px solid #f4f4f4;">
        <td style="padding: 5px; border-right: 1px solid #f4f4f4;  vertical-align: top;" v-for="(item,idx) in reportDetails?.learning_areas" :key="idx">


          <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
            <tr v-for="(lst,index) in  item?.assessments" :key="index" style="border-bottom: 1px solid #f4f4f4;">
              <td style="padding: 5px; border-right: 1px solid #f4f4f4; width: 70%;">{{lst?.name}}</td>
              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">
                <img
                    v-if="lst?.report_score_summary?.illustration"
                    alt="logo"
                    style="width: 40px;"
                    :src="imagePath+lst?.report_score_summary?.illustration"/>
              </td>
            </tr>
          </table>

        </td>
        <!--              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Feeding Pattern</td>-->
        <!--              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Praise and Worship</td>-->
        <!--              <td style="padding: 5px;">Handling Acceptance</td>-->
      </tr>

    </table>

    <table style="width: 100%; border: 1px solid #f4f4f4; font-size: 13px;">
<!--      <tr style="text-align: center; border-bottom: 1px solid #f4f4f4;">
        <td v-for="(item,idx) in reportDetails?.learning_areas" :key="idx" style="width: 25%; padding: 5px; border-right: 1px solid #f4f4f4; text-transform: uppercase;">{{item?.name}}</td>
      </tr>-->
      <tr  style="border-bottom: 1px solid #f4f4f4;">
        <td style="padding: 5px; border-right: 1px solid #f4f4f4;  vertical-align: top;" v-for="(item,idx) in reportDetails?.learning_areas" :key="idx">

          <textarea
              class="form-control mt-2 shadow-none"
              v-model="item.comment"></textarea>


        </td>
        <!--              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Feeding Pattern</td>-->
        <!--              <td style="padding: 5px; border-right: 1px solid #f4f4f4;">Praise and Worship</td>-->
        <!--              <td style="padding: 5px;">Handling Acceptance</td>-->
      </tr>

    </table>









<!--    <div class="mb-2 ">
      <label class="text-sm text-gray-600">Comment</label>
      <textarea
          class="form-control mt-2 shadow-none"
          v-model="form.comment"></textarea>
    </div>-->

    <div class="flex justify-content-end mt-4" style="width: 100%;">
      <button
          type="submit"
          class="btn btn-primary border-0">
        Submit
        <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
      </button>
    </div>

  </form>
  </div>
</template>

<style scoped>

</style>