<template>
    <div>

      <AppModal title="Add Grade Standard" v-model="showGradeStandardModal" lg>
        <NewGradeStandard></NewGradeStandard>
      </AppModal>

    
<!--        <div class="modal fade" id="addAccount" tabindex="-1"  aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
       <NewGradeStandard></NewGradeStandard>
        </div>
      </div>-->



     <div class="px-2 py-2 border-b">
           <div class="row">
            <div class="col-lg-6 "> 
                  <input type="text" class="form-control mt-1 mb-0" placeholder="Search...">  
            </div>
            <div class="col-lg-6">
                <button
                    @click="addGradingStandard"
                v-if="can('add_grade_standard','general')"
                 style="float: right; margin-right: 5px;" data-bs-toggle="modal" data-bs-target="#addAccount"  type="button"  aria-controls="rolesDialog" class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> New Grade-Standard </button>
            </div>
           </div>
     </div>




      <div class="mt-10">
        <table
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th>Descriptions</th>
          <th>Class</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(gradeList, index) in gradeStandardData " :key="index">
          <td>{{ gradeList.code }}</td>
          <td>{{ gradeList.name }}</td>
          <td>{{ gradeList.type }}</td>
          <td>{{ gradeList.description }}</td>
          <td>{{ gradeList.class }}</td>

          <td>
            <button  data-bs-toggle="modal" data-bs-target="#updateRoleModel" type="button" aria-controls="rolesDialog">
              <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
            </button>
            &nbsp;<span style="color: rgba(200, 195, 195, 0.363);">|</span>&nbsp;
            <button type="button">
              <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
            </button></td>
        </tr>


        </tbody>
      </table>
      </div>
    </div>
    
    
    
    </template>
    
    <script setup>
    import {onMounted,ref, watch} from "vue";
    import NewGradeStandard from "@/main/dashboard/assessment/assessmentComponents/NewGradeStandard.vue"
    import { useAssessmentStore } from "../store/assessment";
    import { useAbility } from '@casl/vue';
    import useNotificationStore from "@/composables/useNotification.js";
    import AppModal from "@/components/AppModal.vue";
    import {useRouter} from "vue-router";

    const { can } = useAbility()
    const assessmentStore = useAssessmentStore()
    const gradeStandardData = ref([])
    const errorMessage = ref(null)
    const notificationStore = useNotificationStore()
    const showGradeStandardModal = ref(false)
    const routerData = useRouter()
    const campusNumber = routerData.currentRoute.value.query.id

    onMounted(
    async () => {
      await doFetchGradingStandard()
    } )

   const doFetchGradingStandard = () => {
      let data = {
        campus_number:campusNumber
      }
     assessmentStore.fetchGradeStandard(data)
   }

    const addGradingStandard = () => {
      showGradeStandardModal.value = true
    }

    
watch (
    () => assessmentStore.gradeStandardResponse,
    async (data) => {
      if(data){
        gradeStandardData.value = data.data
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
    }
)

    watch(
        () => assessmentStore.newGradeStandardResponse,
        async (data) => {
          if(data){
            showGradeStandardModal.value = false
            await doFetchGradingStandard()
            notificationStore.successToast("Success", data.message)
          }
        }
    )

    </script>
    
    <style scoped>
    
    </style>