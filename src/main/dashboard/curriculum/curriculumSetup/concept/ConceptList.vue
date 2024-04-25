<script setup>

import {ref} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewConcept from "@/main/dashboard/curriculum/curriculumSetup/concept/NewConcept.vue";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import {useSubjectClusterStore} from "@/main/dashboard/curriculum/curriculumSetup/subjectCluster/store/subjectCluster.js";
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";

import AppModal from "@/components/AppModal.vue";
import ConceptTable from "@/main/dashboard/curriculum/curriculumSetup/concept/ConceptTable.vue";
const routerData = useRouter()

const subjectStore = useSubjectStore()
const subjectClusterStore = useSubjectClusterStore()
const learningAreaStore = useLearningAreaStore()
const classStore = useClassesStore()
const notificationStore  = useNotificationStore()
const deletionLoader = ref( undefined)
const conceptDialog = ref( false)
const conceptEditMode = ref( false)
const subtopicList = ref( [])
const showExpandConceptModal = ref(false)



const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const classList = ref([])
const subject_cluster_number = ref("")
const subject_number = ref("")
const strand_number = ref("")
const topic_number = ref("")
const sub_topic_number = ref("")
const learning_area_number = ref("")
const class_number = ref("")
let  curriculumNumber = routerData.currentRoute.value.query.id


const addConcept = () => {
  conceptEditMode.value = false
  conceptDialog.value = true
}

const expandConceptUi = () => {
  showExpandConceptModal.value = true
}




</script>
<template>
  <div>

    <AppModal title="Concepts" v-model="showExpandConceptModal">
      <concept-table></concept-table>
    </AppModal>


    <AppModal :title="conceptEditMode ? 'Edit' : 'Add'" v-model="conceptDialog" lg>
      <new-concept></new-concept>
    </AppModal>


    <div class="flex justify-content-between mt-3">
      <div class="ml-4">Concept</div>

      <div>
        <button type="button"  class="btn btn-sm buttonStyle btn-success mr-2"  @click="expandConceptUi">
          <i style="font-size: 15px;"  class="bi-arrows-expand mr-2"></i>
          Expand
        </button>
        <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addConcept" data-bs-toggle="modal" data-bs-target="#subjectModal">
          <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
          Add Concept
        </button>
      </div>
    </div>

    <concept-table></concept-table>



  </div>
</template>



<style scoped>

</style>