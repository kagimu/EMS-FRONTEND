<template>
    <div>
<!--<form @submit.prevent="addLessonPlanReference">
        &lt;!&ndash;{{subTopicData}}&ndash;&gt;

  <label class="textColor mt-3 mb-2 "><b>Add References</b></label>
        <div class="mx-auto" style="width: 95%;">


            <label class="textColor"><small>Learning Material </small></label>
                    <select
                            v-model="form.learning_material_number"
                            style="outline: none 0 !important; box-shadow: none;"
                            class="form-select form-select-sm"
                    >

                        <option disabled value="">Select Material</option>
                        <option v-for="(material, index) in learningMaterialsList" :key="index" :value="material.number">
                            {{material.code+". "+material.name}}
                        </option>
                    </select>


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
                <label class="textColor"><small>Reference Description </small></label>
                <textarea
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.name"
                        required
                        class="form-control form-select-sm"></textarea>
            </div>


            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button
                        type="submit"
                        class="btn btn-sm btn-secondary border-0 mt-2">
                    Save reference
                    <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
                </button>
            </div>

        </div>



</form>-->


        <form @submit.prevent="addLessonPlanReference">

            <div class="row mx-auto">
                <div class="col-lg-10 content mx-auto">


                    <div class="row mt-2">
                        <div class="col-lg-3 content">
                            <small>Code</small>
                        </div>
                        <div class="col-lg-3 content">
                            <small>
                                Learning Material
                            </small>
                        </div>
                        <div class="col-lg-5 content">
                            <small>
                                Reference description
                            </small>
                        </div>
                    </div>


                    <div v-for="(lst, idx) in form.references" :key="idx">
                        <div class="row">
                            <div class="col-lg-3 content">
                                <input
                                        @keypress="commons.numbersOnlyValidator($event)"
                                        maxlength="10"
                                        style="outline: none 0 !important; box-shadow: none;"
                                        type="text"
                                        v-model="lst.code"
                                        required
                                        class="form-control form-control-sm">
                            </div>
                            <div class="col-lg-3 content">


                                <select
                                        style="box-shadow: none;"
                                        class="form-select form-select-sm"
                                        v-model="lst.learning_material_number"
                                >
                                    <option disabled value="">Select Material</option>
                                    <option v-for="(list, index) in learningMaterialsList" :key="index" :value="list.number">
                                        {{list.code+". "+list.name}}
                                    </option>
                                </select>

                            </div>
                            <div class="col-lg-5 content">
                                <input
                                        style="outline: none 0 !important; box-shadow: none;"
                                        type="text"
                                        v-model="lst.name"
                                        required
                                        class="form-control form-control-sm">
                            </div>
                            <div class="col-lg-1 content">
                                <button
                                        @click="removeRef(idx)"
                                        type="button"
                                        class="btn-close btn-sm border-0">
                                </button>
                            </div>
                        </div>

                    </div>
                    <button
                            @click="addRef"
                            type="button"
                            class="btn btn-sm btn-secondary border-0 mt-2">
                        <i style="font-size: 15px;" class="bi-plus mr-1"></i>
                        Add Reference
                    </button>


                    <div class="flex justify-content-end" style="width: 100%;">
                        <button
                                type="submit"
                                class="btn btn-primary border-0">
                            {{(form && form.references[0].number) ? 'Edit' : 'Save'}}
                            <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
                        </button>
                    </div>


                </div>
            </div>





        </form>


    </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import {useLearningMaterialStore} from "@/main/settings/learning-materials/resources_store.js";
import useCommonsStore from "@/composables/useCommons.js";
const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const learningMaterialsList = ref([])
const routerData = useRouter()
const  notificationStore  = useNotificationStore()
const resourcesStore = useLearningMaterialStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
const commons = useCommonsStore()

const form = reactive({references:[{
    code: "",
    name: "",
    learning_material_number: null,
}],
    lesson_plan_number: null,
})



const classStore = useClassesStore()
const campusLevel = routerData.currentRoute.value.query.crr
const campusNumber = routerData.currentRoute.value.query.id

const subTopicData = ref(null)
const subTopicNumber = ref(null)

const props = defineProps({
    lesson_plan_number: null,
})

const addRef = () => {

    let data = {
        code: (form.references.length + 1),
        learning_material_number: "",
        name: "",
    }
    form.references.push(data)
}

const removeRef = (idx) => {
    form.references.splice(idx, 1)
}


const learningMaterialNumber = ref(null)


/*
const addLearningMaterial = (materialInfo) =>{
    loader.value = true
    resourcesStore.newCurriculumSubtopicReference({material_code:materialInfo.code,material_number:materialInfo.number, campus_number:campusNumber, sub_topic_number:subTopicNumber.value})
}

*/


onMounted(
    () =>{
        resourcesStore.fetchLearningMaterials()
    }
)



async function addLessonPlanReference(){
    loader.value = true
    form.lesson_plan_number = props.lesson_plan_number
    await schemeOfWorkStore.saveLessonPlanReference(form)
    loader.value = false
}


watch(
    () => resourcesStore.learningMaterialsResponse,
    async (data) => {
        if(data){
            learningMaterialsList.value = data.data
        }
    },
    {deep:true}
)

watch(
    () => schemeOfWorkStore.addReferenceResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
          loader.value = false
      }
    },
    {deep:true}
)

watch(
    () => props.subTopicInfo,
    async (data) => {
        if(data){
            subTopicData.value = data
            subTopicNumber.value = data.number
            /* let arr = []
             data.forEach(lst => {
               arr.push(lst.curriculum_class_number)
             })
             learningMaterialNumber.value = arr*/
        }
    },
    {deep:true}
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