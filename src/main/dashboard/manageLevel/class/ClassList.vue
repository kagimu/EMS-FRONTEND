<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";
import {useRouter} from "vue-router";
import NewCampusClass from "@/main/dashboard/manageLevel/class/NewCampusClass.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import AppModal from "@/components/AppModal.vue";

const routerData = useRouter()
const levelStore = useLevelStore()


const classStore = useClassesStore()
const notificationStore = useNotificationStore()

const classDialog = ref(false)
const streamDialog = ref(false)
const classList = ref([])
const streamClass = ref(null)
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr

const streamForm = reactive({
  name: "",
  class_level_number: null
})
const addCampus = () => {
  classDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))

}

const addStream = (data) => {
  streamDialog.value = true
  streamForm.class_level_number = data.number
  streamClass.value = data.name
}

const saveStream = () => {
  classStore.addStream(streamForm)
}

const deleteStream = (lst) => {
  if(!confirm("Are you sure, you want to delete: "+lst.name)){
    return
  }

  alert(JSON.stringify(lst))
}

onMounted(
    () => {
      filterClassInfo()
    }
)

const filterClassInfo = () => {
  fetchClasses(campus_curriculum_number)
}


const fetchClasses = (campusCurriculumNumber, campusLevelNumber) => {
  classStore.fetchClassLevel({campusCurriculumNumber: campusCurriculumNumber, campusLevelNumber:(campusLevelNumber?campusLevelNumber:'')})
}


watch(
    () => classStore.classLevelResponse,
    async (data) => {
      if (data) {
        filterClassInfo()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep: true}
)

watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if (data) {
        classList.value = data.data
      }
    },
    {deep: true}
)

watch(
    () => classStore.newStreamSuccess,
    async (data) => {
      if (data) {
        streamForm.name = ""
        filterClassInfo()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep: true}
)



</script>
<template>
    <div>

      <AppModal title="Add Class" v-model="classDialog" lg>
        <new-campus-class :classListInfo="classList"></new-campus-class>
      </AppModal>




        <div class="modal fade" id="streamModal" tabindex="-1" :class="{ show: streamDialog }" aria-labelledby=""
             aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Add Streams on {{streamClass}}</h6>
                        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">

                          <div class="mb-6">
                            <label class="textColor"><small>Stream</small></label>
                            <input
                                placeholder="East,West,North"
                                ref="nameRef"
                                type="text"
                                style="outline: none 0 !important; box-shadow: none;"
                                v-model="streamForm.name"
                                required
                                class="form-control">
                          </div>


                        </div>

                        <div class="flex justify-content-between mb-3">
                          &nbsp;
                            <button
                                    type="button"
                                    class="btn btn-sm buttonStyle btn-primary mr-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#streamModal"

                                    style="font-size: 13px;"
                                    @click="saveStream">Save Stream(s)
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex justify-content-between mt-4 mb-4 mr-3">
            &nbsp;
            <button type="button" class="btn btn-sm buttonStyle btn-primary mr-2" @click="addCampus"
                    data-bs-toggle="modal" data-bs-target="#campusClassModal">
                <i style="font-size: 15px;" class="bi-plus mr-2"></i>
                Add Class
            </button>
        </div>


        <table class="table table-hover caption-top text-sm">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Level</th>
                <th scope="col">Classes</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(classes, index) in classList" :key="index">
                <td>{{ index + 1 }}</td>
                <td class="capitalize">{{ classes.name }}</td>
                <td>
                  <table class="table table-hover caption-top text-sm">
                    <tbody>
                    <tr v-for="(list,idx) in classes.classes" :key="idx">
                      <td>{{list.code}}</td>
                      <td class="capitalize">{{list.name}}</td>
                      <td>[{{list.abbreviation}}]</td>
                      <td>
                        <div v-for="(lst,idx) in list.streams" :key="idx">
                        <small class="capitalize">
                          {{lst.name}}
                          <i class="bi bi-x-circle cursor-pointer" style="font-size: 13px;" @click="deleteStream(lst)"></i>
                        </small>
                      </div>
                      </td>
                      <td>
                        <button
                            type="button"
                            class="bg-[#0d6efd] text-white rounded-md px-2 py-[2px;] text-xs hover:bg-blue-500"
                            data-bs-toggle="modal"
                            data-bs-target="#streamModal"
                            @click="addStream(list)">Add Stream
                        </button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
            </tr>
            </tbody>
        </table>


    </div>
</template>



<style scoped>


</style>