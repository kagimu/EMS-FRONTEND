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

</script>
<template>

   <!-- <div class="bg-white  rounded-md py-3 px-2">
      <div class="row mt-1">
         <div class="col-lg-11">
            <h5 style="font-size: 14px;margin-top: 2px;"> 
                <template v-for="(dt,indx) in lessonsDataList" :key="indx">
                       {{ dt.steps[0].concept }} / {{ dt.steps[0].topic }}
                </template>
            </h5>
         </div>
         <div class="col-lg-1">
         </div>
      </div>
      <div class="row">
                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin">

                <template v-for="(dat,inx) in lessonsDataList" :key="inx">
                    <div class="accordion" id="topicsAccordion">
    <div v-for="(dt, idx) in dat.steps" :key="idx" class="accordion-item">
      <h2 class="accordion-header">
        <button 
          class="accordion-button" 
          type="button" 
          data-bs-toggle="collapse" 
          :data-bs-target="'#topic-' + dt.number"
          :aria-controls="'topic-' + dt.number"
         >
          {{ dt.name || "-" }}
        </button>
      </h2>
      <div 
        :id="'topic-' + dt.number" 
        class="accordion-collapse collapse"
        :class="{ 'show': idx === 0 }"
        data-bs-parent="#topicsAccordion">
        <div class="accordion-body">
          <p><strong>Concept:</strong> {{ dt.concept || "No Concept Provided" }}</p>
          <p><strong>Sub-Topic:</strong> {{ dt.sub_topic || "N/A" }}</p>
          <p><strong>Time:</strong> {{ dt.time }}</p>
          <p><strong>Comment:</strong> {{ dt.comment || "No Comments" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


      </div>
      </div>

     
   </div> -->





  <!-- <div v-for="(dt, idx) in lessonsDataList" :key="dt.number" class="accordion" :id="'topicsAccordion-' + idx">
    <div v-for="(lsn, index) in dt.steps" :key="lsn.number" class="accordion-item">
      <h2 class="accordion-header">
        <button 
          class="accordion-button" 
          type="button" 
          data-bs-toggle="collapse" 
          :data-bs-target="'#collapse-' + lsn.number"
          :aria-controls="'collapse-' + lsn.number"
          :class="{ '': index !== 0 }">
          {{ lsn.name || 'Unnamed Step' }}
        </button>
      </h2>
      <div 
        :id="'collapse-' + lsn.number"
        class="accordion-collapse "
        :class="{ 'show': index === 0 }"
        :data-bs-parent="'#topicsAccordion-' + idx">
        <div class="accordion-body">
          <p>{{ lsn.concept || 'No Concept Provided' }}</p>
          <ul class="list-group">
            <li class="list-group-item">Students</li>
          </ul>
        </div>
      </div>
    </div>
  </div> -->


  <div>
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
             <!-- [ { "number": "972eb62e-ac77-430e-aab6-d4ae0178c490", "name": "step two", "concept": "External Parts of the Human Body.", "topic": "Introduce the Human Body", "subject": "", "sub_topic": "Growing in the Body",
              "date": "2025-03-29 03:00:00 +0300 EAT", "time": "11:01", "comment": "Very Good Class" } ] -->
              Date : {{ lsn.date }} <br>Time : {{ lsn.time }}
            </li>
          </ul>
        </div>
      </div>
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