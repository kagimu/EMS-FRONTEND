<template>
    <div>

        <form @submit.prevent="addLevel">

            <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
                {{ classError }}
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Code</small></label>
                <input
                        @keypress="commons.numbersOnlyValidator($event)"
                        maxlength="10"
                        type="text"
                        style="outline: none 0 !important;
               box-shadow: none;"
                        v-model="form.code"
                        required
                        class="form-control form-select-sm">
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.name"
                        required
                        class="form-control form-select-sm">
            </div>


            <div>
                <label class="textColor"><small>Type</small></label>
                <select
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.type"
                        required
                        class="form-control form-select-sm">

                    <option disabled value="">Select type</option>
                    <option v-for="(lvl, index) in materialType" :key="index" :value="lvl.id">{{ lvl.name }}</option>

                </select>

            </div>


            <div>


                <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="uploadError">
                    {{ uploadError }}
                </div>

                <div class="mb-3">
                    <label for="formFileSm" class="form-label">Choose file</label>
                    <input
                            ref="excel_file"
                            class="form-control form-control-sm noFocus"
                            id="formFileSm"
                            accept="application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            type="file">
                </div>
            </div>

            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button
                        type="submit"
                        class="btn btn-primary border-0">
                    Save
                    <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
                </button>
            </div>

        </form>


    </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";

import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useLearningMaterialStore} from "@/main/settings/learning-materials/resources_store.js";

const classError = ref(null)
const excel_file = ref(null)
const uploadError = ref(null)
const name = ref(null)
const loader = ref(false)
const materialType = ref([
    {
        name: "Book",
        id: "book"
    },
    {
        name: "Video",
        id: "video"
    },
    {
        name: "Audio",
        id: "audio"
    },
    {
        name: "Image",
        id: "image"
    },
    {
        name: "Document",
        id: "document"
    },
    {
        name: "Other",
        id: "other"

    }])
const routerData = useRouter()

const resourceStore = useLearningMaterialStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()


const form = reactive({
    code: null,
    name: null,
    type: null,
    upload: null,
})


const addLevel = () => {
    loader.value = true

    const formData = new FormData();
    formData.set("file", excel_file.value.files[0]);
    formData.set("code", form.code);
    formData.set("name", form.name);
    formData.set("type", form.type);
    resourceStore.newLearningMaterial(formData)
}


onMounted(
    () => {
        /* if(props.classNumber){
           classesStore.classDetails(props.classNumber)
         }*/
    }
)


watch(
    () => resourceStore.addMaterialResponse,
    async (data) => {
        notificationStore.successToast("Success", "Material added successfully")
        if (data) {
            form.name = null
            form.code = null
            loader.value = false
        }
    },
    {deep: true}
)


watch(
    () => resourceStore.errorMessage,
    async (data) => {
        if (data) {
            loader.value = false
            notificationStore.errorToast("Error", data.message)
        }
    },
    {deep: true}
)


</script>

<style scoped>
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>