<script setup>
import TeacherComment from "@/main/dashboard/manageLevel/report_setup/comments/TeacherComment.vue";
import ClassTeacherComments from "@/main/dashboard/comments/commentsComponents/ClassTeacherComments.vue";
import SubjectTeacherComments from "@/main/dashboard/comments/commentsComponents/SubjectTeacherComments.vue";

import {useRouter} from "vue-router";
import router from "@/config/router.js";
import {ref} from "vue";


const routerData = useRouter()
const campusNumber = routerData.currentRoute.value.query.id
const schoolNumber = routerData.currentRoute.value.query.sch
let campusCurriculumNumber = routerData.currentRoute.value.query.crr
let curriculumNumberParent = routerData.currentRoute.value.query.cr



const selectedPage = routerData.currentRoute.value.query.type
const selectedTab = routerData.currentRoute.value.query.tab ?? 'teachers-comments'

const switchTabs = (tab) => {
  router.push({name: "campus-curriculum-setup", query: {id:campusNumber,sch:schoolNumber, crr:campusCurriculumNumber, cr:curriculumNumberParent,type:selectedPage,tab:tab}});
}


const reportSettingsMenu = ref([
  {
    name:"HeadTeacher Comments",
    router_name:"teachers-comments"
  },
])


</script>

<template>
  <div>


    <div class="flex border-b mt-1">

      <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'teachers-comments' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('teachers-comments')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          HeadTeacher Comments
        </div>
      </div>

      <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'class-teachers-comments' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('class-teachers-comments')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          ClassTeacher Comments
        </div>
      </div>

      <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'subject-teachers-comments' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('subject-teachers-comments')">
        <div class="py-1 px-3">
          <i class="bi bi-box-arrow-in-right mr-1"></i>
          SubjectTeacher Comments
        </div>
      </div>



    </div>

    <teacher-comment v-if="selectedTab === 'teachers-comments'"></teacher-comment>
    <subject-teacher-comments v-if="selectedTab === 'subject-teachers-comments'"></subject-teacher-comments>
    <class-teacher-comments v-if="selectedTab === 'class-teachers-comments'"></class-teacher-comments>

  </div>
</template>

<style scoped>

</style>