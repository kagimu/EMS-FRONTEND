<template>
   

    <div class="mt-3">
    


  <div class="row">
        <div class="col-12">
          <div class="card">
           
            <div class="card-body" >
    <div >
      <div class="row">
  <div class="col-12">
    <div class="mt-3">

      <div class="row mx-auto">

        <div class="col-4 mb-5 mt-5">
          <div class="mb-2">
          <label class="textColor"><small>School</small></label>
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="school_number"
                  @change="fetchCampuses(school_number)"   
          >
              <option disabled value="">Select School</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div>
        </div>

        <div class="col-4 mb-5 mt-5">
      
          <div class="mb-2">
          <label class="textColor"><small>Campus</small> </label>
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="campus_number" required
                  @change="fetchClasses(campus_number)"
          >
              <option disabled value="">Select campus</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
              </option>
          </select>
      </div>
        </div>

        <div class="col-4 mb-5 mt-5">
         
      <!-- <div class="mb-2">
          <label class="textColor"><small>Class</small></label>
          <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm" required
                  v-model="class_number"
                  @change="fetchGradeScale(class_number)"
          >
              <option disabled value="">Select class</option>
              <option v-for="(list, index) in classList" :key="index" :value="list.class_number">{{ list.class_name }}
              </option>
          </select>
      </div> -->
        </div>

      </div>

    

    </div>
  </div>
</div>   
 Classes in Kampala Central Campus {{constent.cmp  }}
  <table id="data"
      class="table table-striped"
      style="font-size: 11px !important;" >
    <thead>
    <tr>
      <th scope="col">Class-Stream</th>
      <th scope="col">Class Teacher</th>
      <th scope="col">No.Students</th>
      <th scope="col">Classroom</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
      <tr>
        <td>P.1 East</td>
        <td>Mukasa Mbidde</td>
        <td>50</td>
        <td>Room 1A</td>
        <td>
          <button type="button" @click="goToClassList()" class="btn btn-outline-primary  btn-sm">
        Manage <i class="bi bi-arrow-right"></i>
      </button></td>
    </tr>

    <tr>
        <td>P.1 North</td>
        <td>Kyagulanyi B</td>
        <td>80</td>
        <td>Room 3A</td>
        <td>
    
      <button type="button" @click="goToClassList()" class="btn btn-outline-primary  btn-sm">
        Manage <i class="bi bi-arrow-right"></i>
      </button>
    </td>
    </tr>

    <tr>
        <td>P.4 SW</td>
        <td>Luka Muzamiru</td>
        <td>100</td>
        <td>Room 3A</td>
        <td>
          <button type="button" @click="goToClassList()" class="btn btn-outline-primary  btn-sm">
        Manage <i class="bi bi-arrow-right"></i>
      </button>
    </td>
    </tr>

        <!-- <tr v-for="(aggregateList,index) in aggregateData" :key="index">
        <td>{{aggregateList.name}}</td>
        <td>{{ aggregateList.name }}</td>
        <td>{{  aggregateList.min_value}} - {{  aggregateList.max_value}}</td>
        <td>{{aggregateList.min_scale}}</td>
        <td>{{aggregateList.school}}</td>
        <td>
      <button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
        <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
      </button>
      &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
      <button type="button">
        <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
      </button></td>
    </tr> -->

  
    </tbody>
  </table>
    </div>
    </div>
    </div>
    </div>
    </div>
</div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import {onMounted,reactive, computed,ref, watch} from "vue";
import NewGradeScale from "@/main/dashboard/assessment/assessmentComponents/NewGradeScale.vue"
import { useAssessmentStore } from '../assessment/store/assessment';
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

import { useAbility } from '@casl/vue';

const router = useRouter()

const goToClassList = () => {
  router.push('class-list') 
}

const { can } = useAbility()
    const aggregateData = ref([])
    const assessmentStore = useAssessmentStore()
    const errorMessage = ref(null)
    const campusList = ref([])
    const schoolList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const school_number = ref(null)
    const campus_number = ref(null)
    const class_number = ref(null)
    const showDialog = ref(null)


    const constent = reactive({
        sch:null,
        cmp:null,
        cla:null
    }) 
const fetchCampuses = (school_number) => {
      campusStore.fetchCampuses(school_number)
      // assessmentStore.fetchAggregateScale(school_number)
      constent.sch = school_number
  }

  const fetchClasses = (campus_number) => {
      campusStore.fetchClassesByCampus(campus_number)
      constent.cmp = campus_number

      
  }

  const fetchGradeScale = (class_number) =>{
    constent.cla = class_number
    window.alert(class_number)
    fetchScaleGrade(constent.cmp,constent.sch,constent.cla)
  }
  
  const fetchScaleGrade = (a,b,c) =>{
    assessmentStore.fetchAggregateScale(a,b,c)
  }

  onMounted(() => {
          schoolStore.fetchSchools()
      }
  )

  watch(
      () => schoolStore.schoolsResponse,
      async (data) => {
          if (data) {
              schoolList.value = data.data
          }
      },
      {deep: true}
  )

  watch(
      () => campusStore.campusListResponse,
      async (data) => {
          if (data) {
              campusList.value = data.data
          }
      },
      {deep: true}
  )

  watch(
      () => campusStore.campusClassesResponse,
      async (data) => {
          if (data) {
              classList.value = data.data
          }
      },
      {deep: true}
  )

  watch(
      () => campusStore.errorMessage,
      async (data) => {
            if (data) {
                notificationStore.errorToast("Error", data.message)
            }
      },
      {deep: true}
  )


// aggregateData
  watch(
    () => assessmentStore.aggregateScaleResponse,
    async (data) => {
      if(data){
        aggregateData.value = data.data
      }
    },
    {deep:true}
    )

    watch (
    () => assessmentStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        // notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
    )

</script>