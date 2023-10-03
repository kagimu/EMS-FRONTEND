<template>
    <div>
        <div class="modal fade" id="learningAreaModal" tabindex="-1" :class="{ show: classDialog }" aria-labelledby=""
             aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Add Class</h6>
                        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">
                            <new-class :classListInfo="classList"></new-class>
                        </div>
                    </div>
                </div>
            </div>
        </div>


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
                    data-bs-toggle="modal" data-bs-target="#learningAreaModal">
                <i style="font-size: 15px;" class="bi-plus mr-2"></i>
                Add Class
            </button>
        </div>


        <table class="table table-hover caption-top" style="font-size: 14px;">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Abbreviation</th>
                <th scope="col">Streams</th>
                <th scope="col" class="text-right">
                  <div style="margin-right: 60px;">Action</div>
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(classes, index) in classList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ classes.name }}</td>
                <td>{{ classes.abbreviation }}</td>
                <td>
                  <div v-for="(lst,idx) in classes.streams" :key="idx">
                    <small>
                      {{lst.name}}
                      <i class="bi bi-x-circle cursor-pointer" style="font-size: 13px;" @click="deleteStream(lst)"></i>
                    </small>
                  </div>
                </td>
                <td class="text-right">
                    <div style="margin-right: 10px;">
                        <button
                                type="button"
                                class="btn btn-sm buttonStyle btn-primary mr-2"
                                data-bs-toggle="modal"
                                data-bs-target="#streamModal"

                                style="font-size: 13px;"
                                @click="addStream(classes)">Add Stream
                        </button>
                        <i style="font-size: 13px;" class="bi-trash cursor-pointer" @click="deleteClass(classes)"></i>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>


    </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import NewClass from "@/main/dashboard/manageLevel/class/NewClass.vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes";
import {useRouter} from "vue-router";

const routerData = useRouter()


const classStore = useClassesStore()
const notificationStore = useNotificationStore()

const classDialog = ref(false)
const streamDialog = ref(false)
const classList = ref([])
const streamClass = ref(null)
// const campusNumber = routerData.currentRoute.value.query.id
const campusNumber = localStorage.getItem('campus_number');
const levelNumber = routerData.currentRoute.value.query.l

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
const deleteClass = (data) => {
    alert(JSON.stringify(data))
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
    classStore.fetchClassLevel({campusNumber: campusNumber, levelNumber: levelNumber})
}

watch(
    () => classStore.classLevelResponse,
    async (data) => {
        if (data) {
            // classDialog.value = false
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

<style scoped>

.linkStyle {
    text-decoration: none;
    color: #1867c0;
    font-size: 16px;
}

.linkStyle:hover {
    font-size: 16px;
    color: green;
    text-decoration: underline;
}

.viewButtonStyle {
    background-color: #2c6fb9;
    color: #ffffff;
    border-radius: 0;
}

.viewButtonStyle:hover {
    background-color: #0557b4;
    color: #ffffff;
}

</style>