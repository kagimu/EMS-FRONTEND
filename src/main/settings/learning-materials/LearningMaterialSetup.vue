<template>
    <div>


        <div id="levelModal" :class="{ show: levelDialog }" aria-hidden="true" aria-labelledby="" class="modal fade"
             tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Add Learning Material/Resource </h6>
                        <button aria-label="Close" class="btn-close btn-sm" data-bs-dismiss="modal"
                                style="margin-right: 5px;" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">
                            <new-resource></new-resource>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="row">

            <div class="col-12">


                <!--        <div class="card mt-3">-->
                <!--          <div class="card-body" style="padding: 0;">-->


                <div class="flex justify-content-between mt-3">
                    <div class="ml-4">Learning Materials</div>
                    <button class="btn btn-sm buttonStyle btn-primary mr-2" data-bs-target="#levelModal"
                            data-bs-toggle="modal"
                            type="button" @click="addLevel">
                        <i class="bi-plus mr-2" style="font-size: 15px;"></i>
                        Add resource
                    </button>
                </div>


                <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
                    <thead>
                    <tr>
                        <th scope="col" style="width: 30%;">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(levelInfo, index) in resourcesList" :key="index">
                        <td> {{ levelInfo.code }}</td>
                        <td> {{ levelInfo.name }}</td>
                        <td>
                            <div>
                                <i
                                        aria-controls="offcanvasRight"
                                        class="bi-pencil mr-2 cursor-pointer" data-bs-target="#editClass"
                                        data-bs-toggle="offcanvas"
                                        style="font-size: 13px;" @click="editClass(levelInfo)"></i>
                                <i class="bi-trash cursor-pointer" style="font-size: 13px;"
                                   @click="deleteClass(levelInfo)"></i>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </div>

        <!--      </div>-->
        <!--    </div>-->


    </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import {useLearningMaterialStore} from "@/main/settings/learning-materials/resources_store.js";
import NewResource from "@/main/settings/learning-materials/NewResource.vue";

const routerData = useRouter()


const resourcesStore = useLearningMaterialStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()

const level = ref("")
const levelDialog = ref(false)
const resourcesList = ref([])


const addLevel = () => {
    levelDialog.value = true
}

const editClass = (data) => {
    alert(JSON.stringify(data))
}
const deleteClass = (data) => {
    alert(JSON.stringify(data))
}


onMounted(
    async () => {
        await resourcesStore.fetchLearningMaterials()
    }
)

watch(
    () => resourcesStore.addMaterialResponse,
    async (data) => {
        if (data) {
            await resourcesStore.fetchLearningMaterials()
            notificationStore.successToast("Success", data.message)
        }
    },
    {deep: true}
)

watch(
    () => resourcesStore.learningMaterialsResponse,
    async (data) => {
        if (data) {
            resourcesList.value = data.data
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