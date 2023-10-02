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
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Add Streams on </h6>
                        <button style="margin-right: 5px;" type="button" class="btn-close btn-sm"
                                data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">
                            <input type="text" placeholder="East,West,North" v-model="streamForm.name">
                        </div>

                        <div>
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
                <th scope="col">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(classes, index) in classList" :key="index">
                <td>{{ index + 1 }}</td>
                <td> {{ classes.name }}</td>
                <td> {{ classes.abbreviation }}</td>
                <td><label v-for="(idx,stream) in classes.streams" :key="idx">{{ stream.name }}</label></td>
                <td>
                    <div>
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
}

const saveStream = () => {
classStore.addStream(streamForm)
}
const deleteClass = (data) => {
    alert(JSON.stringify(data))
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