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
const materialSubTypes = ref([])
const learningMaterialNumber = ref(null)
const routerData = useRouter()

const resourceStore = useLearningMaterialStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()


const props = defineProps({
  learningMaterialInfo:{}
})


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




const form = reactive({
  code: null,
  name: null,
  type: null,
  category: null,
  upload: null,
  sub_category:null
})


onMounted(
    () => {
       onBoardDraft()
    }
)



watch(
    () => props.learningMaterialInfo,
    async (data) => {
      if (data) {
        onBoardDraft()
      }
    }
)

const onBoardDraft = () => {
  let draft = props.learningMaterialInfo
  if(draft){
    form.name = draft.name
    form.code = draft.code
    form.type = draft.type
    form.category = draft.category
    form.sub_category = draft.sub_category_number
    learningMaterialNumber.value = draft.number
    FetchSubTypes()
  }
}


const addLevel = () => {
  loader.value = true

  const formData = new FormData();
  formData.set("file", excel_file.value.files[0]);
  formData.set("category", form.category);
  formData.set("sub_category", form.sub_category);
  formData.set("code", form.code);
  formData.set("name", form.name);
  formData.set("type", form.type);

  if(learningMaterialNumber.value){
    formData.set("learning_material_number", learningMaterialNumber.value);
    resourceStore.editLearningMaterial(formData)
  }else {
    resourceStore.newLearningMaterial(formData)
  }



}




const FetchSubTypes = async () => {
  await resourceStore.fetchLearningMaterialSubTypes(form.category)
}

watch(
    () => resourceStore.addMaterialResponse,
    async (data) => {
      notificationStore.successToast("Success", "Material added successfully")
      if (data) {
        form.name = null
        form.code = null
        form.type = null
        form.category = null
        form.sub_category = null
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


watch(
    () => resourceStore.materialsSubTypeResponse,
    async (data) => {
      if (data) {
        materialSubTypes.value = []
        data.data.forEach((item) => {
          materialSubTypes.value.push({
            name: item.name,
            id: item.number
          })
        })
      }
    },
    {deep: true}
)


</script>
<template>
    <div>
<!--{{learningMaterialInfo}}-->
        <form @submit.prevent="addLevel">

            <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
                {{ classError }}
            </div>


            <div class="mb-2">
                <label class="text-sm"><small>Code</small></label>
                <input
                        @keypress="commons.codeValidator($event)"
                        maxlength="10"
                        type="text"
                        v-model="form.code"
                        @paste.prevent
                        required
                        class="form-control form-select-sm shadow-none">
            </div>


            <div class="mb-2">
                <label class="text-sm"><small>Name</small></label>
                <input
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.name"
                        required
                        class="form-control form-select-sm">
            </div>


            <div>
                <label class="text-sm"><small>Category</small></label>
                <select
                        @change="FetchSubTypes"
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.category"
                        required
                        class="form-control form-select-sm">

                    <option disabled value="">--Select category--</option>
                    <option v-for="(lvl, index) in materialCategory" :key="index" :value="lvl.id">{{ lvl.name }}</option>

                </select>

            </div>


            <div>
                <label class="text-sm"><small>Sub category</small></label>
                <select

                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.sub_category"
                        required
                        class="form-control form-select-sm">

                    <option disabled value="">--Select sub type--</option>
                    <option v-for="(lvl, index) in materialSubTypes" :key="index" :value="lvl.id">{{ lvl.name }}</option>

                </select>

            </div>


            <div>
                <label class="text-sm"><small>Type</small></label>
                <select
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.type"
                        required
                        class="form-control form-select-sm">

                    <option disabled value="">--Select type--</option>
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
                        class="btn btn-primary border-0 px-5">
                     {{learningMaterialNumber ? 'Edit':'Save'}}
                    <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
                </button>
            </div>

        </form>


    </div>
</template>



<style scoped>
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>