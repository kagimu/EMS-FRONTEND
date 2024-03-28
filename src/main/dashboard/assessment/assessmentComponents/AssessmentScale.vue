<template>
    <div>
    
        <div class="modal fade" id="addAccount" tabindex="-1"  aria-labelledby="" aria-hidden="true" :class="{ show: showDialog }">
      <div class="modal-dialog">
       <NewAssessmentScale :scaleD="scaleD"></NewAssessmentScale>
        </div>
      </div>

      <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
                <button 
                v-if="can('add_grade_scale','general')"
                 style="float: right; margin-right: 5px;" data-bs-toggle="modal"
                  data-bs-target="#addAccount"  type="button"  aria-controls="rolesDialog" 
                  class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> New Assessment Scale </button>
 
                <!-- <button  class="btn btn-outline-secondary  btn-sm mt-1" style="float: right;border: none;">
                <small><i class="bi bi-printer">&nbsp;Print</i></small></button>  -->
            </div>
    
           </div>
               </div>
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
             
          <div class="mb-2">
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
          </div>
            </div>

          </div>

        

        </div>
      </div>
    </div>   
      <table id="data"
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">Name[ABBREV]</th>
          <th scope="col">Values(Min - Max)</th>
          <th scope="col">Grade</th>
          <th scope="col">Class</th>
          <th scope="col">Remarks</th>
          <th scope="col">Description</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
      <tr v-for="(scaleData, index) in assessmentScaleData" :key="index">
        <td>{{ scaleData.name + "["+ scaleData.abbreviation +"]" }}</td>
        <td>{{ scaleData.minimum_points + " - " + scaleData.maximum_points }}</td>
        <td>{{ scaleData.Grade }}</td>
        <td>{{ scaleData.CampusClass.class_name }}</td>
        <td>{{ scaleData.remarks }}</td>
        <td>{{ scaleData.description }}</td>
        <td>
          <button 
                    data-bs-toggle="modal" data-bs-target="#addAccount"
                    class="link-primary" style="border-width: 0px;text-decoration: none;" @click="openEditModal(scaleData)"><small> 
                    <i  style="font-size: 13px;color:rgb(5, 32, 171)" class="bi-pencil mr-2 cursor-pointer"></i></small></button>
                    <i style="font-size: 13px;color:rgb(202, 11, 11)" class="bi-trash cursor-pointer"></i>
        </td>
      </tr>
    
      
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
    import {onMounted,reactive, computed,ref, watch} from "vue";
    import NewAssessmentScale from "@/main/dashboard/assessment/assessmentComponents/NewAssessmentScale.vue"
    import { useAssessmentStore } from "../store/assessment";
  

    import { useAbility } from '@casl/vue';

    const { can } = useAbility()

    const assessmentStore = useAssessmentStore()
    const errorMessage = ref(null)
    const showDialog = ref(null)
    const assessmentScaleData = ref([])
    const scaleD = ref([])
    const showD = ref(false)
  
    onMounted(() => {
          assessmentStore.fetchAssessmentScale()
      }
  ) 

  watch(
    () => assessmentStore.assessmentScaleResponse,
    async (data) => {
      if(data){
        // notificationStore.successToast("Success", data.message)
        assessmentScaleData.value = data.data
      }
    },
    {deep:true}
)
    
const openEditModal = (a) =>{
  scaleD.value=a
  showDialog.value = true
}


watch (
  () => assessmentStore.errorMessage,
  async (data) => {
      if(data){
        notificationStore.errorToast("Error", data.message)
      }
    },
    {deep:true}
)
    </script>
    
    <style scoped>
    
    </style>