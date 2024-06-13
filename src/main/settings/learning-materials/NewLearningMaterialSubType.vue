<template>
    <div>

        <form @submit.prevent="addSubType">

            <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
                {{ classError }}
            </div>


          <div class="mb-2">
            <label class="textColor"><small>Code</small></label>
            <input
                @keypress="commons.codeValidator($event)"
                maxlength="10"
                type="text"
                v-model="form.code"
                @paste.prevent
                required
                class="form-control form-select-sm shadow-none">
          </div>



            <div>
                <label class="textColor"><small>Category</small></label>
                <select
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.category"
                        required
                        class="form-control form-select-sm">

                    <option disabled value="">--Select category--</option>
                    <option v-for="(lvl, index) in materialCategory" :key="index" :value="lvl.id">{{ lvl.name }}</option>

                </select>

            </div>




            <div class="mb-2">
                <label class="textColor"><small>Name</small></label>
                <input
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.name"
                        required
                        class="form-control form-select-sm">
            </div>



            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button
                        type="submit"
                        class="btn btn-primary border-0">
                    Save
                    <span v-if="loader" class="spinner-border text-light spinner-border-sm"
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
const materialCategory = ref([
    {
        name: "Learner",
        id: "learner"
    },
    {
        name: "Educator",
        id: "educator"
    }
])

const routerData = useRouter()

const resourceStore = useLearningMaterialStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()


const form = reactive({
    code: null,
    name: null,
    category: null,
})


const addSubType = () => {
    loader.value = true

    resourceStore.newLearningMaterialSubType(form)
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
            form.category = null
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