<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";
import {useRouter} from "vue-router";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import NewCampusLevel from "@/main/dashboard/manageLevel/class/NewCampusLevel.vue";
import AppModal from "@/components/AppModal.vue";

const routerData = useRouter()
const levelStore = useLevelStore()


const classStore = useClassesStore()
const notificationStore = useNotificationStore()

const campusLevelDialog = ref(false)
const streamDialog = ref(false)
const levelList = ref([])
const streamClass = ref(null)

const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr

const streamForm = reactive({
  name: "",
  class_level_number: null
})
const addCampus = () => {
  campusLevelDialog.value = true
}



const addStream = (data) => {
  streamDialog.value = true
  streamForm.class_level_number = data.number
  streamClass.value = data.name
}



onMounted(
    () => {
      fetchCampusLevel()
    }
)


const fetchCampusLevel = () => {
  classStore.fetchCampusLevel(campus_curriculum_number)
}


watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
      }
    }
)

watch(
    () => classStore.newCampusLevelResponse,
    async (data) => {
      if(data){
        fetchCampusLevel()
      }
    }
)


</script>

<template>
    <div>

      <AppModal title="Add Level to Campus" v-model="campusLevelDialog" lg>
        <new-campus-level :levelList="levelList"></new-campus-level>
      </AppModal>

<!--        <div class="modal fade" id="campusLevelModel" tabindex="-1" :class="{ show: campusLevelDialog }" aria-labelledby=""
             aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Add Level to Campus</h6>
                        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">
                          <new-campus-level :levelList="levelList"></new-campus-level>
                        </div>
                    </div>
                </div>
            </div>
        </div>-->


        <div class="flex justify-content-between mt-4 mb-4 mr-3">
            &nbsp;
            <button type="button" class="btn btn-sm buttonStyle btn-primary mr-2" @click="addCampus"
                    data-bs-toggle="modal" data-bs-target="#campusLevelModel">
                <i style="font-size: 15px;" class="bi-plus mr-2"></i>
                Add Level
            </button>
        </div>


        <table class="table table-hover caption-top" style="font-size: 14px;">
            <thead>
            <tr>
                <th>Code</th>
                <th>Name</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(classes, index) in levelList" :key="index">
                <td>{{ classes.code }}</td>
                <td>{{ classes.name }}</td>
            </tr>
            </tbody>
        </table>


    </div>
</template>



<style scoped>



</style>