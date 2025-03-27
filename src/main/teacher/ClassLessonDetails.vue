<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import { useAbility } from '@casl/vue';
   import useCommonsStore from "@/composables/useCommons.js";
   import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
   import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
   import AppModal from "@/components/AppModal.vue";
   import moment from "moment";
import { data } from "autoprefixer";
   
   const levelStore = useLevelStore()
   const  notificationStore  = useNotificationStore()
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const classStore = useClassesStore()
   const schemeOfWorkStore = useSchemeOfWorkStore();

   const { can } = useAbility()
   const campusList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const curriculumList = ref([])
   const levelList = ref([])
   
   const academicYearList = ref([])
   const commons = useCommonsStore()
   const subjectStore = useSubjectStore()
   const streamListData = ref([])
   const page = ref(1)
   const per_page = ref(20)
   const uploadDialog = ref(false)
   const total_items = ref(0)
   const total_rows = ref(0)
   let classNo = ""
   const sessionListData = ref([])
   const lessonsDataList = ref([])
   const loading = ref(false)
   const openModal = ref(false)
    
   

      
   const props = defineProps({
    stepsData:[]
   })

     onMounted(() => {
       getStepsData()
      }
     )
   
const getStepsData = () => {
    if(props.stepsData){
        lessonsDataList.value = props.stepsData
    }
}
   
watch(
       () => props.stepsData,
       async (data) => {
         if(data){ 
            getStepsData()
         }
       },
       {deep:true}
     )

 

     const openSteps = ref([]);

const toggleStep = (stepNumber) => {
  if (openSteps.value.includes(stepNumber)) {
    openSteps.value = openSteps.value.filter(num => num !== stepNumber);
  } else {
    openSteps.value.push(stepNumber);
  }
};


const concepts = ref([
  {
    concept_name: "Number Sense",
    concept_number: "NS-001",
    steps_delivered: [
      { name: "Understanding Numbers", number: "ns1" },
      { name: "Basic Operations", number: "ns3" }
    ],
    all_steps: [
      { name: "Understanding Numbers", number: "ns1" },
      { name: "Place Value", number: "ns2" },
      { name: "Basic Operations", number: "ns3" },
      { name: "Fractions", number: "ns4" }
    ]
  },
  {
    concept_name: "Geometry",
    concept_number: "GEO-002",
    steps_delivered: [
      { name: "Shapes", number: "geo1" }
    ],
    all_steps: [
      { name: "Shapes", number: "geo1" },
      { name: "Angles", number: "geo2" },
      { name: "Symmetry", number: "geo3" }
    ]
  },
  {
    concept_name: "Algebra",
    concept_number: "ALG-003",
    steps_delivered: [
      { name: "Expressions", number: "alg1" },
      { name: "Equations", number: "alg2" }
    ],
    all_steps: [
      { name: "Expressions", number: "alg1" },
      { name: "Equations", number: "alg2" },
      { name: "Inequalities", number: "alg3" },
      { name: "Functions", number: "alg4" }
    ]
  },
  {
    concept_name: "Probability & Statistics",
    concept_number: "PS-004",
    steps_delivered: [
      { name: "Data Collection", number: "ps1" }
    ],
    all_steps: [
      { name: "Data Collection", number: "ps1" },
      { name: "Mean, Median, Mode", number: "ps2" },
      { name: "Probability Rules", number: "ps3" }
    ]
  }
]);

const isDelivered = (stepNumber, stepsDelivered) => {
  return stepsDelivered.some(step => step.number === stepNumber);
};

</script>

<template>

  <!-- <div>
    <div  class="lesson-container">
      <div v-for="(lsn, index) in lessonsDataList" :key="lsn.number" class="lesson-card">
        <div 
          class="lesson-title"
          @click="toggleStep(lsn.number)"
        >
          {{ lsn.name || "Untitled Step" }}
          <span class="toggle-icon">{{ openSteps.includes(lsn.number) ? "▼" : "▶" }}</span>
        </div>
        <div v-show="openSteps.includes(lsn.number)" class="lesson-content">
          <p>{{ lsn.concept || "No concept provided" }}</p>
          <ul class="list-group">
            <li class="list-group-item">
              Date : {{ lsn.date }} <br>Time : {{ lsn.time }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div> -->


  <div class="p-4 h-96 overflow-y-auto border rounded-lg shadow-md">
    <div v-for="(item, index) in concepts" :key="index" class="mb-6">
      <h2 class="text-xl font-bold mb-4">{{ item.concept_name }} ({{ item.concept_number }})</h2>
      <ul class="space-y-2">
        <li 
          v-for="step in item.all_steps" 
          :key="step.number" 
          class="flex items-center p-2 border rounded-lg" 
          :class="{'bg-green-100': isDelivered(step.number, item.steps_delivered)}"
        >
          <span class="flex-1">{{ step.name }} ({{ step.number }})</span>
          <span v-if="isDelivered(step.number, item.steps_delivered)" class="text-green-600 font-bold">✔</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.accordion-button {
  font-weight: bold;
}

.lesson-container {
  margin-bottom: 1rem;
}

.lesson-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.lesson-title {
  background-color: #007bff;
  color: white;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;
}

.lesson-title:hover {
  background-color: #0056b3;
}

.toggle-icon {
  font-size: 14px;
}

.lesson-content {
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
}
</style>