<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";
import {useRouter} from "vue-router";
import NewCampusClass from "@/main/dashboard/manageLevel/class/NewCampusClass.vue";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
const confirmationRef = ref(null);

import { useAbility } from '@casl/vue';
import { errorMessages } from "vue/compiler-sfc";
const { can } = useAbility()


const routerData = useRouter()
const levelStore = useLevelStore()
const stream_number = ref(null)


const classStore = useClassesStore()
const notificationStore = useNotificationStore()

const classDialog = ref(false)
const streamDialog = ref(false)
const classList = ref([])
const streamClass = ref(null)
const campusNumber = routerData.currentRoute.value.query.id
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const buttonLoader = ref(false)

const streamForm = reactive({
  name: "",
  class_level_number: null,
  campus_class_number:null
})
const addCampus = () => {
  classDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))

}

const addStream = (data) => {
//  alert(JSON.stringify(data))

 streamClass.value = data.name
  streamDialog.value = true
  streamForm.class_level_number = data.number
  streamForm.campus_class_number = data.number
  streamForm.name = ""
  stream_number.value = ""
}

const editStream = (lst,cls,classN) => {
  streamClass.value = cls
  streamDialog.value = true
  stream_number.value = lst.stream_number
  streamForm.name = lst.name
  streamForm.campus_class_number = classN
}

const saveStream = () => {
  buttonLoader.value = true
  if(stream_number.value){
    streamForm.stream_number = stream_number.value
    classStore.updateStream(streamForm)
  }else{
  classStore.addStream(streamForm)
  }
}




const deleteStream = async (lst) => {

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+lst.name);
if (agreed) {
  
  // alert(JSON.stringify(lst))
}


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
        buttonLoader.value = false
        streamForm.name = ""
        filterClassInfo()
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep: true}
)



watch(
    () => classStore.updateStreamSuccess,
    async (data) => {
      if (data) {
        buttonLoader.value = true
        streamForm.name = ""
        notificationStore.successToast("Success", data.message)
        filterClassInfo()
      }
    },
    {deep: true}
)

watch (
    () => classStore.errorMessage,
    async (data) => {
      if(data){
        // filterClassInfo()
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

</script>
<template>
    <div>
      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
      <AppModal title="Add Class" v-model="classDialog" lg>
        <new-campus-class :classListInfo="classList"></new-campus-class>
      </AppModal>


      <AppModal :title="'Add Streams on '+streamClass" v-model="streamDialog" lg>
        <div>
          <div class="mt-2 mb-2">

            <div class="mb-6">
              <label class="text-sm"><small>Stream</small></label>
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
                @click="saveStream">
                <span v-if="stream_number != ''">Update Stream</span>
                <span v-else>Save Stream(s)</span>
              <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>

          </div>
        </div>
      </AppModal>






        <div class="flex justify-content-between mt-4 mb-4 mr-3">
            &nbsp;
            <button v-if="can('create_class','manage')" type="button" class="btn btn-sm buttonStyle btn-primary mr-2" @click="addCampus"
                    data-bs-toggle="modal" data-bs-target="#campusClassModal">
                <i style="font-size: 15px;" class="bi-plus mr-2"></i>
                Add Class
            </button>
        </div>


        <table class="table table-hover caption-top text-sm" v-if="can('view_class','manage')">
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
                          <i class="bi bi-x-circle cursor-pointer" style="font-size: 13px;color:red" @click="deleteStream(lst)"></i>
                          <i class="bi bi-pencil cursor-pointer ml-2" style="font-size: 11px;color:#0d6efd" @click="editStream(lst,list.name,list.number)"></i>
                        </small>
                      </div>
                      </td>
                      <td>
                        <button
                        v-if="can('create_stream','manage')"
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