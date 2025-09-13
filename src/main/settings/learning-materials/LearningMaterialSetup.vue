<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import {useLearningMaterialStore} from "@/main/settings/learning-materials/resources_store.js";
import NewResource from "@/main/settings/learning-materials/NewResource.vue";
import NewLearningMaterialSubType from "@/main/settings/learning-materials/NewLearningMaterialSubType.vue";

const routerData = useRouter()
const resourceStore = useLearningMaterialStore()

import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";

const { can } = useAbility()

const resourcesStore = useLearningMaterialStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()
const confirmationRef = ref(null);
const deletionLoader = ref( undefined)

const level = ref("")
const newMaterialDialog = ref(false)
const newSubTypeDialog = ref(false)
const resourcesList = ref([])
const learningMaterialInfo = ref(null)
const editLearning = ref(false)


const addMaterial = () => {
  editLearning.value = false
  newMaterialDialog.value = true
}

const addSubType = () => {
  newSubTypeDialog.value = true
}

const editClass = (data) => {
  if(data){
    editLearning.value = true
    learningMaterialInfo.value = data
    newMaterialDialog.value = true
  }

}


const deleteClass = async (data, index) => {
  deletionLoader.value = index
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+data.name);
  if (agreed) {
    let info = {
      number:data.number
    }
    await resourceStore.deleteClassInfo(info)
  }
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

watch(
    () => resourcesStore.deleteClassInfoResponse,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
        await resourcesStore.fetchLearningMaterials()
      }
    }
)

watch(
    () => resourcesStore.errorMessage,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
      }
    }
)


</script>

<template>
    <div>

      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

      <AppModal :title="editLearning ? 'Edit Learning Material/Resource' : 'Add Learning Material/Resource'" v-model="newMaterialDialog" lg>
          <new-resource :learningMaterialInfo="learningMaterialInfo"></new-resource>
      </AppModal>


        <div id="subTypeModal" :class="{ show: newSubTypeDialog }" aria-hidden="true" aria-labelledby="" class="modal fade"
             tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header text-sm p-0">
                        <h6 class="modal-title ml-3 mt-2 mb-2">Add  Material Sub Type </h6>
                        <button aria-label="Close" class="btn-close btn-sm" data-bs-dismiss="modal"
                                style="margin-right: 5px;" type="button"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mt-2 mb-2">
                            <new-learning-material-sub-type></new-learning-material-sub-type>
                        </div>
                    </div>
                </div>
            </div>
        </div>


      <div class="flex justify-between">
        <div>Learning Materials</div>
        <div class="flex justify-end">
          <div>
            <button
                v-if="can('add_resource','general')"
                class="btn btn-sm buttonStyle btn-primary mr-2" data-bs-target="#levelModal"
                data-bs-toggle="modal"
                type="button" @click="addMaterial">
              <i class="bi-plus mr-2" style="font-size: 15px;"></i>
              Add resource
            </button>
          </div>
          <div>
            <button
                v-if="can('add_material_sub_category','general')"
                class="btn btn-sm buttonStyle btn-primary mr-2" data-bs-target="#subTypeModal"
                data-bs-toggle="modal"
                type="button" @click="addSubType">
              <i class="bi-plus mr-2" style="font-size: 15px;"></i>
              Add sub category
            </button>
          </div>
        </div>

      </div>


        <div class="row">

            <div class="col-12">

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
                                        class="bi-pencil mr-2 cursor-pointer"
                                        style="font-size: 13px;" @click="editClass(levelInfo)"></i>
                                <i 
                                v-if="can('delete_learning_material','general')" 
                                 class="bi-trash cursor-pointer" style="font-size: 13px;"
                                   @click="deleteClass(levelInfo, index)"></i>
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